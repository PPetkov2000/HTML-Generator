import htmlElementsFactory from "./htmlFactory.js";
import domReferences from "./domReferences.js";
import { htmlElements } from "./htmlElements.js";
import { htmlAttributes } from "./htmlAttributes.js";
import {
  generateSelectFormGroup,
  generateInputFromGroup,
} from "./htmlElementsGroup.js";
import { getAttributes, capitalize } from "./utils.js";

const actions = {
  buildElement: () => {
    if (!domReferences.selectElements().value) return;

    const attributes = getAttributes(
      domReferences.elementAttributes(),
      domReferences.elementAttributesInput()
    );
    const nestedAttributes = getAttributes(
      domReferences.nestedElementAttributesSelect(),
      domReferences.nestedElementAttributesInput()
    );
    const element = generateElement(
      htmlElementsFactory,
      `create${capitalize(domReferences.selectElements().value)}`,
      attributes,
      domReferences.nestedElementSelect() &&
        domReferences.nestedElementSelect().value
        ? generateElement(
            htmlElementsFactory,
            `create${capitalize(domReferences.nestedElementSelect().value)}`,
            nestedAttributes,
            domReferences.nestedElementContent().value
          )
        : domReferences.elementContent().value
    );
    domReferences.generatedElements().appendChild(element);
  },
  buildNestedElement: () => {
    const selectFormGroup = generateSelectFormGroup(
      htmlElements,
      "Generate nested element",
      { id: "nested-element-select", className: "nested-element-select" }
    );
    const contentInputFormGroup = generateInputFromGroup(
      "Nested element content",
      {
        id: "nested-element-content",
        className: "nested-element-content",
        placeholder: "Nested element content",
      }
    );
    const attributesSelectFormGroup = generateSelectFormGroup(
      htmlAttributes,
      "Nested element attributes",
      {
        id: "nested-element-attributes-select",
        className: "nested-element-attributes-select",
      }
    );
    const nestedElementAttributesInput = htmlElementsFactory.createInput("", {
      id: "nested-element-attributes-input",
      className: "nested-element-attributes-input",
      placeholder: "Nested element attributes",
    });
    attributesSelectFormGroup.appendChild(nestedElementAttributesInput);
    domReferences
      .generateNestedElementWrapper()
      .append(
        selectFormGroup,
        contentInputFormGroup,
        attributesSelectFormGroup
      );
  },
};

domReferences.generateButton().addEventListener("click", actions.buildElement);
domReferences
  .addNestedElementButton()
  .addEventListener("click", actions.buildNestedElement);

function generateElement(factory, elementCreator, attributes, content) {
  if (typeof factory[elementCreator] === "function") {
    return factory[elementCreator](content, attributes);
  }
}
