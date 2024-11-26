export const handleValidationError = (imgDetails, imgValue) => {
  const validationErrors = {};
  if (imgDetails.bannerType === "") {
    validationErrors["bannerType"] = "Banner Type is required";
  }
  if (imgDetails.title === "") {
    validationErrors["title"] = "Title is required";
  } else if (imgDetails.title.length <= 4) {
    validationErrors["title"] = "Title must be at least 5 characters long";
  }
  if (imgDetails.backgroundUrl === "") {
    validationErrors["backgroundUrl"] = "Background URL is required";
  } else if (imgDetails.backgroundUrl.length <= 10) {
    validationErrors["backgroundUrl"] =
      "Background URL must be at least 7 characters long";
  }
  if (imgValue.webBanner === "") {
    validationErrors["webBanner"] = "Web Banner is required";
  }
  if (imgValue.mobileBanner === "") {
    validationErrors["mobileBanner"] = "Mobile Banner is required";
  }

  return validationErrors;
};
