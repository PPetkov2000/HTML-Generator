import htmlFactory from "../htmlFactory.js";

const { createDiv, createButton } = htmlFactory;

function createAccordion(title, content) {
  const accordionButton = createButton(title, {
    className: "accordion-button",
  });
  const accordionContent = createDiv(content, {
    className: "accordion-content",
  });

  accordionButton.addEventListener("click", (e) => {
    e.target.classList.toggle("active");
    e.target.nextElementSibling.classList.toggle("show");
  });

  return createDiv([accordionButton, accordionContent], {
    className: "accordion",
  });
}

export default createAccordion;
