export const handleBrandsValidations = (brandsData) => {
  const brandsValidationErrors = {};
  if (brandsData.brandName === "") {
    brandsValidationErrors["brandName"] = "Brand name is required";
  }
  if (brandsData.description === "") {
    brandsValidationErrors.description = "Content is required";
  }
  if (brandsData.brandImg === "") {
    brandsValidationErrors.brandImg = "Brand Image is required";
  }
  return brandsValidationErrors;
};
