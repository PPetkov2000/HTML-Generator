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
  formatElement,
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
    function appendOptions(select, options) {
      options.forEach((option) => {
        select.appendChild(option);
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
    renderGraph();
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
    renderGraph();
    resetFields();
  },
  removeElement: (e) => {
    e.target.parentElement.remove();
  },
  selectElement: (e) => {
    console.log(e.target);
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
          formatElement(element.element),
          element.attributes,
          ""
        );
      } else {
        domElement = getInnermostChild(domElement);
      }
      element.children.forEach((child) => {
        const childElement = generateElement(
          formatElement(child.element),
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

function buildElementsGraph(element, store = null) {
  if (store == null) {
    store = createAccordion(
      element.element,
      element.children.length === 0 ? element.value : ""
    );
  }
  store.querySelectorAll(".accordion-button").forEach((buttonElement) => {
    buttonElement.setAttribute("data-id", "select-element");
  });
  element.children.forEach((child) => {
    const accordion = createAccordion(
      child.element,
      child.children.length === 0 ? child.value : ""
    );
    const accordionContentElements = store.querySelectorAll(
      ".accordion-content"
    );
    const lastAccordionContentElement =
      accordionContentElements[accordionContentElements.length - 1];
    lastAccordionContentElement.appendChild(accordion);
    buildElementsGraph(child, store);
  });
  return store;
}

function renderGraph() {
  domReferences.generatedElementsGraph().innerHTML = "";
  const elementsGraph = buildElementsGraph(graphElements[0]);
  domReferences.generatedElementsGraph().appendChild(elementsGraph);
}

function resetFields() {
  domReferences.selectElements().value = "";
  domReferences.elementAttributes().value = "";
  domReferences.elementAttributesInput().value = "";
  domReferences.elementContent().value = "";
}

function clickHandler(e) {
  if (!e.target.dataset.id) return;
  const dataId = transformToCamelCase(e.target.dataset.id);
  if (typeof actions[dataId] === "function") {
    actions[dataId](e);
  }
}

document.addEventListener("click", clickHandler);
