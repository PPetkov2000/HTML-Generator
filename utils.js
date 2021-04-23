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

function getChildren(element, childElementsFound = []) {
  if (element.children.length === 0) return;
  element.children.forEach((child) => {
    childElementsFound.push(child);
    getChildren(child, childElementsFound);
  });
  return childElementsFound;
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

export {
  createElement,
  getAttributes,
  elementsExist,
  getChildren,
  capitalize,
  transformToCamelCase,
};
