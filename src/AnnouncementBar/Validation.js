export const handleValidationError = (announcementBarContent) => {
  const validationErrors = {};
  if (announcementBarContent.annoncementBarTxt === "") {
    validationErrors["annoncementBarTxt"] = "Title is required";
  } else if (announcementBarContent.annoncementBarTxt.length <= 10) {
    validationErrors["annoncementBarTxt"] =
      "Title must be at least 10 characters long";
  }
  if (announcementBarContent.annoncementBarMobTxt === "") {
    validationErrors["annoncementBarMobTxt"] = "Title(Mobile) is required";
  } else if (announcementBarContent.annoncementBarMobTxt.length <= 10) {
    validationErrors["annoncementBarMobTxt"] =
      "Title(Mobile) must be at least 5 characters long";
  }
  if (announcementBarContent.bgLink === "") {
    validationErrors["bgLink"] = "Background URL is required";
  } else if (announcementBarContent.bgLink.length <= 10) {
    validationErrors["bgLink"] =
      "Background URL must be at least 7 characters long";
  }

  return validationErrors;
};
