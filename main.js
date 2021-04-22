import htmlFactory from "./htmlFactory.js";
import domReferences from "./domReferences.js";
import { htmlElements } from "./htmlElements.js";
import { htmlAttributes } from "./htmlAttributes.js";
import { getAttributes, capitalize, transformToCamelCase } from "./utils.js";

const {
  createDiv,
  createSelect,
  createOption,
  createLabel,
  createInput,
  createSpan,
  createButton,
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
    const graphDomElements = graphElements.map((x) =>
      generateElement(
        htmlFactory,
        `create${capitalize(x.element)}`,
        x.attributes,
        x.value
      )
    );
    console.log(graphElements);
    console.log(graphDomElements);
    if (graphElements.length > 0) {
      console.log(getChildren(graphElements[0]));
    }
    resetFields(
      domReferences.selectElements(),
      domReferences.elementAttributes(),
      domReferences.elementAttributesInput(),
      domReferences.elementContent()
    );
    // const graphDomElements = graphElements.map((element) =>
    //   createDiv(element.element, { className: "graph-element" })
    // );
    // const graphDomElementsWrapper = createDiv(graphDomElements, {
    //   id: "graph-elements-wrapper",
    //   className: "graph-elements-wrapper",
    // });
    // const graphDomElementsChildren = [...graphDomElementsWrapper.children];
    // const lastGraphChild =
    //   graphDomElementsChildren[graphDomElementsChildren.length - 1];
    // graphDomElementsChildren.forEach((child, index) => {
    //   child.style.marginLeft = `${index * 20}px`;
    // });
    // if (domReferences.elementContent().value) {
    //   lastGraphChild.textContent = domReferences.elementContent().value;
    // }
    // domReferences.generatedElementsGraph().innerHTML = "";
    // domReferences.generatedElementsGraph().appendChild(graphDomElementsWrapper);
  },
  removeElement: (e) => {
    console.log(e.target);
  },
  outputElement: () => {
    const element = generateElement(
      htmlFactory,
      `create${capitalize(domReferences.selectElements().value)}`,
      getAttributes(
        domReferences.elementAttributes(),
        domReferences.elementAttributesInput()
      ),
      domReferences.elementContent().value
    );
    console.log(element);
    [...domReferences.generatedElementsGraph().children].forEach((child) => {
      domReferences.generatedElements().appendChild(child);
    });
    // domReferences.generatedElements();
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

function getChildren(element, domElements = []) {
  if (element.children.length === 0) return element;
  element.children.forEach((child) => {
    if (child.children.length > 0) {
      getChildren(child, domElements);
    }
    domElements.push(child);
  });
  return domElements;
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
