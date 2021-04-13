import { htmlElements } from "./htmlElements.js";
import { createElement, capitalize } from "./utils.js";

const htmlElementsFactory = htmlElements.reduce((acc, curr) => {
  acc[`create${capitalize(curr)}`] = createElement.bind(undefined, curr);
  return acc;
}, {});

export default htmlElementsFactory;
