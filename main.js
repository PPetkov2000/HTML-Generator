import htmlFactory from "./htmlFactory.js";
import domReferences from "./domReferences.js";
import { htmlElements } from "./htmlElements.js";
import { htmlAttributes } from "./htmlAttributes.js";
import { getAttributes, capitalize, elementsExist } from "./utils.js";

const {
  createDiv,
  createSelect,
  createOption,
  createLabel,
  createInput,
  createSpan,
  createButton,
} = htmlFactory;

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
        createSpan("OR"),
        createButton("Add nested element", {
          className: "add-nested-element-button generate-button",
        }),
        createButton("X", { className: "close-button" }),
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
    const selectElements = lastElementFields.querySelector(".select-elements");
    const elementContent = lastElementFields.querySelector(".element-content");
    const elementAttributes = lastElementFields.querySelector(
      ".element-attributes"
    );
    const elementAttributesInput = lastElementFields.querySelector(
      ".element-attributes-input"
    );
    function generateNestedElement() {
      const element = generateElement(
        htmlFactory,
        `create${capitalize(selectElements.value)}`,
        attributes,
        elementContent.value
      );
      elementFields.forEach((field) => {
        element.appendChild(field);
      });
      console.log(element);
      return element;
    }
    const attributes = getAttributes(elementAttributes, elementAttributesInput);
    const element = generateElement(
      htmlFactory,
      `create${capitalize(selectElements.value)}`,
      attributes,
      elementFields.length > 1 ? generateNestedElement : elementContent.value
    );
    console.log(element);
    domReferences.generatedElements().appendChild(element);
  },
  removeElementFields: (e) => {
    console.log(e.target);
  },
};

actions.buildElementFields();

domReferences.generateButton().addEventListener("click", actions.buildElement);
domReferences
  .addNestedElementButton()
  .addEventListener("click", actions.buildElementFields);
domReferences
  .closeButton()
  .addEventListener("click", actions.removeElementFields);

function generateElement(factory, elementCreator, attributes, content) {
  if (typeof factory[elementCreator] === "function") {
    return factory[elementCreator](content, attributes);
  }
}

// function clickHandler(e) {
//   if (typeof actions[e.target.id] === "function") {
//     actions[e.target.id]();
//   }
// }

// document.addEventListener("click", clickHandler)
