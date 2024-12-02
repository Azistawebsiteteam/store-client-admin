import React from "react";
import { useState } from "react";
import { FaRegCopy } from "react-icons/fa";
import { LiaPercentSolid } from "react-icons/lia";
import { MdCurrencyRupee } from "react-icons/md";
import Multiselect from "multiselect-react-dropdown";
import { useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import ErrorHandler from "./../Pages/ErrorHandler";
import "../Pages/Admin.css";

const DiscountForm = (props) => {
  const {
    selectedDiscount,
    discountProps,
    validationErrors,
    setValidationErrors,
  } = props;
  const [customersList, setCustomersList] = useState([]);
  const [updatedProductsList, setUpdatedProductsList] = useState([]);
  const [collectionsList, setCollectionsList] = useState([]);

  const [salesChannels, setSalesChannels] = useState({
    facebookAndInsta: "",
    googleAndYoutube: "",
    azistaStore: "",
  });

  const baseUrl = process.env.REACT_APP_API_URL;
  const jwtToken = process.env.REACT_APP_ADMIN_JWT_TOKEN;
  const token = Cookies.get(jwtToken);

  const {
    discountStatus,
    disCode,
    setDisCode,
    disTitle,
    setDisTitle,
    method,
    setMethodTab,
    amtOfPrdctsDscntVal,
    setAmtOfPrdctsDscntVal,
    discountedValues,
    setDiscountedValues,
    discountVal,
    setDiscountVal,
    startTimings,
    setStartTimings,
    endTimings,
    setEndTimings,
    maxDisUses,
    setMaxDisUses,
    usageLimit,
    setUsageLimit,
    // custUsageLimit,
    // setCustUsageLimit,
    custEligibility,
    setCustEligibility,
    selectedCustomers,
    setSelectedCustomers,
    minCartVal,
    setMinCartVal,
    customerBuyItems,
    setCustomerBuyItems,
    customerSpendsSelectedListItem,
    setCustomerSpendsSelectedListItem,
    customerGetsSelectedListItem,
    setCustomerGetsSelectedListItem,
    custOrderQuant,
    setCustOrderQuant,
    customerGetsItems,
    setCustomerGetsItems,
    endDate,
    setEndDate,
    // maxUses,
    // setMaxUses,
    productDisTypeValue,
    setProductDisTypeValue,
  } = discountProps;

  useEffect(() => {
    if (method === "Automatic") {
      generateRandomCode();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [method]);

  useEffect(() => {
    const productDetails = async () => {
      try {
        const productsUrl = `${baseUrl}/product/all-products/variants`;
        const collectionsUrl = `${baseUrl}/collections/data`;
        const customersUrl = `${baseUrl}/users/get/all`;

        const headers = {
          Authorization: `Bearer ${token} `,
        };
        const [productsData, collectionsData, customersData] =
          await Promise.all([
            axios.get(productsUrl, { headers }),
            axios.get(collectionsUrl, { headers }),
            axios.post(customersUrl, { isActive: true }, { headers }),
          ]);

        const updatedProductList = productsData.data.products.map((each) => ({
          productTitle: `${each.product_title} ${
            each.option1 !== null ? `- ${each.option1}` : ""
          } ${each.option2 !== null ? `- ${each.option2}` : ""} ${
            each.option3 !== null ? `- ${each.option3}` : ""
          }`,
          product_mainTitle: each.product_main_title,
          productId: each.product_id,
          variantId: each.variant_id,
        }));

        setUpdatedProductsList(updatedProductList);
        setCollectionsList(collectionsData.data);
        setCustomersList(customersData.data);
      } catch (error) {
        ErrorHandler.onError(error);
      }
    };
    productDetails();
  }, [token, baseUrl]);

  const generateRandomCode = () => {
    let chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZ";
    let randomcode = "";
    for (var i = 0; i < 10; i++) {
      let index = Math.ceil(Math.random() * (chars.length - 1));
      randomcode += chars[index];
    }
    setDisCode(randomcode);
  };

  const handleMethodTab = (tab) => {
    setMethodTab(tab);
    setDisCode("");
  };
  const handleDisCode = (e) => {
    setDisCode(e.target.value.toUpperCase());
    setValidationErrors({ ...validationErrors, disCode: "" });
  };
  const copyTxt = () => {
    navigator.clipboard.writeText(disCode);
  };
  const handleAmountOfProductsDiscounts = (e) => {
    setAmtOfPrdctsDscntVal(e.target.value);
  };

  const handleDiscountBlock = (e) => {
    if (discountedValues === "free" || productDisTypeValue === "free") {
      setDiscountVal("100");
    } else {
      let { value } = e.target;
      value = value.replace(/[^0-9]/g, "");
      setDiscountVal(value);
      if (!isNaN(value) && value !== "") {
        setValidationErrors({ ...validationErrors, discountVal: "" });
      }
    }
  };

  // const onSelectedValue = (selectedItem) => {
  //   setSelectedListItem(selectedItem);
  // };

  const onSelectedCustomer = (selectedItem) => {
    setSelectedCustomers(selectedItem);
    setValidationErrors({ ...validationErrors, selectedCustomers: "" });
  };

  const onSelectedCustomerSpendsValue = (selectedItem) => {
    setCustomerSpendsSelectedListItem(selectedItem);
    setValidationErrors({
      ...validationErrors,
      customerSpendsSelectedListItem: "",
    });
  };
  const onSelectedCustomerGetsValue = (selectedItem) => {
    setCustomerGetsSelectedListItem(selectedItem);
    setValidationErrors({
      ...validationErrors,
      customerGetsSelectedListItem: "",
    });
  };
  // const handleDiscountAppliedTo = (e) => {
  //   setDiscountAppliedValue(e.target.value);
  // };

  const handleDiscountTitle = (e) => {
    setDisTitle(e.target.value);
    setValidationErrors({ ...validationErrors, disTitle: "" });
  };

  const handleCustomerEligibility = (e) => {
    const value = e.target.value === "allCustomers" ? "all" : e.target.value;
    setCustEligibility(value);
    setValidationErrors({ ...validationErrors, selectedCustomers: "" });
  };

  const handleMaxDisUses = (e) => {
    setMaxDisUses(e.target.id);
    setValidationErrors({ ...validationErrors, usageLimit: "" });
  };

  const handleUsageLimit = (e) => {
    let { value } = e.target;
    value = value.replace(/[^0-9]/g, "");
    setUsageLimit(value);
    if (!isNaN(usageLimit) && usageLimit !== "") {
      setValidationErrors({ ...validationErrors, usageLimit: "" });
    }
  };

  // const handleCustUsageLimit = (e) => {
  //   let { value } = e.target;
  //   value = value.replace(/[^0-9]/g, "");
  //   setCustUsageLimit(value);
  //   if (!isNaN(value) && custUsageLimit !== "") {
  //     setValidationErrors({ ...validationErrors, custUsageLimit: "" });
  //   }
  // };

  const handleEndDate = (e) => {
    setEndDate(e.target.checked);
  };

  const handleStartTimings = (e) => {
    setStartTimings({ ...startTimings, [e.target.id]: e.target.value });
  };

  const handleEndTimings = (e) => {
    setEndTimings({ ...endTimings, [e.target.id]: e.target.value });
  };

  const handleSalesChannels = (e) => {
    setSalesChannels({ ...salesChannels, [e.target.id]: e.target.checked });
  };
  const handleSpecificItems = (e) => {
    setCustomerBuyItems(e.target.value);
    setCustomerSpendsSelectedListItem("");
  };

  const handleCustomerGetsItems = (e) => {
    setCustomerGetsItems(e.target.value);
    setCustomerGetsSelectedListItem();
  };
  const handleCustGetsQuant = (e) => {
    let { id, value } = e.target;
    value = value.replace(/[^0-9]/g, ""); // Allow only numbers
    setCustOrderQuant({ ...custOrderQuant, [id]: value });

    if (!isNaN(value) && value !== "") {
      setValidationErrors({
        ...validationErrors,
        [id]: "", // Dynamically clear errors based on `id`
      });
    }
  };
  const handleMinCartValue = (e) => {
    let { value } = e.target;
    value = value.replace(/[^0-9]/g, "");
    setMinCartVal(value);
    setValidationErrors({ ...validationErrors, minCartVal: "" });
  };

  const handleDiscountedValues = (e) => {
    setDiscountedValues(e.target.value);
  };

  // const handleMaxUses = (e) => {
  //   setMaxUses(e.target.checked);
  // };

  const handleProductDisTypeValues = (e) => {
    setProductDisTypeValue(e.target.value);
  };

  const today = new Date().toISOString().slice(0, 10);
  const minEndDate = new Date(new Date().setDate(new Date().getDate() + 1))
    .toISOString()
    .slice(0, 10);

  return (
    <div>
      <div className="col-sm-12">
        <div className="d-flex justify-content-between mt-4 mb-2">
          <h5>Selected Discount</h5>
        </div>
      </div>
      <div className="col-sm-12">
        <div className="row">
          <div className="col-md-8">
            <div className="bgStyle">
              <div className="form-group">
                <h6 className="">Discount Title</h6>
                <input
                  type="text"
                  onChange={handleDiscountTitle}
                  value={disTitle}
                  className="form-control"
                  maxLength={50}
                />
                {validationErrors.disTitle && (
                  <span className="errorValue">
                    {validationErrors.disTitle}
                  </span>
                )}
              </div>
              <div className="d-flex justify-content-between">
                <h6>{selectedDiscount}</h6>
                <h6>Product discount</h6>
              </div>

              {(selectedDiscount === "Discount on Products" ||
                selectedDiscount === "Order value") && (
                <>
                  <div className="form-group">
                    <label htmlFor="" className="form-label">
                      Method
                    </label>
                    <div className="methodBtnCont">
                      <button
                        className={`methodBtn ${
                          method === "Manual" && "active"
                        }`}
                        onClick={() => handleMethodTab("Manual")}
                      >
                        Discount code
                      </button>
                      <button
                        className={`methodBtn ${
                          method === "Automatic" && "active"
                        }`}
                        onClick={() => handleMethodTab("Automatic")}
                      >
                        Automatic discount
                      </button>
                    </div>
                  </div>
                  {method === "Automatic" && (
                    <div className="">
                      <label style={{ whiteSpace: "normal" }}>
                        Customers will see this in their cart and at checkout.
                      </label>
                    </div>
                  )}
                  {method === "Manual" && (
                    <div className="">
                      <div className="d-flex justify-content-between">
                        <label htmlFor="" className="form-label">
                          Discount code
                        </label>
                        <button
                          className="generateCodeBtn"
                          onClick={generateRandomCode}
                        >
                          Generate random code
                        </button>
                      </div>
                      <input
                        type="text"
                        value={disCode}
                        onChange={handleDisCode}
                        className="form-control"
                        maxLength={30}
                      />
                      {validationErrors.disCode && (
                        <span className="errorValue">
                          {validationErrors.disCode}
                        </span>
                      )}
                      <label className="d-block">
                        Customers must enter this code at checkout.
                      </label>
                    </div>
                  )}{" "}
                </>
              )}

              {selectedDiscount !== "Discount on Products" &&
                selectedDiscount !== "Order value" && (
                  <>
                    <label className="form-label">Method - Automatic</label>
                    {/* <label htmlFor="disDode" className="form-label">
                        Discount code
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="disDode"
                        value={disCode}
                        onChange={handleDisCode}
                      /> */}
                    <label className="d-block">
                      Customers will see this in their cart and at checkout.
                    </label>
                  </>
                )}
            </div>

            {selectedDiscount === "Buy X get Y" ? (
              <div className="bgStyle">
                <div className="">
                  <h6>Customer spends</h6>
                  <p>Minimum quantity of items</p>
                  <div className="row">
                    <div className="col-md-4">
                      <label
                        className="form-check-label"
                        htmlFor="CustomerBuysQuantity"
                      >
                        Min Quantity
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="minBuyQty"
                        placeholder="Min Quantity"
                        value={custOrderQuant.minBuyQty}
                        onChange={handleCustGetsQuant}
                      />
                      {validationErrors.minBuyQty && (
                        <span className="errorValue">
                          {validationErrors.minBuyQty}
                        </span>
                      )}
                    </div>
                    <div className="col-md-8">
                      <label
                        className="form-check-label"
                        htmlFor="CustomerBuysAnyItems"
                      >
                        Any items from
                      </label>
                      <select
                        id="CustomerBuysAnyItems"
                        className="form-select"
                        value={customerBuyItems}
                        onChange={handleSpecificItems}
                        aria-label="Default select example"
                      >
                        <option value="collection">Specific collections</option>
                        <option value="product">Specific products</option>
                      </select>
                    </div>
                  </div>
                  <div className="mt-3 mb-3">
                    <Multiselect
                      displayValue={
                        customerBuyItems === "product"
                          ? `productTitle`
                          : "azst_collection_name"
                      }
                      onRemove={onSelectedCustomerSpendsValue}
                      selectedValues={customerSpendsSelectedListItem}
                      onSelect={onSelectedCustomerSpendsValue}
                      options={
                        customerBuyItems === "product"
                          ? updatedProductsList
                          : collectionsList
                      }
                      placeholder={
                        customerBuyItems === "product"
                          ? "Select products"
                          : "Select collections"
                      }
                    />
                    {validationErrors.customerSpendsSelectedListItem && (
                      <span className="errorValue">
                        {validationErrors.customerSpendsSelectedListItem}
                      </span>
                    )}
                  </div>
                </div>
                <hr />
                <div className="">
                  <h6>Customer gets</h6>
                  <p>
                    Customers must add the quantity of items specified below to
                    their cart.
                  </p>
                  <div className="row">
                    <div className="col-md-4">
                      <label
                        className="form-check-label"
                        htmlFor="CustomerBuysQuantity"
                      >
                        Max Quantity
                      </label>
                      <input
                        type="text"
                        value={custOrderQuant.maxGetYQty}
                        onChange={handleCustGetsQuant}
                        className="form-control"
                        id="maxGetYQty"
                        placeholder="Max Quantity"
                      />
                      {validationErrors.maxGetYQty && (
                        <span className="errorValue">
                          {validationErrors.maxGetYQty}
                        </span>
                      )}
                    </div>
                    <div className="col-md-8">
                      <label
                        className="form-check-label"
                        htmlFor="CustomerGetItems"
                      >
                        Any items from
                      </label>
                      <select
                        id="CustomerGetItems"
                        value={customerGetsItems}
                        onChange={handleCustomerGetsItems}
                        className="form-select"
                        aria-label="Default select example"
                      >
                        <option value="collection">Specific collections</option>
                        <option value="product">Specific products</option>
                      </select>
                    </div>
                  </div>
                  <div className="mt-3 mb-3">
                    <Multiselect
                      displayValue={
                        customerGetsItems === "product"
                          ? "productTitle"
                          : "azst_collection_name"
                      }
                      onRemove={onSelectedCustomerGetsValue}
                      selectedValues={customerGetsSelectedListItem}
                      onSelect={onSelectedCustomerGetsValue}
                      options={
                        customerGetsItems === "product"
                          ? updatedProductsList
                          : collectionsList
                      }
                      placeholder={
                        customerGetsItems === "product"
                          ? "Search products"
                          : "Search collections"
                      }
                    />
                    {validationErrors.customerGetsSelectedListItem && (
                      <span className="errorValue">
                        {validationErrors.customerGetsSelectedListItem}
                      </span>
                    )}
                  </div>
                </div>
                <hr />
                <div className="mt-2 mb-2">
                  <h6>At a discounted value</h6>
                  <div className="inputGroup">
                    <input
                      className="form-check-input me-2"
                      onChange={handleDiscountedValues}
                      type="radio"
                      name="atDiscount"
                      checked={discountedValues === "percentage"}
                      value="percentage"
                      id="atDiscountPercentage"
                    />
                    <label
                      className="form-check-label me-2"
                      htmlFor="atDiscountPercentage"
                    >
                      Percentage
                    </label>
                    {discountedValues === "percentage" && (
                      <div>
                        <div className="discountBlock">
                          <input
                            type="text"
                            value={discountVal}
                            onChange={handleDiscountBlock}
                            className="form-control"
                            id=""
                          />
                          <LiaPercentSolid className="percentageSign" />
                        </div>
                        {validationErrors.discountVal && (
                          <span className="errorValue">
                            {validationErrors.discountVal}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="d-flex">
                    <input
                      className="form-check-input me-2"
                      onChange={handleDiscountedValues}
                      checked={discountedValues === "flat"}
                      value="flat"
                      type="radio"
                      name="atDiscount"
                      id="atDiscountAmount"
                    />
                    <div className="d-flex flex-column">
                      <div className="d-flex align-items-start">
                        <label
                          className="form-check-label me-2"
                          htmlFor="atDiscountAmount"
                        >
                          Amount off each
                        </label>
                        <div className="">
                          {discountedValues === "flat" && (
                            <div className="d-flex flex-column">
                              <div className="discountBlock">
                                <input
                                  value={discountVal}
                                  type="text"
                                  className="form-control discount-amount-input"
                                  onChange={handleDiscountBlock}
                                  placeholder="0.00"
                                  style={{ paddingLeft: "1rem" }}
                                />
                                <MdCurrencyRupee className="rupeeSign" />
                              </div>
                              {validationErrors.discountVal && (
                                <span className="errorValue">
                                  {validationErrors.discountVal}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      <label className="form-check-label">
                        For multiple quantities, the discount amount will be
                        taken off each Y item.
                      </label>
                    </div>
                  </div>
                  <div className="inputGroup">
                    <input
                      className="form-check-input"
                      onChange={handleDiscountedValues}
                      checked={discountedValues === "free"}
                      value="free"
                      type="radio"
                      name="atDiscount"
                      id="fullDiscount"
                    />
                    <label
                      className="form-check-label me-2"
                      htmlFor="fullDiscount"
                    >
                      Free
                    </label>
                  </div>
                </div>
                <hr />
                {/* <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value={maxUses}
                    checked={maxUses}
                    onChange={handleMaxUses}
                    id="setMaximumUses"
                  />
                  <label className="form-check-label" htmlFor="setMaximumUses">
                    Set a maximum number of uses.
                  </label>
                  {maxUses && (
                    <>
                      <input
                        className="form-control amtInpt d-block"
                        type="text"
                        id="custUsageLimit"
                        value={custUsageLimit}
                        onChange={handleCustUsageLimit}
                        maxLength={3}
                      />
                      {validationErrors.custUsageLimit && (
                        <span className="errorValue">
                          {validationErrors.custUsageLimit}
                        </span>
                      )}
                    </>
                  )}
                </div> */}
              </div>
            ) : (
              ""
            )}
            {selectedDiscount === "Discount on Products" ? (
              <div className="bgStyle">
                <h6>Discount Value</h6>
                <div className="row g-3">
                  <div className="col-md-8">
                    <select
                      className="form-select"
                      value={amtOfPrdctsDscntVal}
                      onChange={handleAmountOfProductsDiscounts}
                      aria-label="Default select example"
                    >
                      <option value="flat">Fixed Amount</option>
                      <option value="percentage">Percentage</option>
                    </select>
                  </div>
                  <div className="col-md-4">
                    {amtOfPrdctsDscntVal === "percentage" ? (
                      <>
                        <div className="discountBlock">
                          <input
                            type="text"
                            value={discountVal}
                            onChange={handleDiscountBlock}
                            className="form-control discount-amount-input"
                            maxLength={5}
                          />
                          <LiaPercentSolid className="percentageSign" />
                        </div>
                        {validationErrors.discountVal && (
                          <span className="errorValue">
                            {validationErrors.discountVal}
                          </span>
                        )}
                      </>
                    ) : (
                      <>
                        <div className="discountBlock">
                          <input
                            value={discountVal}
                            type="text"
                            style={{ paddingLeft: "1.6rem" }}
                            className="form-control discount-amount-input"
                            onChange={handleDiscountBlock}
                            maxLength={5}
                            placeholder=" 0.00"
                          />
                          <MdCurrencyRupee className="rupeeSign" />
                        </div>
                        {validationErrors.discountVal && (
                          <span className="errorValue">
                            {validationErrors.discountVal}
                          </span>
                        )}
                      </>
                    )}
                  </div>
                </div>
                <h6 className="mt-2">Applies to</h6>
                <div className="row g-3">
                  <div className="col-md-3">
                    <input
                      type="text"
                      value={custOrderQuant.minBuyQty}
                      onChange={handleCustGetsQuant}
                      maxLength={3}
                      placeholder="Min Quantity"
                      className="form-control"
                      id="minBuyQty"
                    />
                    {validationErrors.minBuyQty && (
                      <span className="errorValue">
                        {validationErrors.minBuyQty}
                      </span>
                    )}
                  </div>
                  <div className="col-md-3">
                    <input
                      type="text"
                      value={custOrderQuant.maxGetYQty}
                      onChange={handleCustGetsQuant}
                      placeholder="Max Quantity"
                      maxLength={3}
                      className="form-control"
                      id="maxGetYQty"
                    />
                    {validationErrors.maxGetYQty && (
                      <span className="errorValue">
                        {validationErrors.maxGetYQty}
                      </span>
                    )}
                  </div>
                  <div className="col-md-6">
                    <select
                      id="CustomerBuysAnyItems"
                      className="form-select"
                      value={customerBuyItems}
                      onChange={handleSpecificItems}
                      aria-label="Default select example"
                    >
                      <option value="collection">Specific collections</option>
                      <option value="product">Specific products</option>
                    </select>
                  </div>
                </div>
                <div className="mt-3 mb-3">
                  <Multiselect
                    displayValue={
                      customerBuyItems === "product"
                        ? `productTitle`
                        : "azst_collection_name"
                    }
                    onRemove={onSelectedCustomerSpendsValue}
                    selectedValues={customerSpendsSelectedListItem}
                    onSelect={onSelectedCustomerSpendsValue}
                    options={
                      customerBuyItems === "product"
                        ? updatedProductsList
                        : collectionsList
                    }
                    placeholder={
                      customerBuyItems === "product"
                        ? "Select products"
                        : "Select collections"
                    }
                  />
                  {validationErrors.customerSpendsSelectedListItem && (
                    <span className="errorValue">
                      {validationErrors.customerSpendsSelectedListItem}
                    </span>
                  )}
                </div>
              </div>
            ) : (
              ""
            )}

            {selectedDiscount === "Order value" ? (
              <div className="bgStyle">
                <h6>Discount Value</h6>
                <div className="row">
                  <div className="col-md-4">
                    <input
                      type="text"
                      value={minCartVal}
                      onChange={handleMinCartValue}
                      className="form-control"
                      id="minimumCartValue"
                      placeholder="Min Cart Value"
                    />
                    {validationErrors.minCartVal && (
                      <span className="errorValue">
                        {validationErrors.minCartVal}
                      </span>
                    )}
                  </div>
                  <div className="col-md-4">
                    <select
                      className="form-select"
                      value={amtOfPrdctsDscntVal}
                      onChange={handleAmountOfProductsDiscounts}
                      aria-label="Default select example"
                    >
                      <option value="percentage">Percentage</option>
                      <option value="flat">Fixed Amount</option>
                      <option value="product">Product</option>
                    </select>
                  </div>
                  {amtOfPrdctsDscntVal !== "product" ? (
                    <div className="col-md-4">
                      {amtOfPrdctsDscntVal === "percentage" ? (
                        <>
                          <div className="discountBlock">
                            <input
                              type="text"
                              value={discountVal}
                              onChange={handleDiscountBlock}
                              className="form-control"
                            />
                            <LiaPercentSolid className="percentageSign" />
                          </div>
                          {validationErrors.discountVal && (
                            <span className="errorValue">
                              {validationErrors.discountVal}
                            </span>
                          )}
                        </>
                      ) : (
                        <>
                          <div className="discountBlock">
                            <input
                              value={discountVal}
                              type="text"
                              className="form-control discount-amount-input"
                              onChange={handleDiscountBlock}
                              placeholder="0.00"
                            />
                            <MdCurrencyRupee className="rupeeSign" />
                          </div>
                          {validationErrors.discountVal && (
                            <span className="errorValue">
                              {validationErrors.discountVal}
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="col-md-12">
                      <div className="mt-3 mb-3">
                        <div className="">
                          <h6>Customer gets</h6>
                          <p>
                            Customers must add the quantity of items specified
                            below to their cart.
                          </p>
                          <div className="row">
                            <div className="col-md-4">
                              <label
                                className="form-check-label"
                                htmlFor="CustomerBuysQuantity"
                              >
                                Max Quantity
                              </label>
                              <input
                                type="text"
                                value={custOrderQuant.maxGetYQty}
                                onChange={handleCustGetsQuant}
                                className="form-control"
                                id="maxGetYQty"
                                placeholder="Max Quantity"
                              />
                              {validationErrors.maxGetYQty && (
                                <span className="errorValue">
                                  {validationErrors.maxGetYQty}
                                </span>
                              )}
                            </div>
                            <div className="col-md-8">
                              <label
                                className="form-check-label"
                                htmlFor="CustomerGetItems"
                              >
                                Any items from
                              </label>
                              <select
                                id="CustomerGetItems"
                                value={customerGetsItems}
                                onChange={handleCustomerGetsItems}
                                className="form-select"
                                aria-label="Default select example"
                              >
                                <option value="collection">
                                  Specific collections
                                </option>
                                <option value="product">
                                  Specific products
                                </option>
                              </select>
                            </div>
                          </div>
                          <div className="mt-3 mb-3">
                            <Multiselect
                              displayValue={
                                customerGetsItems === "product"
                                  ? "productTitle"
                                  : "azst_collection_name"
                              }
                              onRemove={onSelectedCustomerGetsValue}
                              selectedValues={customerGetsSelectedListItem}
                              onSelect={onSelectedCustomerGetsValue}
                              options={
                                customerGetsItems === "product"
                                  ? updatedProductsList
                                  : collectionsList
                              }
                              placeholder={
                                customerGetsItems === "product"
                                  ? "Search products"
                                  : "Search collections"
                              }
                            />
                            {validationErrors.customerGetsSelectedListItem && (
                              <span className="errorValue">
                                {validationErrors.customerGetsSelectedListItem}
                              </span>
                            )}
                          </div>
                        </div>
                        <hr />
                        <div className="mt-2 mb-2">
                          <h6>At a discounted value</h6>
                          <div className="d-flex align-items-start">
                            <input
                              className="form-check-input me-2"
                              onChange={handleProductDisTypeValues}
                              type="radio"
                              name="productDisType"
                              checked={productDisTypeValue === "percentage"}
                              value="percentage"
                              id="atDiscountPercentage"
                            />
                            <label
                              className="form-check-label me-2"
                              htmlFor="atDiscountPercentage"
                            >
                              Percentage
                            </label>
                            {productDisTypeValue === "percentage" && (
                              <div>
                                <div className="discountBlock">
                                  <input
                                    type="text"
                                    value={discountVal}
                                    onChange={handleDiscountBlock}
                                    className="form-control"
                                  />
                                  <LiaPercentSolid className="percentageSign" />
                                </div>
                                {validationErrors.discountVal && (
                                  <span className="errorValue">
                                    {validationErrors.discountVal}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                          <div className="inputGroup d-flex align-items-start">
                            <input
                              className="form-check-input me-2"
                              onChange={handleProductDisTypeValues}
                              checked={productDisTypeValue === "flat"}
                              value="flat"
                              type="radio"
                              name="productDisType"
                              id="atDiscountAmount"
                            />
                            <div className="d-flex flex-column">
                              <div className="d-flex align-items-start">
                                <label
                                  className="form-check-label me-2"
                                  htmlFor="atDiscountAmount"
                                >
                                  Amount off each
                                </label>
                                {productDisTypeValue === "flat" && (
                                  <div>
                                    <div className="discountBlock">
                                      <input
                                        value={discountVal}
                                        type="text"
                                        className="form-control discount-amount-input"
                                        onChange={handleDiscountBlock}
                                        placeholder=" 0.00"
                                      />
                                      <MdCurrencyRupee className="rupeeSign" />
                                    </div>
                                    {validationErrors.discountVal && (
                                      <span className="errorValue">
                                        {validationErrors.discountVal}
                                      </span>
                                    )}
                                  </div>
                                )}
                              </div>
                              <label className="form-check-label">
                                For multiple quantities, the discount amount
                                will be taken off each Y item.
                              </label>
                            </div>
                          </div>
                          <div className="inputGroup">
                            <input
                              className="form-check-input me-2"
                              onChange={handleProductDisTypeValues}
                              type="radio"
                              checked={productDisTypeValue === "free"}
                              name="productDisType"
                              value="free"
                              id="fullDiscount"
                            />
                            <label
                              className="form-check-label"
                              htmlFor="fullDiscount"
                            >
                              Free
                            </label>
                          </div>
                        </div>
                        <hr />
                        {/* <div className="inputGroup">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            value={maxUses}
                            checked={maxUses}
                            onChange={handleMaxUses}
                            id="setMaximumUses"
                          />
                          <label
                            className="form-check-label"
                            htmlFor="setMaximumUses"
                          >
                            Set a maximum number of uses.
                          </label>
                          {maxUses && (
                            <>
                              <input
                                className="form-control amtInpt d-block"
                                type="text"
                                id="custUsageLimit"
                                value={custUsageLimit}
                                onChange={handleCustUsageLimit}
                                maxLength={3}
                              />
                              {validationErrors.custUsageLimit && (
                                <span className="errorValue">
                                  {validationErrors.custUsageLimit}
                                </span>
                              )}
                            </>
                          )}
                        </div> */}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : null}

            <div className="bgStyle">
              <div className="">
                <h6>Customer eligibility</h6>
                <div className="inputGroup">
                  <input
                    className="form-check-input"
                    onChange={handleCustomerEligibility}
                    type="radio"
                    name="customerEligibility"
                    checked={custEligibility === "all"}
                    id="allCustomers"
                    value="allCustomers"
                  />
                  <label className="form-check-label" htmlFor="allCustomers">
                    All customers
                  </label>
                </div>
                <div className="inputGroup">
                  <input
                    className="form-check-input"
                    onChange={handleCustomerEligibility}
                    type="radio"
                    name="customerEligibility"
                    id="specificCustomer"
                    checked={custEligibility === "specificCustomer"}
                    value="specificCustomer"
                  />
                  <label
                    className="form-check-label"
                    htmlFor="specificCustomer"
                  >
                    Specific customers
                  </label>
                  {custEligibility === "specificCustomer" && (
                    <div className="ms-2" style={{ width: "100%" }}>
                      <Multiselect
                        displayValue={"azst_customer_name"}
                        onRemove={onSelectedCustomer}
                        selectedValues={selectedCustomers}
                        onSelect={onSelectedCustomer}
                        options={customersList}
                        placeholder="Search customers"
                      />
                    </div>
                  )}
                </div>
                {validationErrors.selectedCustomers && (
                  <span className="errorValue">
                    {validationErrors.selectedCustomers}
                  </span>
                )}
              </div>
            </div>
            <div className="bgStyle">
              <div className="">
                <h6>Maximum discount uses</h6>
              </div>
              <div className="inputGroup">
                <input
                  className="form-check-input"
                  type="radio"
                  value="1"
                  id="oneTimeUser"
                  checked={maxDisUses === "oneTimeUser"}
                  onChange={handleMaxDisUses}
                  name="discountUses"
                />
                <label className="form-check-label" htmlFor="oneTimeUser">
                  Limit to one use per customer
                </label>
              </div>
              <div className="inputGroup">
                <input
                  className="form-check-input"
                  type="radio"
                  checked={maxDisUses === "mutipleTimeDiscntUses"}
                  onChange={handleMaxDisUses}
                  id="mutipleTimeDiscntUses"
                  name="discountUses"
                />
                <label
                  className="form-check-label"
                  htmlFor="mutipleTimeDiscntUses"
                >
                  Limit number of times this discount can be used in total
                </label>
                {maxDisUses === "mutipleTimeDiscntUses" && (
                  <input
                    className="form-control amtInpt d-block ms-2"
                    type="text"
                    maxLength={3}
                    id="usageLimit"
                    value={usageLimit}
                    onChange={handleUsageLimit}
                  />
                )}
              </div>
              {validationErrors.usageLimit && (
                <span className="errorValue">
                  {validationErrors.usageLimit}
                </span>
              )}
            </div>

            <div className="bgStyle">
              <h6>Active dates</h6>

              <form className="row g-3">
                <div className="col-md-6">
                  <label htmlFor="startDate" className="form-label">
                    Start date
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="startDate"
                    min={today}
                    value={startTimings.startDate}
                    onChange={handleStartTimings}
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="startTime" className="form-label">
                    Start time (IST)
                  </label>
                  <input
                    type="time"
                    className="form-control"
                    id="startTime"
                    value={startTimings.startTime}
                    onChange={handleStartTimings}
                  />
                </div>
              </form>
              <div className="inputGroup">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={endDate}
                  onChange={handleEndDate}
                  id="setEndDate"
                />
                <label
                  className="formLabel"
                  style={{ paddingBottom: "0" }}
                  htmlFor="setEndDate"
                >
                  Set end date{" "}
                  <span>
                    ( Note: The time difference will default to 10 days. )
                  </span>
                </label>
              </div>
              {endDate && (
                <form className="row g-3">
                  <div className="col-md-6">
                    <label htmlFor="endDate" className="form-label">
                      End date
                    </label>
                    <input
                      type="date"
                      min={minEndDate}
                      className="form-control"
                      id="endDate"
                      value={endTimings.endDate}
                      onChange={handleEndTimings}
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="endTime" className="form-label">
                      End time (IST)
                    </label>
                    <input
                      type="time"
                      className="form-control"
                      id="endTime"
                      value={endTimings.endTime}
                      onChange={handleEndTimings}
                    />
                  </div>
                </form>
              )}
            </div>
          </div>
          <div className="col-md-4">
            <div className="bgStyle">
              <h6 className="mb-3">Summary</h6>
              {method === "Manual" ? (
                disCode.length === 0 ? (
                  <label className="summaryTxt">No discount code yet</label>
                ) : (
                  <label className="summaryTxt">
                    {disCode}
                    <FaRegCopy className="copyIcon" onClick={copyTxt} />
                  </label>
                )
              ) : disCode.length === 0 ? (
                <label className="summaryTxt">No title yet</label>
              ) : (
                <label className="summaryTxt">{disCode}</label>
              )}
              <h6>Type and method</h6>
              <ul>
                <li className="listPoint">{selectedDiscount}</li>
                <li className="listPoint">
                  {selectedDiscount === "Buy X get Y"
                    ? "Manual"
                    : "Automatic & Manual"}
                </li>
              </ul>
              <h6>Details</h6>
              {disCode.length === 0 ? (
                <label className="mb-2">
                  Can’t combine with other discounts
                </label>
              ) : (
                ""
              )}
              {disCode.length !== 0 ? (
                <ul className="mb-2">
                  <li className="listPoint">For Online Store</li>
                  <li className="listPoint">All customers</li>
                  <li className="listPoint">No usage limits</li>
                  <li className="listPoint">
                    Can’t combine with other discounts
                  </li>
                  <li className="listPoint">Active from today</li>
                </ul>
              ) : (
                ""
              )}
              {(disCode.length === 0) & (disCode.length !== 0) ? (
                <ul>
                  <li>For Online Store</li>
                  <li>Can’t combine with other discounts</li>
                  <li>Active from today</li>
                </ul>
              ) : (
                ""
              )}
              <h6>Performance</h6>
              <label>
                {discountStatus
                  ? "Discount is active."
                  : "Discount is not active yet"}
              </label>
            </div>
            {method === "Manual" && (
              <div className="bgStyle">
                <h6>Sales channels</h6>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={salesChannels.facebookAndInsta}
                    onChange={handleSalesChannels}
                    id="facebookAndInsta"
                  />
                  <label
                    className="form-check-label"
                    htmlFor="facebookAndInsta"
                  >
                    Facebook & Instagram
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={salesChannels.googleAndYoutube}
                    onChange={handleSalesChannels}
                    id="googleAndYoutube"
                  />
                  <label
                    className="form-check-label"
                    htmlFor="googleAndYoutube"
                  >
                    Google & YouTube
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={salesChannels.azistaStore}
                    onChange={handleSalesChannels}
                    id="azistaStore"
                  />
                  <label className="form-check-label" htmlFor="azistaStore">
                    azistastore_mobile_app
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscountForm;
