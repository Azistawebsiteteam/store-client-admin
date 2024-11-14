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
  const { selectedDiscount, discountProps } = props;

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
    maxUses,
    setMaxUses,
    productDisTypeValue,
    setProductDisTypeValue,
  } = discountProps;

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
      setDiscountVal(e.target.value);
    }
  };

  // const onSelectedValue = (selectedItem) => {
  //   setSelectedListItem(selectedItem);
  // };

  const onSelectedCustomer = (selectedItem) => {
    setSelectedCustomers(selectedItem);
  };

  const onSelectedCustomerSpendsValue = (selectedItem) => {
    setCustomerSpendsSelectedListItem(selectedItem);
  };
  const onSelectedCustomerGetsValue = (selectedItem) => {
    setCustomerGetsSelectedListItem(selectedItem);
  };
  // const handleDiscountAppliedTo = (e) => {
  //   setDiscountAppliedValue(e.target.value);
  // };

  const handleCustomerEligibility = (e) => {
    const value = e.target.value === "allCustomers" ? "all" : e.target.value;
    setCustEligibility(value);
  };

  const handleMaxDisUses = (e) => {
    setMaxDisUses(e.target.id);
  };

  const handleUsageLimit = (e) => {
    setUsageLimit(e.target.value);
  };

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
    setCustOrderQuant({ ...custOrderQuant, [e.target.id]: e.target.value });
  };
  const handleMinCartValue = (e) => {
    setMinCartVal(e.target.value);
  };

  const handleDiscountedValues = (e) => {
    setDiscountedValues(e.target.value);
  };

  const handleMaxUses = (e) => {
    setMaxUses(e.target.checked);
  };

  const handleProductDisTypeValues = (e) => {
    setProductDisTypeValue(e.target.value);
  };
  console.log(productDisTypeValue, discountVal);
  return (
    <div>
      <div className="col-sm-12">
        <div className="d-flex justify-content-between mb-4">
          <h3>Selected Discount</h3>
        </div>
      </div>
      <div className="col-sm-12">
        <div className="row">
          <div className="col-md-8">
            <div className="bgStyle">
              <div className="mb-2">
                <h6 className="">Discount Title</h6>
                <input
                  type="text"
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value.length <= 50) {
                      setDisTitle(value);
                    }
                  }}
                  value={disTitle}
                  className="form-control"
                />
              </div>
              <div className="d-flex justify-content-between">
                <h6>{selectedDiscount}</h6>
                <h6>Product discount</h6>
              </div>

              {(selectedDiscount === "Discount on Products" ||
                selectedDiscount === "Buy X get Y") && (
                <>
                  <p className="form-label">Method - Automatic</p>
                  <div className="">
                    <label htmlFor="disDode" className="form-label">
                      Discount code
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="disDode"
                      value={disCode}
                      onChange={handleDisCode}
                    />
                    <span>
                      Customers will see this in their cart and at checkout.
                    </span>
                  </div>
                </>
              )}

              {selectedDiscount !== "Discount on Products" &&
                selectedDiscount !== "Buy X get Y" && (
                  <>
                    <div className="">
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
                        <label htmlFor="title" className="form-label">
                          Discount code
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="title"
                          value={disCode}
                          onChange={handleDisCode}
                        />
                        <span>
                          Customers will see this in their cart and at checkout.
                        </span>
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
                        />
                        <span>Customers must enter this code at checkout.</span>
                      </div>
                    )}{" "}
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
                  </div>
                </div>
                <hr />
                <div className="">
                  <h6>At a discounted value</h6>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      onChange={handleDiscountedValues}
                      type="radio"
                      name="atDiscount"
                      checked={discountedValues === "percentage"}
                      value="percentage"
                      id="atDiscountPercentage"
                    />
                    <label
                      className="form-check-label"
                      htmlFor="atDiscountPercentage"
                    >
                      Percentage
                    </label>
                    {discountedValues === "percentage" && (
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
                    )}
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      onChange={handleDiscountedValues}
                      checked={discountedValues === "flat"}
                      value="flat"
                      type="radio"
                      name="atDiscount"
                      id="atDiscountAmount"
                    />
                    <label
                      className="form-check-label"
                      htmlFor="atDiscountAmount"
                    >
                      Amount off each
                    </label>
                    {discountedValues === "flat" && (
                      <>
                        <div className="discountBlock">
                          <input
                            value={discountVal}
                            type="text"
                            className="form-control"
                            onChange={handleDiscountBlock}
                            placeholder=" 0.00"
                          />
                          <MdCurrencyRupee className="rupeeSign" />
                        </div>
                        <span>
                          For multiple quantities, the discount amount will be
                          taken off each Y item.
                        </span>
                      </>
                    )}
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      onChange={handleDiscountedValues}
                      checked={discountedValues === "free"}
                      value="free"
                      type="radio"
                      name="atDiscount"
                      id="fullDiscount"
                    />
                    <label className="form-check-label" htmlFor="fullDiscount">
                      Free
                    </label>
                  </div>
                </div>
                <hr />
                <div className="form-check">
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
                    <input
                      className="form-input amtInpt d-block"
                      type="number"
                      id="usageLimit"
                      value={usageLimit}
                      onChange={handleUsageLimit}
                    />
                  )}
                </div>
              </div>
            ) : (
              ""
            )}
            {selectedDiscount === "Discount on Products" ? (
              <div className="bgStyle">
                <h6>Discount Value</h6>
                <div className="row">
                  <div className="col-md-8">
                    <select
                      className="form-select"
                      value={amtOfPrdctsDscntVal}
                      onChange={handleAmountOfProductsDiscounts}
                      aria-label="Default select example"
                    >
                      <option value="percentage">Percentage</option>
                      <option value="flat">Fixed Amount</option>
                    </select>
                  </div>
                  <div className="col-md-4">
                    {amtOfPrdctsDscntVal === "percentage" ? (
                      <div className="discountBlock">
                        <input
                          type="text"
                          value={discountVal}
                          onChange={handleDiscountBlock}
                          className="form-control"
                        />
                        <LiaPercentSolid className="percentageSign" />
                      </div>
                    ) : (
                      <div className="discountBlock">
                        <input
                          value={discountVal}
                          type="text"
                          className="form-control"
                          onChange={handleDiscountBlock}
                          placeholder=" 0.00"
                        />
                        <MdCurrencyRupee className="rupeeSign" />
                      </div>
                    )}
                  </div>
                </div>
                <h6 className="mt-2">Applies to</h6>
                <div className="row">
                  <div className="col-md-3">
                    <input
                      type="text"
                      value={custOrderQuant.minBuyQty}
                      onChange={handleCustGetsQuant}
                      placeholder="Min Quantity"
                      className="form-control"
                      id="minBuyQty"
                    />
                  </div>
                  <div className="col-md-3">
                    <input
                      type="text"
                      value={custOrderQuant.maxGetYQty}
                      onChange={handleCustGetsQuant}
                      placeholder="Max Quantity"
                      className="form-control"
                      id="maxGetYQty"
                    />
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
                        <div className="discountBlock">
                          <input
                            type="text"
                            value={discountVal}
                            onChange={handleDiscountBlock}
                            className="form-control"
                          />
                          <LiaPercentSolid className="percentageSign" />
                        </div>
                      ) : (
                        <div className="discountBlock">
                          <input
                            value={discountVal}
                            type="text"
                            className="form-control"
                            onChange={handleDiscountBlock}
                            placeholder=" 0.00"
                          />
                          <MdCurrencyRupee className="rupeeSign" />
                        </div>
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
                          </div>
                        </div>
                        <hr />
                        <div className="">
                          <h6>At a discounted value</h6>
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              onChange={handleProductDisTypeValues}
                              type="radio"
                              name="productDisType"
                              checked={productDisTypeValue === "percentage"}
                              value="percentage"
                              id="atDiscountPercentage"
                            />
                            <label
                              className="form-check-label"
                              htmlFor="atDiscountPercentage"
                            >
                              Percentage
                            </label>
                            {productDisTypeValue === "percentage" && (
                              <div className="discountBlock">
                                <input
                                  type="text"
                                  value={discountVal}
                                  onChange={handleDiscountBlock}
                                  className="form-control"
                                />
                                <LiaPercentSolid className="percentageSign" />
                              </div>
                            )}
                          </div>
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              onChange={handleProductDisTypeValues}
                              checked={productDisTypeValue === "flat"}
                              value="flat"
                              type="radio"
                              name="productDisType"
                              id="atDiscountAmount"
                            />
                            <label
                              className="form-check-label"
                              htmlFor="atDiscountAmount"
                            >
                              Amount off each
                            </label>
                            {productDisTypeValue === "flat" && (
                              <>
                                <div className="discountBlock">
                                  <input
                                    value={discountVal}
                                    type="text"
                                    className="form-control"
                                    onChange={handleDiscountBlock}
                                    placeholder=" 0.00"
                                  />
                                  <MdCurrencyRupee className="rupeeSign" />
                                </div>
                                <span>
                                  For multiple quantities, the discount amount
                                  will be taken off each Y item.
                                </span>
                              </>
                            )}
                          </div>
                          <div className="form-check">
                            <input
                              className="form-check-input"
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
                        <div className="form-check">
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
                            <input
                              className="form-input amtInpt d-block"
                              type="number"
                              id="usageLimit"
                              value={usageLimit}
                              onChange={handleUsageLimit}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : null}

            <div className="bgStyle">
              <div className="">
                <h6>Customer eligibility</h6>
                <div className="form-check">
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
                {/* <div className="form-check">
                                    <input className="form-check-input" onChange={customerEligibility} type="radio" name="customerEligibility" id="specificCustomerSegments" value="specificCustomerSegments" />
                                    <label className="form-check-label" htmlFor="specificCustomerSegments">
                                        Specific customer segments
                                    </label>
                                    {custEligibility === "specificCustomerSegments" && <div className="mt-2">
                                        <Multiselect
                                            displayValue={discountAppliedValue === "products" ? 'product_title' : 'azst_collection_name'}
                                            onRemove={onSelectedValue}
                                            selectedValues={selectedListItem}
                                            onSelect={onSelectedValue}
                                            options={discountAppliedValue === "products" ? productsList : collectionsList}
                                            placeholder='Search customer segments'
                                        />
                                    </div>}
                                </div> */}
                <div className="form-check">
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
                    <div className="mt-2">
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
              </div>
            </div>
            <div className="bgStyle">
              <div className="">
                <h6>Maximum discount uses</h6>
              </div>
              <div className="form-check">
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
                    className="form-input amtInpt d-block"
                    type="number"
                    id="usageLimit"
                    value={usageLimit}
                    onChange={handleUsageLimit}
                  />
                )}
              </div>
              <div className="form-check">
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
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={endDate}
                  onChange={handleEndDate}
                  id="setEndDate"
                />
                <label className="form-check-label" htmlFor="setEndDate">
                  Set end date
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
              <h6>Summary</h6>
              {method === "Manual" ? (
                disCode.length === 0 ? (
                  <p className="summaryTxt">No discount code yet</p>
                ) : (
                  <p className="summaryTxt">
                    {disCode}
                    <FaRegCopy className="copyIcon" onClick={copyTxt} />
                  </p>
                )
              ) : disCode.length === 0 ? (
                <p className="summaryTxt">No title yet</p>
              ) : (
                <p className="summaryTxt">{disCode}</p>
              )}
              <h6>Type and method</h6>
              <ul>
                <li>{selectedDiscount}</li>
                <li>{method}</li>
              </ul>
              <h6>Details</h6>
              {(disCode.length === 0) & (disCode.length === 0) ? (
                <p>Can’t combine with other discounts</p>
              ) : (
                ""
              )}
              {(disCode.length !== 0) & (disCode.length === 0) ? (
                <ul>
                  <li>For Online Store</li>
                  <li>All customers</li>
                  <li>No usage limits</li>
                  <li>Can’t combine with other discounts</li>
                  <li>Active from today</li>
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
              <p>Discount is not active yet</p>
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
