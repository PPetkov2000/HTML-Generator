import htmlFactory from "../htmlFactory.js";
const { createDiv, createLabel, createUl, createLi } = htmlFactory;

class Select {
  constructor(element) {
    this.element = element;
    this.customElement = createDiv("", {
      className: "custom-element-container",
    });
    this.customElementLabel = createLabel("Select element", {
      className: "custom-element-label",
    });
    this.customElementList = createUl("", { className: "custom-element-list" });
    this.options = element
      .querySelectorAll("option")
      .map((option) =>
        createLi(option.value, { className: "custom-element-list-item" })
      );
    element.after(this.customElement);
  }
}

export default Select;
