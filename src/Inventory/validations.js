export const handleValidationErrors = (inputValues) => {
  console.log(inputValues);
  const validationsMsgs = {};
  if (!inputValues.inventoryId) {
    validationsMsgs.inventoryId = "Enter the Inventory Id";
  }
  if (!inputValues.inventoryName) {
    validationsMsgs.inventoryName = "Enter the Inventory name";
  }
  if (!inputValues.inventoryLocation) {
    validationsMsgs.inventoryLocation = "Enter the Inventory location";
  }
  if (!inputValues.inventoryLatitude) {
    validationsMsgs.inventoryLatitude = "Enter the Inventory latitude";
  }
  if (!inputValues.pinCode) {
    validationsMsgs.pinCode = "Enter the Inventory pin code";
  }
  if (!inputValues.inventoryLongitude) {
    validationsMsgs.inventoryLongitude = "Enter the Inventory longitude";
  }
  if (!inputValues.inventoryAddress) {
    validationsMsgs.inventoryAddress = "Enter the Inventory address";
  }
  if (!inputValues.inventoryEmail) {
    validationsMsgs.inventoryEmail = "Enter the Inventory email address";
  }
  if (!inputValues.inventoryPhone) {
    validationsMsgs.inventoryPhone = "Enter the Inventory phone number";
  }
  if (!inputValues.pincode) {
    validationsMsgs.pincode = "Enter the pincode";
  }
  return validationsMsgs;
};
