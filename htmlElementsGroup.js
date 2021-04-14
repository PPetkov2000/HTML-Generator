import htmlElementsFactory from "./htmlFactory.js";

const {
  createLabel,
  createSelect,
  createOption,
  createInput,
  createDiv,
} = htmlElementsFactory;

function generateSelectFormGroup(optionValues, label, attributes) {
  const selectLabel = createLabel(label, { htmlFor: attributes.id });
  const options = [
    createOption(""),
    ...optionValues.map((element) => createOption(element, { value: element })),
  ];
  const select = createSelect(options, { id: attributes.id });
  return createDiv([selectLabel, select], { className: "form-group" });
}

function generateInputFromGroup(label, attributes) {
  const inputLabel = createLabel(label, { htmlFor: attributes.id });
  const input = createInput("", {
    id: attributes.id,
    placeholder: attributes.placeholder,
  });
  return createDiv([inputLabel, input], { className: "form-group" });
}

export { generateSelectFormGroup, generateInputFromGroup };