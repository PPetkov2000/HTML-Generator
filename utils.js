import htmlFactory from "./htmlFactory.js";

// DOM utils
function createElement(type, content, attributes) {
  const element = document.createElement(type);

  if (attributes !== undefined) {
    Object.assign(element, attributes);
  }

  if (Array.isArray(content)) {
    content.forEach(append);
  } else {
    append(content);
  }

  function append(node) {
    if (typeof node === "string" || typeof node === "number") {
      node = document.createTextNode(node);
    }
    element.appendChild(node);
  }

  return element;
}

function getAttributes(select, input) {
  const attributes = {};
  if (elementsExist(select, input) && select.value && input.value) {
    Object.assign(attributes, { [select.value]: input.value });
  }
  return attributes;
}

function elementsExist(...elements) {
  return elements.every((element) => element != null);
}

function traverseElement(element, childElementsFound = []) {
  if (element.children.length === 0) return [element];
  element.children.forEach((child) => {
    childElementsFound.push(child);
    traverseElement(child, childElementsFound);
  });
  return [element, ...childElementsFound];
}

function getInnermostChild(element) {
  if (element.children.length === 0) return element;
  return getInnermostChild(element.children[0]);
}

function generateElement(elementCreator, attributes, content) {
  if (typeof htmlFactory[elementCreator] === "function") {
    return htmlFactory[elementCreator](content, attributes);
  }
}

// String utils
function capitalize(str) {
  return str.slice(0, 1).toUpperCase() + str.slice(1).toLowerCase();
}

function transformToCamelCase(str) {
  if (str.includes("-")) {
    const parts = str.split("-");
    str = parts[0] + parts.slice(1).map(capitalize).join("");
  }
  return str;
}

function formatElement(element) {
  return `create${capitalize(element)}`;
}

export {
  createElement,
  getAttributes,
  elementsExist,
  traverseElement,
  generateElement,
  getInnermostChild,
  capitalize,
  transformToCamelCase,
  formatElement,
};
