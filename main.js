import htmlFactory from "./htmlFactory.js";
import domReferences from "./domReferences.js";
import { htmlElements } from "./htmlElements.js";
import { htmlAttributes } from "./htmlAttributes.js";
import {
  getAttributes,
  generateElement,
  getInnermostChild,
  transformToCamelCase,
  formatElement,
  traverseElement,
} from "./utils.js";
import createAccordion from "./accordion/accordion.js";

const { createOption } = htmlFactory;

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
      selectedElementDom.children.push(currentElement);
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
    selectedElementDom = traverseElement(graphElements[0]).find(
      (el) => el.id === Number(e.target.parentElement.id)
    );
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

function buildElementsGraph(element, accordions = null) {
  if (accordions == null) {
    accordions = createAccordion(
      element.element,
      element.children.length === 0 ? element.value : ""
    );
    accordions.id = element.id;
  }
  accordions.querySelectorAll(".accordion-button").forEach((buttonElement) => {
    buttonElement.setAttribute("data-id", "select-element");
  });

  element.children.forEach((child) => {
    const accordion = createAccordion(
      child.element,
      child.children.length === 0 ? child.value : ""
    );
    accordion.id = child.id;

    console.log(selectedElementDom);
    if (selectedElementDom) {
      console.log(child);
      console.log(selectedElementDom);
      console.log(
        Number(accordion.id),
        selectedElementDom.id,
        Number(accordion.id) === selectedElementDom.id
      );
      console.log(accordion);
    }

    const accordionContentElements = accordions.querySelectorAll(
      ".accordion-content"
    );
    console.log([...accordions.querySelectorAll(".accordion")]);
    const accordionContentElement = selectedElementDom
      ? [...accordions.querySelectorAll(".accordion")]
          .find((x) => Number(x.id) === selectedElementDom.id)
          .querySelector(".accordion-content")
      : accordionContentElements[accordionContentElements.length - 1];
    accordionContentElement.appendChild(accordion);
    buildElementsGraph(child, accordions);
  });
  return accordions;
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

// import createCustomSelectElement from "./customSelect/customSelect.js";

// const select = document.getElementById("select");
// const customSelect = createCustomSelectElement(select);
// console.log(customSelect);

const elementTree = {
  element: "section",
  attributes: { id: "sectionId" },
  value: "section value",
  children: [
    {
      element: "article",
      attributes: { id: "articleId" },
      value: "article value",
      children: [
        {
          element: "main",
          attributes: { id: "mainId" },
          value: "main value",
          children: [],
          parentElement: "article",
          id: 3,
        },
        {
          element: "aside",
          attributes: { id: "asideId" },
          value: "aside value",
          children: [],
          parentElement: "article",
          id: 4,
        },
      ],
      parentElement: "section",
      id: 2,
    },
    {
      element: "div",
      attributes: { id: "divId" },
      value: "div value",
      children: [],
      parentElement: "section",
      id: 5,
    },
  ],
  parentElement: null,
  id: 1,
};

// console.log(traverseElement(elementTree));
setTimeout(() => {
  selectedElementDom = {
    element: "article",
    attributes: { id: "articleId" },
    value: "article value",
    children: [
      {
        element: "main",
        attributes: { id: "mainId" },
        value: "main value",
        children: [],
        parentElement: "article",
        id: 3,
      },
      {
        element: "aside",
        attributes: { id: "asideId" },
        value: "aside value",
        children: [],
        parentElement: "article",
        id: 4,
      },
    ],
    parentElement: "section",
    id: 2,
  };
}, 1000);
console.log(buildElementsGraph(elementTree));
setTimeout(() => {
  console.log(buildElementsGraph(elementTree));
}, 2000);
