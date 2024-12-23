export const handleValidationErrors = (inputValues) => {
  const validationsMsgs = {};
  if (!inputValues.type) {
    validationsMsgs.type = "Select Faq Type";
  }
  if (!inputValues.question) {
    validationsMsgs.question = "Enter the Question";
  } else if (inputValues.question.length < 5) {
    validationsMsgs.question = "Question should have at least 5 characters";
  }
  if (!inputValues.answer) {
    validationsMsgs.answer = "Enter the Answer";
  }
  if (inputValues.type === "Product" && !inputValues.productId) {
    validationsMsgs.productId = "Choose the Product";
  }
  return validationsMsgs;
};
