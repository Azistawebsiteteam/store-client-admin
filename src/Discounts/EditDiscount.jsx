/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import moment from "moment";
import AdminSideBar from "../Pages/AdminSideBar";
import DiscountForm from "./DiscountForm";
import Cookies from "js-cookie";
import BackBtn from "../Components/BackBtn";
import "../Pages/Admin.css";
import ErrorHandler from "../Pages/ErrorHandler";
import { handleValidationsErrors } from "./Validations";

const EditDiscount = () => {
  const [selectedDiscount, setDiscount] = useState("Discount on Products");
  const [count, setCount] = useState(0);
  // const [discountOutput, setDiscountOutput] = useState();

  const navigate = useNavigate();
  // const [maxUses, setMaxUses] = useState(false);
  const [disCode, setDisCode] = useState("");
  const [disTitle, setDisTitle] = useState("");
  const [method, setMethodTab] = useState("Automatic");
  const [amtOfPrdctsDscntVal, setAmtOfPrdctsDscntVal] = useState("");
  const [discountedValues, setDiscountedValues] = useState("");
  const [discountVal, setDiscountVal] = useState("");
  const [startTimings, setStartTimings] = useState({
    startDate: "",
    startTime: "",
  });
  const [endDate, setEndDate] = useState(false);
  const [endTimings, setEndTimings] = useState({
    endDate: "",
    endTime: "",
  });
  const [maxDisUses, setMaxDisUses] = useState("");
  const [usageLimit, setUsageLimit] = useState("");
  const [custUsageLimit, setCustUsageLimit] = useState("");
  const [custEligibility, setCustEligibility] = useState("");
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [minCartVal, setMinCartVal] = useState("");
  const [customerBuyItems, setCustomerBuyItems] = useState("collection");
  const [customerSpendsSelectedListItem, setCustomerSpendsSelectedListItem] =
    useState([]);
  const [customerGetsSelectedListItem, setCustomerGetsSelectedListItem] =
    useState([]);
  const [custOrderQuant, setCustOrderQuant] = useState({
    minBuyQty: null,
    maxGetYQty: null,
  });
  const [customerGetsItems, setCustomerGetsItems] = useState("collection");

  const [customersList, setCustomersList] = useState([]);
  const [updatedProductsList, setUpdatedProductsList] = useState([]);
  const [collectionsList, setCollectionsList] = useState([]);
  const [productDisTypeValue, setProductDisTypeValue] = useState("");
  const [discountStatus, SetDiscountStatus] = useState(0);
  const [validationErrors, setValidationErrors] = useState({});

  const baseUrl = process.env.REACT_APP_API_URL;
  const jwtToken = Cookies.get(process.env.REACT_APP_ADMIN_JWT_TOKEN);
  const { id } = useParams();

  const discountType = () => {
    switch (selectedDiscount) {
      case "Discount on Products":
        return "product";
      case "Buy X get Y":
        return "buy_x_get_y";
      case "Order value":
        return "cart";
      default:
        return null;
    }
  };

  const renderDiscountValue = (val) => {
    switch (val) {
      case "buy_x_get_y":
        return "Buy X get Y";
      case "product":
        return "Discount on Products";
      case "cart":
        return "Order value";
      default:
        return null;
    }
  };
  const typeValue = () => {
    if (amtOfPrdctsDscntVal) {
      return amtOfPrdctsDscntVal;
    } else {
      if (discountedValues === "free") {
        return "percentage";
      } else if (discountedValues === "flat") {
        return "flat";
      } else {
        return "percentage";
      }
    }
  };

  useEffect(() => {
    const productDetails = async () => {
      try {
        const productsUrl = `${baseUrl}/product/all-products/variants`;
        const collectionsUrl = `${baseUrl}/collections/data`;
        const customersUrl = `${baseUrl}/users/get/all`;

        const headers = {
          Authorization: `Bearer ${jwtToken} `,
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
        console.log(error);
        ErrorHandler.onError(error);
      }
    };
    productDetails();
  }, [jwtToken, baseUrl]);

  const dateFormatter = (value, type) => moment(value).format(type);

  const getBuySelectedListItem = (selectedType, selectedItems) => {
    if (!selectedType || !selectedItems) {
      return [];
    }
    console.log(selectedType, selectedItems);
    const selectedCategoryProducts = [];
    if (selectedType === "product") {
      updatedProductsList.forEach((item) => {
        const selectedP = JSON.parse(selectedItems).find(
          (p) =>
            p.productId === item.productId && p.variantId === item.variantId
        );
        if (selectedP) {
          selectedCategoryProducts.push(item);
        }
      });
    } else {
      JSON.parse(selectedItems).forEach((item) => {
        const collection = collectionsList.find(
          (c) => c.azst_collection_id === item
        );
        if (collection) {
          selectedCategoryProducts.push(collection);
        }
      });
    }

    return selectedCategoryProducts;
  };

  const getCustomersDetails = (custEligibility, selectedCusemers) => {
    if (custEligibility === "all") {
      return customersList;
    } else if (custEligibility === "specific") {
      const selectedCustomersList = customersList.filter((cust) =>
        JSON.parse(selectedCusemers).includes(cust.user_id)
      );
      return selectedCustomersList;
    } else {
      return [];
    }
  };

  useEffect(() => {
    const getDiscounts = async () => {
      try {
        const url = `${baseUrl}/discount`;
        const headers = {
          Authorization: `Bearer ${jwtToken}`,
        };
        ErrorHandler.onLoading();
        const response = await axios.post(url, { discountId: id }, { headers });
        console.log(response, "response");

        if (response.status === 200) {
          const details = response.data;
          SetDiscountStatus(details.status);
          // setMaxUses(details.usage_count);
          setDiscount(renderDiscountValue(details.scope));
          setDisTitle(details.title);
          setDisCode(details.code);
          setMethodTab(details.method);
          setAmtOfPrdctsDscntVal(details.type);
          if (details.type === "percentage" && details.value === 100) {
            setDiscountedValues("free");
          } else {
            setDiscountedValues(details.type);
            setDiscountVal(details.value);
          }

          setStartTimings({
            startDate: dateFormatter(details.start_time, "YYYY-MM-DD"),
            startTime: dateFormatter(details.start_time, "HH:mm"),
          });
          setEndDate(details.end_time !== "" ? true : false);
          setEndTimings({
            endDate: dateFormatter(details.end_time, "YYYY-MM-DD"),
            endTime: dateFormatter(details.end_time, "HH:mm"),
          });

          setMaxDisUses(
            details.usage_count > 1 ? "mutipleTimeDiscntUses" : "oneTimeUser"
          );
          setUsageLimit(details.usage_count);
          setCustEligibility(
            details.eligible_customers === "all" ? "all" : "specificCustomer"
          );
          const customers = getCustomersDetails(
            details.eligible_customers,
            details.eligible_customers
          );
          setSelectedCustomers(customers);
          setMinCartVal(details.min_cart_value);
          setCustomerBuyItems(details.x_product_type);
          const getXitems = getBuySelectedListItem(
            details.x_product_type,
            details.buy_x_product_id
          );

          setCustomerSpendsSelectedListItem(getXitems);
          setCustomerGetsItems(details.y_product_type);
          const getYItems = getBuySelectedListItem(
            details.y_product_type,
            details.get_y_product_id
          );
          setCustomerGetsSelectedListItem(getYItems);

          setCustOrderQuant({
            minBuyQty: details.min_buy_x_qty,
            maxGetYQty: details.max_get_y_qty,
          });
        }

        ErrorHandler.onLoadingClose();
        // setDiscountOutput(response.data);
      } catch (error) {
        console.log(error);
        ErrorHandler.onLoadingClose();
        ErrorHandler.onError(error);
      }
    };
    getDiscounts();
  }, [baseUrl, jwtToken, id]);

  const handleDiscountsTab = (e) => {
    setDiscount(e.target.value);
    setCount(count + 1);
  };

  const commonFields = {
    disTitle,
    custEligibility,
    selectedCustomers,
    maxDisUses,
    // maxUses,
    usageLimit,
    custUsageLimit,
    selectedDiscount,
    disCode,
    method,
    amtOfPrdctsDscntVal,
    discountedValues,
    productDisTypeValue,
    discountVal,
    custOrderQuant,
    minCartVal,
    customerSpendsSelectedListItem,
    customerGetsSelectedListItem,
  };

  const editDiscount = async () => {
    const validationResult = handleValidationsErrors(commonFields);
    console.log(validationResult, "validationResult");
    if (Object.keys(validationResult).length > 0) {
      setValidationErrors(validationResult);
      return;
    }
    try {
      const url = `${baseUrl}/discount`;
      const headers = {
        Authorization: `Bearer ${jwtToken}`,
      };
      const body = {
        discountId: id,
        discount: {
          title: disTitle,
          code: disCode,
          method: method,
          type: typeValue(),
          value: discountedValues === "free" ? 100 : discountVal,
          startTime: `${startTimings.startDate} ${startTimings.startTime}`,
          endTime: `${endTimings.endDate} ${endTimings.endTime}`,
          usageCount: maxDisUses === "mutipleTimeDiscntUses" ? usageLimit : 1,
          customers:
            custEligibility === "specificCustomer"
              ? JSON.stringify(
                  selectedCustomers.map((eachCust) => eachCust.azst_customer_id)
                )
              : "all",
        },
        conditions: {
          scope: discountType(),
          minCartValue: parseInt(minCartVal),
          buyProductType: customerBuyItems,
          buyProductId:
            customerBuyItems === "collection"
              ? customerSpendsSelectedListItem.map(
                  (each) => each.azst_collection_id
                )
              : customerSpendsSelectedListItem.map((each) => ({
                  productId: each.productId,
                  variantId: each.variantId,
                })),
          minBuyQty: custOrderQuant.minBuyQty,
          getProductType: customerGetsItems,
          getYproductId:
            customerGetsItems === "collection"
              ? customerGetsSelectedListItem.map(
                  (each) => each.azst_collection_id
                )
              : customerGetsSelectedListItem.map((each) => ({
                  productId: each.productId,
                  variantId: each.variantId,
                })),
          maxGetYQty: custOrderQuant.maxGetYQty,
        },
      };
      ErrorHandler.onLoading();
      await axios.put(url, body, { headers });
      ErrorHandler.onLoadingClose();
      ErrorHandler.onSuccess("Discount updated successfully");
      navigate(-1);
    } catch (error) {
      ErrorHandler.onLoadingClose();
      ErrorHandler.onError(error);
    }
  };

  const discountProps = {
    custUsageLimit,
    setCustUsageLimit,
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
  };

  return (
    <div className="adminSec">
      <AdminSideBar />
      <div className="commonSec">
        <div className="container">
          <div className="row">
            <div className="col-sm-12">
              <div className="mb-4">
                <h4 className="d-flex align-items-center mb-3">
                  <BackBtn />
                  Edit product discount
                </h4>
              </div>
            </div>
            <div className="col-sm-12">
              <div className="bgStyle">
                <h5 className="mb-2">Select discount type</h5>
                <select
                  className="form-select"
                  value={selectedDiscount}
                  onChange={handleDiscountsTab}
                >
                  <option>Select discount type</option>
                  <option value="Discount on Products">
                    Discount on Products
                  </option>
                  <option value="Buy X get Y">Buy X get Y</option>
                  <option value="Order value">Order value</option>
                </select>
              </div>
            </div>
          </div>
          <div className="row">
            <DiscountForm
              selectedDiscount={selectedDiscount}
              key={count}
              discountProps={discountProps}
              validationErrors={validationErrors}
              setValidationErrors={setValidationErrors}
            />
            <div className="col-md-12 d-flex justify-content-end mt-4 mb-4">
              <button
                className="deleteBtn deleteBtn1"
                onClick={() => navigate(-1)}
                style={{ marginRight: "10px" }}
              >
                Discard
              </button>
              <button className="adminBtn" onClick={editDiscount}>
                Save discount
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditDiscount;
