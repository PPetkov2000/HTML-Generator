import htmlElementsFactory from "./htmlFactory.js";
import { htmlElements } from "./htmlElements.js";
import { htmlAttributes } from "./htmlAttributes.js";
import {
  generateSelectFormGroup,
  generateInputFromGroup,
} from "./htmlElementsGroup.js";
import { capitalize, elementsExist } from "./utils.js";

const selectElements = document.getElementById("select-elements");
const elementContent = document.getElementById("element-content");
const elementAttributes = document.getElementById("element-attributes");
const elementAttributesInput = document.getElementById(
  "element-attributes-input"
);
const generateButton = document.getElementById("generate-button");
const addNestedElementButton = document.getElementById(
  "add-nested-element-button"
);

generateButton.addEventListener("click", () => {
  if (!selectElements.value) return;

  const nestedElementSelect = document.getElementById("nested-element-select");
  const nestedElementContent = document.getElementById(
    "nested-element-content"
  );
  const nestedElementAttributesSelect = document.getElementById(
    "nested-element-attributes-select"
  );
  const nestedElementAttributesInput = document.getElementById(
    "nested-element-attributes-input"
  );
  const attributes = {};
  const nestedAttributes = {};
  if (elementAttributes.value && elementAttributesInput.value) {
    Object.assign(attributes, {
      [elementAttributes.value]: elementAttributesInput.value,
    });
  }
  if (
    elementsExist(
      nestedElementAttributesSelect,
      nestedElementAttributesInput
    ) &&
    nestedElementAttributesSelect.value &&
    nestedElementAttributesInput.value
  ) {
    Object.assign(nestedAttributes, {
      [nestedElementAttributesSelect.value]: nestedElementAttributesInput.value,
    });
  }
  const element = generateElement(
    htmlElementsFactory,
    `create${capitalize(selectElements.value)}`,
    attributes,
    nestedElementSelect && nestedElementSelect.value
      ? generateElement(
          htmlElementsFactory,
          `create${capitalize(nestedElementSelect.value)}`,
          nestedAttributes,
          nestedElementContent.value
        )
      : elementContent.value
  );
  document.getElementById("generated-elements").appendChild(element);
});

addNestedElementButton.addEventListener("click", () => {
  const selectFormGroup = generateSelectFormGroup(
    htmlElements,
    "Generate nested element",
    { id: "nested-element-select" }
  );
  const contentInputFormGroup = generateInputFromGroup(
    "Nested element content",
    { id: "nested-element-content", placeholder: "Nested element content" }
  );
  const attributesSelectFormGroup = generateSelectFormGroup(
    htmlAttributes,
    "Nested element attributes",
    { id: "nested-element-attributes-select" }
  );
  const nestedElementAttributesInput = htmlElementsFactory.createInput("", {
    id: "nested-element-attributes-input",
    placeholder: "Nested element attributes",
  });
  attributesSelectFormGroup.appendChild(nestedElementAttributesInput);
  document
    .getElementById("generate-nested-element-wrapper")
    .append(selectFormGroup, contentInputFormGroup, attributesSelectFormGroup);
});

function generateElement(factory, elementCreator, attributes, content) {
  if (typeof factory[elementCreator] === "function") {
    return factory[elementCreator](content, attributes);
  }
}
