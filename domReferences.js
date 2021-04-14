const domReferences = {
  generatedElements: () => document.getElementById("generated-elements"),
  generateNestedElementWrapper: () =>
    document.getElementById("generate-nested-element-wrapper"),
  selectElements: () => document.getElementById("select-elements"),
  elementContent: () => document.getElementById("element-content"),
  elementAttributes: () => document.getElementById("element-attributes"),
  elementAttributesInput: () =>
    document.getElementById("element-attributes-input"),
  nestedElementSelect: () => document.querySelector(".nested-element-select"),
  nestedElementContent: () => document.querySelector(".nested-element-content"),
  nestedElementAttributesSelect: () =>
    document.querySelector(".nested-element-attributes-select"),
  nestedElementAttributesInput: () =>
    document.querySelector(".nested-element-attributes-input"),
  generateButton: () => document.getElementById("generate-button"),
  addNestedElementButton: () =>
    document.getElementById("add-nested-element-button"),
};

export default domReferences;
