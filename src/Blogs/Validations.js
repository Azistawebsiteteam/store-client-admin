export const handleValidationErrors = (inputValues) => {
  const validationsMsgs = {};
  if (!inputValues.title) {
    validationsMsgs.title = "Title is required";
  }
  if (!inputValues.description) {
    validationsMsgs.description = "Description is required";
  }
  if (!inputValues.content) {
    validationsMsgs.content = "Content is required";
  }
  if (!inputValues.product) {
    validationsMsgs.product = "Product is required";
  }
  if (!inputValues.type) {
    validationsMsgs.type = "Type is required";
  }
  if (!inputValues.blogImg) {
    validationsMsgs.blogImg = "Blog Image is required";
  }
  if (!inputValues.blogThumbnailImg) {
    validationsMsgs.blogThumbnailImg = "Blog Thumbnail Image is required";
  }
  return validationsMsgs;
};
