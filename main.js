import htmlFactory from "./htmlFactory.js";
import domReferences from "./domReferences.js";
import { htmlElements } from "./htmlElements.js";
import { htmlAttributes } from "./htmlAttributes.js";
import {
  getAttributes,
  generateElement,
  getInnermostChild,
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
      const innermostElement = getInnermostChild(graphElements[0]);
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
  buildSiblingElement: (e) => {
    const innermostElement = getInnermostChild(graphElements[0]);
    const innermostElementParent = innermostElement.parentElement;
    const createdElement = generateElement(
      `create${capitalize(domReferences.selectElements().value)}`,
      domReferences.elementContent().value,
      getAttributes(
        domReferences.elementAttributes().value,
        domReferences.elementAttributesInput().value
      )
    );
    console.log(createdElement);
    innermostElementParent.appendChild(createdElement);
  },
  removeElement: (e) => {
    e.target.parentElement.remove();
  },
  outputElement: () => {
    function buildDomElement(element, domElement = null) {
      if (element.children.length === 0) return;
      if (domElement == null) {
        domElement = generateElement(
          `create${capitalize(element.element)}`,
          element.attributes,
          ""
        );
      } else {
        domElement = getInnermostChild(domElement);
      }
      element.children.forEach((child) => {
        const childElement = generateElement(
          `create${capitalize(child.element)}`,
          child.attributes,
          child.children.length === 0 ? child.value : ""
        );
        domElement.appendChild(childElement);
        buildDomElement(child, domElement);
      });
      return domElement;
    }
    const result = buildDomElement(graphElements[0]);
    domReferences.generatedElements().appendChild(result);
  },
};

actions.buildElementFields();

function resetFields(...fields) {
  fields.forEach((field) => {
    field.value = "";
  });
}

function clickHandler(e) {
  if (!e.target.dataset.id) return;
  const dataId = transformToCamelCase(e.target.dataset.id);
  if (typeof actions[dataId] === "function") {
    actions[dataId](e);
  }
}

document.addEventListener("click", clickHandler);
