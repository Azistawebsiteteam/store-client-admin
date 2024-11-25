export const handleProductPageValidations = (details) => {
  const productPageValidations = {};
  if (details.mainTitle === "") {
    productPageValidations["mainTitle"] = "Main title is required";
  }
  if (details.title === "") {
    productPageValidations.title = "Title is required";
  }
  if (details.content === "") {
    productPageValidations.content = "Product information is required";
  }
  if (details.variantsThere === false) {
    const {
      price = 0,
      comparePrice = 0,
      costPerItem = 0,
    } = details.productPrices || {};

    if (price === 0) {
      productPageValidations.price = "Price is required";
    }
    if (comparePrice === 0) {
      productPageValidations.comparePrice = "Compare price is required";
    }
    if (costPerItem === 0) {
      productPageValidations.costPerItem = "Cost per item is required";
    }
  }
  if (details.images.length === 0) {
    productPageValidations.images = "Please upload at least one image";
  }

  if (details.productCategory.category === "0") {
    productPageValidations.category = "Category is required";
  }
  if (details.productCategory.productType === "0") {
    productPageValidations.productType = "Product type is required";
  }
  if (details.productCategory.vendor === "0") {
    productPageValidations.vendor = "Vendor is required";
  }
  if (details.productCategory.brand === "0") {
    productPageValidations.brand = "Brand is required";
  }

  if (details.collectionValue.length === 0) {
    productPageValidations.collectionValue = "Collection value is required";
  }

  return productPageValidations;
};
