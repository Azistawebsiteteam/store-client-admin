import React from "react";
import axios from "axios";
import Cookies from "js-cookie";
import AdminSideBar from "../Pages/AdminSideBar";
import DiscountForm from "./DiscountForm";
import { useState } from "react";
import BackBtn from "../Components/BackBtn";
import "../Pages/Admin.css";
import ErrorHandler from "../Pages/ErrorHandler";
import { useNavigate } from "react-router-dom";

const CreateDiscount = () => {
  const [selectedDiscount, setDiscount] = useState("Discount on Products");
  const [count, setCount] = useState(0);
  const [maxUses, setMaxUses] = useState(false);
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
  const [productDisTypeValue, setProductDisTypeValue] = useState("");

  const baseUrl = process.env.REACT_APP_API_URL;
  const jwtToken = Cookies.get(process.env.REACT_APP_ADMIN_JWT_TOKEN);

  const navigate = useNavigate();

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

  const typeValue = () => {
    if (amtOfPrdctsDscntVal) {
      return amtOfPrdctsDscntVal;
    } else {
      if (discountedValues === "free") {
        return "percentage";
      } else if (discountedValues === "flat") {
        return "flat";
      } else if (discountedValues === "product") {
        return "product";
      } else {
        return "percentage";
      }
    }
  };

  const handleDiscountsTab = (e) => {
    setDiscount(e.target.value);
    setCount(count + 1);
  };

  const discountProps = {
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
  };

  const handleSubmitButton = async () => {
    try {
      const url = `${baseUrl}/discount/create`;
      const headers = {
        Authorization: `Bearer ${jwtToken}`,
      };
      const body = {
        discount: {
          title: disTitle,
          code: disCode,
          method: method,
          type: typeValue(),
          value: discountVal,
          productDscType: productDisTypeValue || "",
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

      ErrorHandler.onLoading("Creating your discount, please wait...");
      // eslint-disable-next-line no-unused-vars
      const response = await axios.post(url, body, { headers });
      navigate(-1);
      ErrorHandler.onLoadingClose();
      ErrorHandler.onSuccess();
    } catch (error) {
      ErrorHandler.onLoadingClose();
      ErrorHandler.onError(error);
    }
  };

  return (
    <div className="adminSec">
      <AdminSideBar />
      <div className="commonSec">
        <div className="container">
          <div className="row">
            <div className="col-sm-12">
              <div className="mb-4">
                <h3 className="d-flex">
                  <BackBtn />
                  Create product discount
                </h3>
              </div>
            </div>
            <div className="col-sm-12">
              <div className="bgStyle">
                <h5>Select discount type</h5>
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
            />
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
    </div>
  );
};

export default CreateDiscount;
