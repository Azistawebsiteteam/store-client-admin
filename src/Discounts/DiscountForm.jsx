import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaRegCopy } from "react-icons/fa";
import { LiaPercentSolid } from "react-icons/lia";
import { MdCurrencyRupee } from "react-icons/md";
import Multiselect from "multiselect-react-dropdown";
import { useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import "../Pages/Admin.css";

const DiscountForm = (props) => {
  const { selectedDiscount } = props;
  // const [code, setRandomCode] = useState("");
  const [method, setMethodTab] = useState("discountCode");
  console.log(method, "method");
  const [disCode, setDisCode] = useState("");
  const [amtOfPrdctsDscntVal, setAmtOfPrdctsDscntVal] = useState("percentage");
  const [discountVal, setDiscountVal] = useState();
  const [productsList, setProductsList] = useState([]);
  const [selectedListItem, setSelectedListItem] = useState([]);
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  console.log(selectedCustomers, "selectedCustomers");
  const [customerSpendsSelectedListItem, setCustomerSpendsSelectedListItem] =
    useState([]);
  const [customerGetsSelectedListItem, setCustomerGetsSelectedListItem] =
    useState([]);

  const [collectionsList, setCollectionsList] = useState([]);
  const [discountAppliedValue, setDiscountAppliedValue] =
    useState("collection");
  // const [applyDiscoun, setApplyDiscount] = useState(false);
  const [purReq, setPurReq] = useState("");
  const [custEligibility, setCustEligibility] = useState("");
  const [purInputVal, setPurInputVal] = useState({
    minAmountField: "",
    maxAmountField: "",
    minQuantityField: "",
    maxQuantityField: "",
  });
  const [maxDisUses, setMaxDisUses] = useState("");
  const [usageLimit, setUsageLimit] = useState("");

  // const [combinations, setCombinations] = useState({
  //   productDiscounts: "",
  //   orderDiscounts: "",
  //   shippingDiscounts: "",
  // });
  const [endDate, setEndDate] = useState(false);
  const [startTimings, setStartTimings] = useState({
    startDate: "",
    startTime: "",
  });
  const [endTimings, setEndTimings] = useState({
    endDate: "",
    endTime: "",
  });
  const [salesChannels, setSalesChannels] = useState({
    facebookAndInsta: "",
    googleAndYoutube: "",
    azistaStore: "",
  });
  const [customerBuy, setCustomerBuy] = useState("");
  const [specificItems, setSpecificItems] = useState("");
  const [custGetsQuant, setCustGetsQuant] = useState("");
  const [customerBuysItems, setCustomerBuysItems] = useState("");
  const [discountedValues, setDiscountedValues] = useState("");
  const [discountInputs, setDiscountInputs] = useState({
    discountInAmount: "",
    discountInPercentage: "",
  });
  const [maxUses, setMaxUses] = useState();
  const [maxUsesInput, setMaxUsesInput] = useState("");

  const [customersList, setCustomersList] = useState([]);
  const [disTitle, setDisTitle] = useState("");

  console.log(customersList, "customersList");
  console.log(collectionsList, "collectionsList");
  const baseUrl = process.env.REACT_APP_API_URL;
  const localUrl = process.env.REACT_APP_LOCAL_URL;
  const jwtToken = process.env.REACT_APP_ADMIN_JWT_TOKEN;
  const token = Cookies.get(jwtToken);

  useEffect(() => {
    const productDetails = async () => {
      try {
        const productsUrl = `${baseUrl}/product/all-products`;
        const collectionsUrl = `${baseUrl}/collections/data`;
        const customersUrl = `${baseUrl}/users/get/all`;
        const headers = {
          Authorization: `Bearer ${token} `,
        };
        const [productsData, collectionsData, customersData] =
          await Promise.all([
            axios.post(productsUrl, {}, { headers }),
            axios.get(collectionsUrl, { headers }),
            axios.post(customersUrl, { isActive: true }, { headers }),
          ]);
        setProductsList(productsData.data.products);
        setCollectionsList(collectionsData.data);
        setCustomersList(customersData.data);
        console.log(customersData, "customersData");
      } catch (error) {
        console.log(error);
      }
    };
    productDetails();
  }, [token, baseUrl]);

  console.log(purInputVal, "purInputVal");

  const handleSubmitButton = async () => {
    try {
      const url = `${localUrl}/discount/create`;
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const body = {
        title: disTitle,
        method: method,
        code: disCode,

        mode: amtOfPrdctsDscntVal,
        value: discountVal,
        applyMode: discountAppliedValue,
        applyId: JSON.stringify(
          selectedListItem.map((eachCust) => eachCust.azst_customer_id)
        ),
        prcMode: purReq,
        prcValue: purInputVal?.minAmountField
          ? purInputVal.minAmountField
          : purInputVal.minQuantityField,
        maxApplyValue: purInputVal?.maxAmountField
          ? purInputVal.maxAmountField
          : purInputVal.maxQuantityField,
        elgCustomers:
          custEligibility === "specificCustomer"
            ? JSON.stringify(
                selectedCustomers.map((eachCust) => eachCust.azst_customer_id)
              )
            : "All",
        usgCount: maxDisUses === "mutipleTimeDiscntUses" ? usageLimit : 1,
        startTime: `${startTimings.startDate} ${startTimings.startTime}`,
        endTime: `${endTimings.endDate} ${endTimings.endTime}`,
      };

      const response = await axios.post(url, body, { headers });
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };
  console.log(selectedListItem, "selectedListItem");

  const generateRandomCode = () => {
    let chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZ";
    let randomcode = "";
    for (var i = 0; i < 10; i++) {
      let index = Math.ceil(Math.random() * (chars.length - 1));
      randomcode += chars[index];
    }
    setDisCode(randomcode);
  };

  const navigate = useNavigate();

  const handleMethodTab = (tab) => {
    setMethodTab(tab);
    setDisCode("");
  };
  const handleDisCode = (e) => {
    setDisCode(e.target.value);
  };
  const copyTxt = () => {
    navigator.clipboard.writeText(disCode);
  };
  const handleAmountOfProductsDiscounts = (e) => {
    setAmtOfPrdctsDscntVal(e.target.value);
  };

  const handleDiscountBlock = (e) => {
    setDiscountVal(e.target.value);
  };

  const onSelectedValue = (selectedItem) => {
    setSelectedListItem(selectedItem);
  };

  const onSelectedCustomer = (selectedItem) => {
    setSelectedCustomers(selectedItem);
  };

  const onSelectedCustomerSpendsValue = (selectedItem) => {
    setCustomerSpendsSelectedListItem(selectedItem);
  };
  const onSelectedCustomerGetsValue = (selectedItem) => {
    setCustomerGetsSelectedListItem(selectedItem);
  };
  const handleDiscountAppliedTo = (e) => {
    setDiscountAppliedValue(e.target.value);
  };
  // const handleApplyDiscount = (e) => {
  //   setApplyDiscount(!applyDiscoun);
  // };

  const handlePurReq = (e) => {
    setPurReq(e.target.value);
  };

  console.log(purReq);

  const handlePurReqInput = (e) => {
    setPurInputVal({ ...purInputVal, [e.target.id]: e.target.value });
  };

  const customerEligibility = (e) => {
    setCustEligibility(e.target.value);
  };

  const handleMaxDisUses = (e) => {
    setMaxDisUses(e.target.id);
  };
  console.log(maxDisUses, "maxDisUses");
  const handleUsageLimit = (e) => {
    setUsageLimit(e.target.value);
  };

  // const handleCombination = (e) => {
  //   setCombinations({ ...combinations, [e.target.id]: e.target.checked });
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

  const handleCustomerBuy = (e) => {
    setCustomerBuy(e.target.value);
  };
  const handleSpecificItems = (e) => {
    setSpecificItems(e.target.value);
  };
  const handleCustGetsQuant = (e) => {
    setCustGetsQuant(e.target.value);
  };
  const handleCustomerBuysItems = (e) => {
    setCustomerBuysItems(e.target.value);
  };

  const handleDiscountedValues = (e) => {
    setDiscountedValues(e.target.id);
  };
  const handleDiscountInputs = (e) => {
    setDiscountInputs({ ...discountInputs, [e.target.id]: e.target.value });
  };

  const handleMaxUses = (e) => {
    setMaxUses(e.target.checked);
  };

  const handleMaxUsesCount = (e) => {
    setMaxUsesInput(e.target.value);
  };

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
                  onChange={(e) => setDisTitle(e.target.value)}
                  value={disTitle}
                  className="form-control"
                  min={3}
                  max={100}
                />
              </div>
              <div className="d-flex justify-content-between">
                <h6>{selectedDiscount}</h6>
                <h6>Product discount</h6>
              </div>
              <div className="">
                <label htmlFor="" className="form-label">
                  Method
                </label>
                <div className="methodBtnCont">
                  <button
                    className={`methodBtn ${
                      method === "discountCode" && "active"
                    }`}
                    onClick={() => handleMethodTab("discountCode")}
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
                    Title
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
              {method === "discountCode" && (
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
              )}
            </div>

            {selectedDiscount === "Buy X get Y" ? (
              <div className="bgStyle">
                <div className="">
                  <h6>Customer spends</h6>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="CustomerBuys"
                      id="customerBuysMinItems"
                      value="minimumQuantityOfItems"
                      onChange={handleCustomerBuy}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="customerBuysMinItems"
                    >
                      Minimum quantity of items
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="CustomerBuys"
                      id="customerMinimumPurchase"
                      value="minimumPurchaseAmount"
                      onChange={handleCustomerBuy}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="customerMinimumPurchase"
                    >
                      Minimum purchase amount
                    </label>
                  </div>
                  <div className="row">
                    <div className="col-md-4">
                      <label
                        className="form-check-label"
                        htmlFor="CustomerBuysQuantity"
                      >
                        {customerBuy === "minimumQuantityOfItems"
                          ? "Quantity"
                          : "Amount"}
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="CustomerBuysQuantity"
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
                        value={specificItems}
                        onChange={handleSpecificItems}
                        aria-label="Default select example"
                      >
                        <option value="specificCollections">
                          Specific collections
                        </option>
                        <option value="specificProducts">
                          Specific products
                        </option>
                      </select>
                    </div>
                  </div>
                  <div className="mt-3 mb-3">
                    <Multiselect
                      displayValue={
                        specificItems === "specificProducts"
                          ? "product_title"
                          : "azst_collection_name"
                      }
                      onRemove={onSelectedCustomerSpendsValue}
                      selectedValues={customerSpendsSelectedListItem}
                      onSelect={onSelectedCustomerSpendsValue}
                      options={
                        specificItems === "specificProducts"
                          ? productsList
                          : collectionsList
                      }
                      placeholder={
                        specificItems === "specificProducts"
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
                        Quantity
                      </label>
                      <input
                        type="text"
                        value={custGetsQuant}
                        onChange={handleCustGetsQuant}
                        className="form-control"
                        id="CustomerBuysQuantity"
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
                        value={customerBuysItems}
                        onChange={handleCustomerBuysItems}
                        className="form-select"
                        aria-label="Default select example"
                      >
                        <option value="specificCollections">
                          Specific collections
                        </option>
                        <option value="specificProducts">
                          Specific products
                        </option>
                      </select>
                    </div>
                  </div>
                  <div className="mt-3 mb-3">
                    <Multiselect
                      displayValue={
                        customerBuysItems === "specificProducts"
                          ? "product_title"
                          : "azst_collection_name"
                      }
                      onRemove={onSelectedCustomerGetsValue}
                      selectedValues={customerGetsSelectedListItem}
                      onSelect={onSelectedCustomerGetsValue}
                      options={
                        customerBuysItems === "specificProducts"
                          ? productsList
                          : collectionsList
                      }
                      placeholder={
                        customerBuysItems === "specificProducts"
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
                      id="atDiscountPercentage"
                    />
                    <label
                      className="form-check-label"
                      htmlFor="atDiscountPercentage"
                    >
                      Percentage
                    </label>
                    {discountedValues === "atDiscountPercentage" && (
                      <input
                        type="text"
                        onChange={handleDiscountInputs}
                        id="discountInPercentage"
                        value={discountInputs.discountInPercentage}
                        className="d-block"
                      />
                    )}
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      onChange={handleDiscountedValues}
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
                    {discountedValues === "atDiscountAmount" && (
                      <>
                        <input
                          type="text"
                          onChange={handleDiscountInputs}
                          id="discountInAmount"
                          className="d-block"
                          value={discountInputs.discountInAmount}
                        />
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
                    checked={maxUses}
                    onChange={handleMaxUses}
                    id="setMaximumUses"
                  />
                  <label className="form-check-label" htmlFor="setMaximumUses">
                    Set a maximum number of uses per order
                  </label>
                  {maxUses && (
                    <input
                      type="text"
                      id="maxUsesInput"
                      value={maxUsesInput}
                      onChange={handleMaxUsesCount}
                      className="d-block"
                    />
                  )}
                </div>
              </div>
            ) : (
              ""
            )}
            {selectedDiscount === "Amount of products" ? (
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
                      <option value="fixed Amount">Fixed Amount</option>
                    </select>
                  </div>
                  <div className="col-md-4">
                    {amtOfPrdctsDscntVal === "percentage" ? (
                      <div className="discountBlock">
                        <input
                          type="text"
                          value={discountVal}
                          onChange={handleDiscountBlock}
                          className="form-control amtInpt"
                        />
                        <LiaPercentSolid className="percentageSign" />
                      </div>
                    ) : (
                      <div className="discountBlock">
                        <input
                          value={discountVal}
                          type="text"
                          className="form-control amtInpt"
                          onChange={handleDiscountBlock}
                          placeholder="0.00"
                        />
                        <MdCurrencyRupee className="rupeeSign" />
                      </div>
                    )}
                  </div>
                </div>
                <h6>Applies to</h6>
                <select
                  className="form-select"
                  value={discountAppliedValue}
                  onChange={handleDiscountAppliedTo}
                  aria-label="Default select example"
                >
                  <option value="collection">Specific collections</option>
                  <option value="product">Specific Products</option>
                </select>

                <div className="mt-3 mb-3">
                  <Multiselect
                    displayValue={
                      discountAppliedValue === "products"
                        ? "product_title"
                        : "azst_collection_name"
                    }
                    onRemove={onSelectedValue}
                    selectedValues={selectedListItem}
                    onSelect={onSelectedValue}
                    options={
                      discountAppliedValue === "products"
                        ? productsList
                        : collectionsList
                    }
                    placeholder={
                      discountAppliedValue === "products"
                        ? "Select products"
                        : "Select collections"
                    }
                  />
                </div>
              </div>
            ) : (
              ""
            )}

            {selectedDiscount !== "Buy X get Y" ? (
              <div className="bgStyle">
                <div className="">
                  <h6>Minimum purchase requirements</h6>
                  <div className="form-check">
                    <input
                      onChange={handlePurReq}
                      className="form-check-input"
                      type="radio"
                      name="purReq"
                      id="noMinReq"
                      value="noMinReq"
                    />
                    <label className="form-check-label" htmlFor="noMinReq">
                      No minimum requirements
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      onChange={handlePurReq}
                      className="form-check-input"
                      type="radio"
                      name="purReq"
                      id="minAmount"
                      value="minAmount"
                    />
                    <label className="form-check-label" htmlFor="minAmount">
                      Purchase amount (₹)
                    </label>
                    {purReq === "minAmount" && (
                      <div className="">
                        <div className="d-md-flex">
                          <input
                            className="amtInpt"
                            type="text"
                            onChange={handlePurReqInput}
                            value={purInputVal.minAmountField}
                            id="minAmountField"
                            placeholder="Min amount"
                          />
                          <input
                            className="amtInpt"
                            type="text"
                            onChange={handlePurReqInput}
                            value={purInputVal.maxAmountField}
                            id="maxAmountField"
                            placeholder="Max amount"
                          />
                        </div>
                        <p>Applies only to selected products.</p>
                      </div>
                    )}
                  </div>
                  <div className="form-check">
                    <input
                      onChange={handlePurReq}
                      className="form-check-input"
                      type="radio"
                      name="purReq"
                      id="minQuantity"
                      value="minQuantity"
                    />
                    <label className="form-check-label" htmlFor="minQuantity">
                      Quantity of items
                    </label>
                    {purReq === "minQuantity" && (
                      <div className="">
                        <div className="d-md-flex">
                          <input
                            type="text"
                            onChange={handlePurReqInput}
                            value={purInputVal.minQuantityField}
                            id="minQuantityField"
                            className="amtInpt"
                            placeholder="Min quantity"
                          />
                          <input
                            type="text"
                            onChange={handlePurReqInput}
                            value={purInputVal.maxQuantityField}
                            id="maxQuantityField"
                            className="amtInpt"
                            placeholder="Max quantity"
                          />
                        </div>
                        <p>Applies only to selected products.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              ""
            )}
            <div className="bgStyle">
              <div className="">
                <h6>Customer eligibility</h6>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    onChange={customerEligibility}
                    type="radio"
                    name="customerEligibility"
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
                    onChange={customerEligibility}
                    type="radio"
                    name="customerEligibility"
                    id="specificCustomer"
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
                        displayValue={"azst_customer_lname"}
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
                  value=""
                  id="oneTimeUser"
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
                  value={endDate}
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
                      value={endTimings.startDate}
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
              {method === "discountCode" ? (
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
            {method === "discountCode" && (
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
          <div className="col-md-12 d-flex justify-content-end mt-4">
            <button
              className="dltBtn"
              onClick={() => navigate(-1)}
              style={{ marginRight: "10px" }}
            >
              Discard
            </button>
            <button className="saveBtn" onClick={handleSubmitButton}>
              Save discount
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscountForm;
