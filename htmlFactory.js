import { htmlElements } from "./htmlElements.js";
import { createElement, formatElement } from "./utils.js";

const htmlElementsFactory = htmlElements.reduce((acc, curr) => {
  acc[formatElement(curr)] = createElement.bind(undefined, curr);
  return acc;
}, {});

export default htmlElementsFactory;
