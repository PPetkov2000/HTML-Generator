const htmlElements = [
  "section",
  "article",
  "main",
  "aside",
  "nav",
  "header",
  "footer",
  "div",
  "p",
  "span",
  "ol",
  "ul",
  "li",
  "a",
  "input",
  "img",
  "select",
  "option",
  "label",
];

function capitalize(str) {
  return str.slice(0, 1).toUpperCase() + str.slice(1).toLowerCase();
}

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

const htmlElementsFactory = htmlElements.reduce((acc, curr) => {
  acc[`create${capitalize(curr)}`] = createElement.bind(undefined, curr);
  return acc;
}, {});

generateButton.addEventListener("click", () => {
  const nestedElementSelect = document.getElementById("nested-element-select");
  const nestedElementAttributesSelect = document.getElementById(
    "nested-element-attributes-select"
  );
  const nestedElementContent = document.getElementById(
    "nested-element-content"
  );
  const nestedElementAttributes = document.getElementById(
    "nested-element-attributes"
  );
  const attributes = {};
  const nestedAttributes = {};
  if (elementAttributes.value && elementAttributesInput.value) {
    Object.assign(attributes, {
      [elementAttributes.value]: elementAttributesInput.value,
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
          attributes,
          nestedElementContent.value
        )
      : elementContent.value
  );
  document.getElementById("generated-elements").appendChild(element);
});

addNestedElementButton.addEventListener("click", () => {
  const selectFormGroup = generateSelectFormGroup("Generate nested element", {
    id: "nested-element-select",
  });
  const contentInputFormGroup = generateInputFromGroup(
    "Nested element content",
    { id: "nested-element-content", placeholder: "Nested element content..." }
  );
  const attributesInputFormGroup = generateInputFromGroup(
    "Nested element attributes",
    {
      id: "nested-element-attributes",
      placeholder: "Nested element attributes...",
    }
  );
  const attributesSelectFormGroup = generateSelectFormGroup(
    "Nested element attributes",
    { id: "nested-element-attributes-select" }
  );
  document
    .getElementById("generate-nested-element-wrapper")
    .append(
      selectFormGroup,
      contentInputFormGroup,
      attributesSelectFormGroup,
      attributesInputFormGroup
    );
});

function generateElement(factory, elementCreator, attributes, content) {
  if (typeof factory[elementCreator] === "function") {
    return factory[elementCreator](content, attributes);
  }
}

function generateSelectFormGroup(label, attributes) {
  const selectLabel = htmlElementsFactory.createLabel(label, {
    htmlFor: attributes.id,
  });
  const defaultOption = htmlElementsFactory.createOption("");
  const options = [
    defaultOption,
    ...htmlElements.map((element) =>
      htmlElementsFactory.createOption(element, { value: element })
    ),
  ];
  const select = htmlElementsFactory.createSelect(options, {
    id: attributes.id,
  });
  return htmlElementsFactory.createDiv([selectLabel, select], {
    className: "form-group",
  });
}

function generateInputFromGroup(label, attributes) {
  const inputLabel = htmlElementsFactory.createLabel(label, {
    htmlFor: attributes.id,
  });
  const input = htmlElementsFactory.createInput("", {
    id: attributes.id,
    placeholder: attributes.placeholder,
  });
  return htmlElementsFactory.createDiv([inputLabel, input], {
    className: "form-group",
  });
}

// const { createDiv, createP } = htmlElementsFactory;
// const div = createDiv(
//   [
//     createP("I am a paragraph", { className: "container__paragraph" }),
//     createP("I am a paragraph", { className: "container__paragraph" }),
//   ],
//   { className: "container" }
// );
