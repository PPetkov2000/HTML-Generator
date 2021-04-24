import htmlFactory from "./htmlFactory.js";
import domReferences from "./domReferences.js";
import { htmlElements } from "./htmlElements.js";
import { htmlAttributes } from "./htmlAttributes.js";
import {
  getAttributes,
  getChildren,
  capitalize,
  transformToCamelCase,
} from "./utils.js";

const {
  createDiv,
  createSelect,
  createOption,
  createLabel,
  createInput,
} = htmlFactory;

const graphElements = [];

const actions = {
  buildElementFields: () => {
    const selectElementsFormGroup = createDiv(
      [
        createLabel("Generate HTML element"),
        createSelect(
          [
            createOption(""),
            ...htmlElements.map((element) =>
              createOption(element, { value: element })
            ),
          ],
          { className: "select-elements" }
        ),
      ],
      { className: "form-group" }
    );
    const elementContentFormGroup = createDiv(
      [
        createLabel("Element content"),
        createInput("", {
          className: "element-content",
          placeholder: "Element content",
        }),
      ],
      { className: "form-group" }
    );
    const selectAttributesFormGroup = createDiv(
      [
        createLabel("Attributes"),
        createSelect(
          [
            createOption(""),
            ...htmlAttributes.map((attribute) =>
              createOption(attribute, { value: attribute })
            ),
          ],
          { className: "element-attributes" }
        ),
        createInput("", {
          className: "element-attributes-input",
          placeholder: "Element attributes",
        }),
      ],
      { className: "form-group" }
    );
    const elementFields = createDiv(
      [
        selectElementsFormGroup,
        elementContentFormGroup,
        selectAttributesFormGroup,
      ],
      { className: "element-fields" }
    );

    domReferences.generateElementWrapper().appendChild(elementFields);
  },
  buildElement: () => {
    const currentElement = {
      element: domReferences.selectElements().value,
      attributes: getAttributes(
        domReferences.elementAttributes(),
        domReferences.elementAttributesInput()
      ),
      value: domReferences.elementContent().value,
      children: [],
      parentElement: null,
    };
    if (graphElements.length === 0) {
      graphElements.push(currentElement);
    } else {
      const innermostElement = checkForChildren(graphElements[0]);
      currentElement.parentElement = innermostElement;
      innermostElement.children.push(currentElement);
    }
    const removeElementButton = createDiv("", { className: "remove-element" });
    removeElementButton.setAttribute("data-id", "remove-element");
    domReferences.generatedElementsGraph().appendChild(
      createDiv([currentElement.element, removeElementButton], {
        className: "graph-element",
      })
    );
    [...domReferences.generatedElementsGraph().children].forEach(
      (child, index) => {
        child.style.marginLeft = `${index * 20}px`;
      }
    );
    resetFields(
      domReferences.selectElements(),
      domReferences.elementAttributes(),
      domReferences.elementAttributesInput(),
      domReferences.elementContent()
    );
  },
  removeElement: (e) => {
    e.target.parentElement.remove();
  },
  outputElement: () => {
    const children = getChildren(graphElements[0]);
    const graphDomElements = [graphElements[0], ...children].map((x) =>
      generateElement(
        htmlFactory,
        `create${capitalize(x.element)}`,
        x.attributes,
        x.value
      )
    );
    console.log(graphDomElements);
    console.log(graphElements);
    let parentElement = graphElements[0];
    function getChildElements(element) {
      if (element.children.length === 0) return;
      element.children.forEach((child) => {
        const el = htmlFactory[`create${capitalize(child.element)}`](
          child.value,
          child.attributes
        );
        if (el.parentElement === element) {
          parentElement.appendChild(el);
        }
        getChildElements(child);
      });
      console.log(element);
      // domReferences.generatedElements().appendChild(element);
    }
    getChildElements(graphElements[0]);
    // graphDomElements.forEach((element) => {
    //   domReferences.generatedElements().appendChild(element);
    // });
  },
};

actions.buildElementFields();

function generateElement(factory, elementCreator, attributes, content) {
  if (typeof factory[elementCreator] === "function") {
    return factory[elementCreator](content, attributes);
  }
}

function checkForChildren(element) {
  if (element.children.length === 0) return element;
  return checkForChildren(element.children[0]);
}

function resetFields(...fields) {
  fields.forEach((field) => {
    field.value = "";
  });
  return "Reset fields";
}

function clickHandler(e) {
  if (!e.target.dataset.id) return;
  const dataId = transformToCamelCase(e.target.dataset.id);
  if (typeof actions[dataId] === "function") {
    actions[dataId](e);
  }
}

document.addEventListener("click", clickHandler);
