import htmlFactory from "./htmlFactory.js";
import domReferences from "./domReferences.js";
import { htmlElements } from "./htmlElements.js";
import { htmlAttributes } from "./htmlAttributes.js";
import { getAttributes, capitalize } from "./utils.js";

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
        createLabel("Generate HTML element", {
          htmlFor: "nested-element-select",
        }),
        createSelect(
          [
            createOption(""),
            ...htmlElements.map((element) =>
              createOption(element, { value: element })
            ),
          ],
          { id: "select-elements", className: "select-elements" }
        ),
      ],
      { className: "form-group" }
    );
    const elementContentFormGroup = createDiv(
      [
        createLabel("Element content", {
          htmlFor: "nested-element-select",
        }),
        createInput("", {
          id: "element-content",
          className: "element-content",
          placeholder: "Element content",
        }),
        createSpan("OR"),
        createButton("Add nested element", {
          id: "add-nested-element-button",
          className: "add-nested-element-button generate-button",
        }),
        createButton("X", { id: "close-button", className: "close-button" }),
      ],
      { className: "form-group" }
    );
    const selectAttributesFormGroup = createDiv(
      [
        createLabel("Attributes", {
          htmlFor: "element-attributes",
        }),
        createSelect(
          [
            createOption(""),
            ...htmlAttributes.map((attribute) =>
              createOption(attribute, { value: attribute })
            ),
          ],
          {
            id: "element-attributes",
            className: "element-attributes",
          }
        ),
        createInput("", {
          id: "element-attributes-input",
          className: "element-attributes-input",
          placeholder: "Element attributes",
        }),
      ],
      { className: "form-group" }
    );

    domReferences
      .generateElementWrapper()
      .prepend(
        selectElementsFormGroup,
        elementContentFormGroup,
        selectAttributesFormGroup
      );
  },
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
      htmlFactory,
      `create${capitalize(domReferences.selectElements().value)}`,
      attributes,
      domReferences.nestedElementSelect() &&
        domReferences.nestedElementSelect().value
        ? generateElement(
            htmlFactory,
            `create${capitalize(domReferences.nestedElementSelect().value)}`,
            nestedAttributes,
            domReferences.nestedElementContent().value
          )
        : domReferences.elementContent().value
    );
    domReferences.generatedElements().appendChild(element);
  },
  buildNestedElementFields: () => {
    domReferences.elementContent().disabled = true;
    domReferences.elementContent().value = "";

    const selectElementsFormGroup = createDiv(
      [
        createLabel("Generate nested element", {
          htmlFor: "nested-element-select",
        }),
        createSelect(
          [
            createOption(""),
            ...htmlElements.map((element) =>
              createOption(element, { value: element })
            ),
          ],
          { id: "nested-element-select", className: "nested-element-select" }
        ),
      ],
      { className: "form-group" }
    );
    const elementContentFormGroup = createDiv(
      [
        createLabel("Nested element content", {
          htmlFor: "nested-element-select",
        }),
        createInput("", {
          id: "nested-element-content",
          className: "nested-element-content",
          placeholder: "Nested element content",
        }),
      ],
      { className: "form-group" }
    );
    const selectAttributesFormGroup = createDiv(
      [
        createLabel("Nested element attributes", {
          htmlFor: "nested-element-attributes-select",
        }),
        createSelect(
          [
            createOption(""),
            ...htmlAttributes.map((attribute) =>
              createOption(attribute, { value: attribute })
            ),
          ],
          {
            id: "nested-element-attributes-select",
            className: "nested-element-attributes-select",
          }
        ),
        createInput("", {
          id: "nested-element-attributes-input",
          className: "nested-element-attributes-input",
          placeholder: "Nested element attributes",
        }),
      ],
      { className: "form-group" }
    );

    domReferences
      .nestedElementFields()
      .append(
        selectElementsFormGroup,
        elementContentFormGroup,
        selectAttributesFormGroup
      );
  },
  removeElementFields: (e) => {
    console.log(e.target);
  },
};

actions.buildElementFields();

domReferences.generateButton().addEventListener("click", actions.buildElement);
domReferences
  .addNestedElementButton()
  .addEventListener("click", actions.buildNestedElementFields);
domReferences
  .closeButton()
  .addEventListener("click", actions.removeElementFields);

function generateElement(factory, elementCreator, attributes, content) {
  if (typeof factory[elementCreator] === "function") {
    return factory[elementCreator](content, attributes);
  }
}
