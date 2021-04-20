import htmlFactory from "./htmlFactory.js";
import domReferences from "./domReferences.js";
import { htmlElements } from "./htmlElements.js";
import { htmlAttributes } from "./htmlAttributes.js";
import { getAttributes, capitalize, transformToCamelCase } from "./utils.js";

const {
  createDiv,
  createSelect,
  createOption,
  createLabel,
  createInput,
  createSpan,
  createButton,
} = htmlFactory;

const graphElements = [];

const actions = {
  buildElementFields: () => {
    const selectElementsFormGroup = createDiv(
      [
        createLabel("Generate HTML element"),
        createSelect(
          [
            createOption(""),
            ...htmlElements.map((element) =>
              createOption(element, { value: element })
            ),
          ],
          { className: "select-elements" }
        ),
      ],
      { className: "form-group" }
    );
    const elementContentFormGroup = createDiv(
      [
        createLabel("Element content"),
        createInput("", {
          className: "element-content",
          placeholder: "Element content",
        }),
      ],
      { className: "form-group" }
    );
    const selectAttributesFormGroup = createDiv(
      [
        createLabel("Attributes"),
        createSelect(
          [
            createOption(""),
            ...htmlAttributes.map((attribute) =>
              createOption(attribute, { value: attribute })
            ),
          ],
          { className: "element-attributes" }
        ),
        createInput("", {
          className: "element-attributes-input",
          placeholder: "Element attributes",
        }),
      ],
      { className: "form-group" }
    );
    const elementFields = createDiv(
      [
        selectElementsFormGroup,
        elementContentFormGroup,
        selectAttributesFormGroup,
      ],
      { className: "element-fields" }
    );

    domReferences.generateElementWrapper().appendChild(elementFields);
  },
  buildElement: () => {
    graphElements.push(domReferences.selectElements().value);
    const graphDomElements = graphElements.map((element) =>
      createDiv(element, { className: "graph-element" })
    );
    const graphDomElementsWrapper = createDiv(graphDomElements, {
      id: "graph-elements-wrapper",
      className: "graph-elements-wrapper",
    });
    const graphDomElementsChildren = [...graphDomElementsWrapper.children];
    const lastGraphChild =
      graphDomElementsChildren[graphDomElementsChildren.length - 1];
    graphDomElementsChildren.forEach((child, index) => {
      child.style.marginLeft = `${index * 20}px`;
    });
    if (domReferences.elementContent().value) {
      lastGraphChild.textContent = domReferences.elementContent().value;
    }
    domReferences.generatedElementsGraph().innerHTML = "";
    domReferences.generatedElementsGraph().appendChild(graphDomElementsWrapper);
  },
  removeElement: (e) => {
    console.log(e.target);
  },
  outputElement: () => {
    [...domReferences.generatedElementsGraph().children].forEach((child) => {
      domReferences.generatedElements().appendChild(child);
    });
  },
};

actions.buildElementFields();

function generateElement(factory, elementCreator, attributes, content) {
  if (typeof factory[elementCreator] === "function") {
    return factory[elementCreator](content, attributes);
  }
}

function checkForChildren(element) {
  if (element.children.length === 0) return element;
  return checkForChildren(element.children[0]);
}

function clickHandler(e) {
  if (!e.target.dataset.id) return;
  const dataId = transformToCamelCase(e.target.dataset.id);
  if (typeof actions[dataId] === "function") {
    actions[dataId](e);
  }
}

document.addEventListener("click", clickHandler);

//  buildElement: () => {
//    const elementFields = domReferences.elementFields();
//    const lastElementFields =
//      elementFields.length > 1
//        ? elementFields[elementFields.length - 1]
//        : elementFields;
//    const selectElements = lastElementFields.querySelector(".select-elements");
//    const elementContent = lastElementFields.querySelector(".element-content");
//    const elementAttributes = lastElementFields.querySelector(
//      ".element-attributes"
//    );
//    const elementAttributesInput = lastElementFields.querySelector(
//      ".element-attributes-input"
//    );

//    const attributes = getAttributes(elementAttributes, elementAttributesInput);
//    const element = generateElement(
//      htmlFactory,
//      `create${capitalize(selectElements.value)}`,
//      attributes,
//      elementContent.value
//    );

//    if (!parentElement) {
//      parentElement = element;
//    } else {
//      let currentParentElement = parentElement;
//      currentParentElement = checkForChildren(parentElement);
//      currentParentElement.appendChild(element);
//    }

//    domReferences.generatedElementsGraph().appendChild(parentElement);
//  };
