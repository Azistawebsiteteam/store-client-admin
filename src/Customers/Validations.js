export const handleCustomersValidations = (categoriesData) => {
  const categoriesValidationErrors = {};
  if (categoriesData.categoryImg === "") {
    categoriesValidationErrors["categoryImg"] = "Category Image is required";
  }
  if (categoriesData.categoryData?.text === "") {
    categoriesValidationErrors.text = "Title is required";
  }
  if (categoriesData.categoryData?.description === "") {
    categoriesValidationErrors.description = "Content is required";
  }
  if (categoriesData.subCategories?.[0]?.subCategoryName === "") {
    categoriesValidationErrors.subCategoryName =
      "Sub-category Name is required";
  }
  return categoriesValidationErrors;
};
