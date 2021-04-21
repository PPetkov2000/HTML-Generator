import { transformToCamelCase } from "./utils.js";

const elementsById = [
  "generate-element-wrapper",
  "generated-elements",
  "generated-elements-graph",
  "generate-button",
];

const elementsByClassName = [
  "select-elements",
  "element-content",
  "element-attributes",
  "element-attributes-input",
  "add-nested-element-button",
  "element-fields",
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
  const elements = document.querySelectorAll(`.${className}`);
  return elements.length === 1 ? elements[0] : elements;
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
