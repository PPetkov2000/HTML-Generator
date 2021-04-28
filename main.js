import htmlFactory from "./htmlFactory.js";
import domReferences from "./domReferences.js";
import { htmlElements } from "./htmlElements.js";
import { htmlAttributes } from "./htmlAttributes.js";
import {
  getAttributes,
  generateElement,
  getInnermostChild,
  capitalize,
  transformToCamelCase,
} from "./utils.js";
import createAccordion from "./accordion/accordion.js";

const { createDiv, createOption } = htmlFactory;

const graphElements = [];
let selectedElementDom = null;

const actions = {
  buildSelectOptions: () => {
    const selectElementOptions = getOptions(htmlElements);
    const selectElementAttributeOptions = getOptions(htmlAttributes);
    appendOptions(domReferences.selectElements(), selectElementOptions);
    appendOptions(
      domReferences.elementAttributes(),
      selectElementAttributeOptions
    );
    function getOptions(options) {
      return options.map((option) => createOption(option, { value: option }));
    }
    function appendOptions(parentElement, options) {
      options.forEach((option) => {
        parentElement.appendChild(option);
      });
    }
  },
  buildElement: () => {
    const currentElement = {
      element: domReferences.selectElements().value,
      attributes: getAttributes(
        domReferences.elementAttributes(),
        domReferences.elementAttributesInput()
      ),
      value: domReferences.elementContent().value,
      children: [],
      parentElement: null,
      id: Date.now(),
    };
    if (graphElements.length === 0) {
      graphElements.push(currentElement);
    } else if (selectedElementDom) {
      console.log(
        "There is a selected dom element inside the 'buildElement' function"
      );
      console.log(selectedElementDom);
    } else {
      const innermostElement = getInnermostChild(graphElements[0]);
      currentElement.parentElement = innermostElement;
      innermostElement.children.push(currentElement);
    }

    // const removeElementButton = createDiv("", { className: "remove-element" });
    // removeElementButton.setAttribute("data-id", "remove-element");
    // const graphElement = createDiv(
    //   [currentElement.element, removeElementButton],
    //   { id: currentElement.id, className: "graph-element" }
    // );
    // graphElement.setAttribute("data-id", "select-element");
    // domReferences.generatedElementsGraph().appendChild(graphElement);
    const elementsGraph = buildElementsGraph(graphElements[0]);
    domReferences.generatedElementsGraph().innerHTML = "";
    domReferences.generatedElementsGraph().appendChild(elementsGraph);
    resetFields();
  },
  buildSiblingElement: () => {
    const innermostElement = getInnermostChild(graphElements[0]);
    const parentElement = selectedElementDom
      ? selectedElementDom.parentElement
      : innermostElement.parentElement;
    parentElement.children.push({
      element: domReferences.selectElements().value,
      attributes: getAttributes(
        domReferences.elementAttributes(),
        domReferences.elementAttributesInput()
      ),
      value: domReferences.elementContent().value,
      children: [],
      parentElement: null,
      id: Date.now(),
    });
    resetFields();
  },
  removeElement: (e) => {
    e.target.parentElement.remove();
  },
  selectElement: (e) => {
    function searchElementTree(element) {
      if (element.children.length === 0) return;
      if (element.id === Number(e.target.id)) {
        selectedElementDom = element;
        return element;
      }
      element.children.forEach((child) => {
        searchElementTree(child);
      });
    }
    searchElementTree(graphElements[0]);
    domReferences.selectedElement().textContent = `Selected element: ${e.target.textContent}`;
  },
  outputElement: () => {
    function buildDomElement(element, domElement = null) {
      if (element.children.length === 0) return;
      if (domElement == null) {
        domElement = generateElement(
          `create${capitalize(element.element)}`,
          element.attributes,
          ""
        );
      } else {
        domElement = getInnermostChild(domElement);
      }
      element.children.forEach((child) => {
        const childElement = generateElement(
          `create${capitalize(child.element)}`,
          child.attributes,
          child.children.length === 0 ? child.value : ""
        );
        domElement.appendChild(childElement);
        buildDomElement(child, domElement);
      });
      return domElement;
    }
    const result = buildDomElement(graphElements[0]);
    domReferences.generatedElements().appendChild(result);
  },
};

actions.buildSelectOptions();

function resetFields() {
  domReferences.selectElements().value = "";
  domReferences.elementAttributes().value = "";
  domReferences.elementAttributesInput().value = "";
  domReferences.elementContent().value = "";
}

function buildElementsGraph(element) {
  const accordion = createAccordion(
    element.element,
    element.children.length === 0
      ? element.value
      : element.children.map((child) =>
          createAccordion(child.element, child.value)
        )
  );
  element.children.forEach((child) => {
    buildElementsGraph(child);
  });
  return accordion;
}

function clickHandler(e) {
  if (!e.target.dataset.id) return;
  const dataId = transformToCamelCase(e.target.dataset.id);
  if (typeof actions[dataId] === "function") {
    actions[dataId](e);
  }
}

document.addEventListener("click", clickHandler);

// import Select from "./customSelect/customSelect.js";

// const select = document.getElementById("select");
// const customSelect = new Select(select);
// console.log(customSelect);
