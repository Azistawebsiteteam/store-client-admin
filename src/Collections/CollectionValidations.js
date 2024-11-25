export const handleCollectionValidations = (collectionData) => {
  const collectionValidationErrors = {};
  if (collectionData.title === "") {
    collectionValidationErrors["title"] = "Title is required";
  }
  if (collectionData.content === "") {
    collectionValidationErrors.content = "Content is required";
  }
  //   if (collectionData.metaTitle === "") {
  //     collectionValidationErrors.metaTitle = "Meta Title is required";
  //   }
  //   if (collectionData.metaDescription === "") {
  //     collectionValidationErrors.metaDescription = "Meta Description is required";
  //   }
  if (collectionData.collectionImg === "") {
    collectionValidationErrors.collectionImg = "Collection Image is required";
  }
  return collectionValidationErrors;
};
