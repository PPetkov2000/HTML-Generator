import htmlFactory from "../htmlFactory.js";
const { createDiv, createLabel, createUl, createLi } = htmlFactory;

const ACTIVE_CLASS = "active";
const SHOW_CLASS = "show";

function createCustomSelectElement(element) {
  element.style.display = "none";
  const options = [...element.querySelectorAll("option")].map((option) =>
    createLi(option.textContent, { className: "custom-element-list-item" })
  );
  const customElementLabel = createLabel("Select element", {
    className: "custom-element-label",
  });
  const customElementList = createUl(options, {
    className: "custom-element-list",
  });
  const customElement = createDiv([customElementLabel, customElementList], {
    className: "custom-element-container",
  });
  customElementLabel.addEventListener("click", () => {
    customElementList.classList.toggle(SHOW_CLASS);
  });
  customElementList.addEventListener("click", (e) => {
    options.forEach((option) => {
      option.classList.remove(ACTIVE_CLASS);
    });
    if (e.target.nodeName.toLowerCase() === "li") {
      e.target.classList.add(ACTIVE_CLASS);
      customElementLabel.textContent = e.target.textContent;
    }
  });
  customElement.tabIndex = 0;
  customElement.addEventListener("keydown", (e) => {
    const activeElement = customElement.querySelector(`.${ACTIVE_CLASS}`);
    if (e.key === "Enter" || e.key === "Escape") {
      customElementList.classList.remove(SHOW_CLASS);
    } else if (e.key === " ") {
      customElementList.classList.toggle(SHOW_CLASS);
    }
    return changeActiveElement(e.key, activeElement, customElementLabel);
  });
  element.after(customElement);
  return customElement;
}

function changeActiveElement(eventKey, element, label) {
  const elementToChange = getElementToChange(eventKey, element);
  if (elementToChange == null) return;
  element.classList.remove(ACTIVE_CLASS);
  elementToChange.classList.add(ACTIVE_CLASS);
  elementToChange.scrollIntoView({ block: "nearest" });
  label.textContent = elementToChange.textContent;
}

function getElementToChange(key, element) {
  if (element == null) return;
  if (key === "ArrowUp") {
    return element.previousElementSibling;
  } else if (key === "ArrowDown") {
    return element.nextElementSibling;
  }
}

export default createCustomSelectElement;
