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

let parentElement = null;

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
    const addNestedElementButton = createButton("Add nested element", {
      className: "add-nested-element-button generate-button",
    });
    const removeElementButton = createButton("X", {
      className: "close-button",
    });
    addNestedElementButton.setAttribute("data-id", "build-element-fields");
    removeElementButton.setAttribute("data-id", "remove-element-fields");
    const elementContentFormGroup = createDiv(
      [
        createLabel("Element content"),
        createInput("", {
          className: "element-content",
          placeholder: "Element content",
        }),
        createSpan("OR"),
        addNestedElementButton,
        removeElementButton,
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
    const elementFields = domReferences.elementFields();
    const lastElementFields =
      elementFields.length > 1
        ? elementFields[elementFields.length - 1]
        : elementFields;
    const [
      selectElements,
      elementContent,
      elementAttributes,
      elementAttributesInput,
    ] = getChildElements(
      lastElementFields,
      "select-elements",
      "element-content",
      "element-attributes",
      "element-attributes-input"
    );

    const attributes = getAttributes(elementAttributes, elementAttributesInput);
    const element = generateElement(
      htmlFactory,
      `create${capitalize(selectElements.value)}`,
      attributes,
      elementContent.value
    );

    if (!parentElement) {
      parentElement = element;
    } else {
      let currentParentElement = parentElement;
      currentParentElement = checkForChildren(parentElement);
      currentParentElement.appendChild(element);
    }

    domReferences.generatedElements().appendChild(parentElement);
  },
  removeElementFields: (e) => {
    console.log(e.target);
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

function getChildElements(parentElement, ...elements) {
  return elements.map((element) => parentElement.querySelector(`.${element}`));
}

function disableFields(fields) {}

function clickHandler(e) {
  if (!e.target.dataset.id) return;
  const dataId = transformToCamelCase(e.target.dataset.id);
  if (typeof actions[dataId] === "function") {
    actions[dataId](e);
  }
}

document.addEventListener("click", clickHandler);
