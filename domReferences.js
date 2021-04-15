import { transformToCamelCase } from "./utils.js";

const elementsById = [
  "generate-element-wrapper",
  "generated-elements",
  "select-elements",
  "element-content",
  "element-attributes",
  "element-attributes-input",
  "generate-button",
];

const elementsByClassName = [
  "nested-element-fields",
  "nested-element-select",
  "nested-element-content",
  "nested-element-attributes-select",
  "nested-element-attributes-input",
  "add-nested-element-button",
  "close-button",
];

const elementsByTagName = [];

const idReferences = domReferencesCreator(elementsById, getElementById);
const classReferences = domReferencesCreator(
  elementsByClassName,
  getElementsByClassName
);
const tagReferences = domReferencesCreator(
  elementsByTagName,
  getElementsbyTagName
);

function getElementById(id) {
  return document.getElementById(id);
}

function getElementsByClassName(className) {
  return document.querySelector(`.${className}`);
}

function getElementsbyTagName(tagName) {
  return document.getElementsByTagName(tagName);
}

function domReferencesCreator(references, getReferencesFn) {
  return references.reduce((acc, curr) => {
    acc[transformToCamelCase(curr)] = getReferencesFn.bind(undefined, curr);
    return acc;
  }, {});
}

const domReferences = Object.assign(
  {},
  idReferences,
  classReferences,
  tagReferences
);

export default domReferences;
