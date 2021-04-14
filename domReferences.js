import { transformToCamelCase } from "./utils.js";

const elementsById = [
  "generated-elements",
  "generate-nested-element-wrapper",
  "select-elements",
  "element-content",
  "element-attributes",
  "element-attributes-input",
  "generate-button",
  "add-nested-element-button",
];

const elementsByClassName = [
  "nested-element-select",
  "nested-element-content",
  "nested-element-attributes-select",
  "nested-element-attributes-input",
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
