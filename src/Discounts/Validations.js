export const handleValidationsErrors = (commonFields) => {
  const validationErrorMessage = {};
  if (!commonFields.disTitle) {
    validationErrorMessage.disTitle = "Title is required";
  }
  if (
    commonFields.custEligibility === "specificCustomer" &&
    commonFields.selectedCustomers?.length === 0
  ) {
    validationErrorMessage.selectedCustomers = "Please select the customers";
  }
  if (
    commonFields.maxDisUses === "mutipleTimeDiscntUses" &&
    !commonFields.usageLimit
  ) {
    validationErrorMessage.usageLimit = "Please enter the usage limit";
  }
  if (commonFields.maxUses && !commonFields.custUsageLimit) {
    validationErrorMessage.custUsageLimit = "Please enter the usage limit";
  }
  if (
    (commonFields.selectedDiscount === "Discount on Products" ||
      commonFields.selectedDiscount === "Order value") &&
    commonFields.method === "Manual"
  ) {
    if (commonFields.disCode === "") {
      validationErrorMessage.disCode = "Discount code is required";
    }
  }
  if (
    (commonFields?.discountedValues === "percentage" ||
      commonFields?.productDisTypeValue === "percentage") &&
    !commonFields?.discountVal
  ) {
    validationErrorMessage.discountVal = "Please enter the discount value";
  }
  if (
    (commonFields.discountedValues === "flat" ||
      commonFields.productDisTypeValue === "flat") &&
    !commonFields.discountVal
  ) {
    validationErrorMessage.discountVal = "Please enter the discount value";
  }
  if (
    commonFields.selectedDiscount !== "Buy X get Y" &&
    commonFields.amtOfPrdctsDscntVal !== "product" &&
    !commonFields.discountVal
  ) {
    validationErrorMessage.discountVal = "Please fill in this field.";
  }
  if (
    (commonFields.selectedDiscount === "Buy X get Y" ||
      commonFields.selectedDiscount === "Discount on Products") &&
    !commonFields.custOrderQuant?.minBuyQty
  ) {
    validationErrorMessage.minBuyQty = "Please enter minimum quantity";
  }
  if (
    commonFields.selectedDiscount === "Buy X get Y" ||
    commonFields.selectedDiscount === "Discount on Products" ||
    commonFields.amtOfPrdctsDscntVal === "product"
  ) {
    if (!commonFields.custOrderQuant?.maxGetYQty) {
      validationErrorMessage.maxGetYQty = "Please enter maximum quantity";
    }
  }
  if (
    commonFields.selectedDiscount === "Order value" &&
    !commonFields.minCartVal
  ) {
    validationErrorMessage.minCartVal = "Please enter minimum Cart value";
  }
  if (
    (commonFields.selectedDiscount === "Buy X get Y" ||
      commonFields.selectedDiscount === "Discount on Products") &&
    commonFields.customerSpendsSelectedListItem?.length === 0
  ) {
    validationErrorMessage.customerSpendsSelectedListItem =
      "Please select the items";
  }
  if (
    (commonFields.selectedDiscount === "Buy X get Y" ||
      (commonFields.selectedDiscount === "Order value" &&
        commonFields.amtOfPrdctsDscntVal === "product")) &&
    commonFields.customerGetsSelectedListItem?.length === 0
  ) {
    validationErrorMessage.customerGetsSelectedListItem =
      "Please select the items";
  }
  return validationErrorMessage;
};
