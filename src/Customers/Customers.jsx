import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useParams, Link, createSearchParams } from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";
import { BiRupee } from "react-icons/bi";

import { FaBusinessTime } from "react-icons/fa";
import moment from "moment";
import { FaRegCopy } from "react-icons/fa";
import AdminSideBar from "../Pages/AdminSideBar";
import errorHandle from "../Pages/ErrorHandler";
import BackBtn from "../Components/BackBtn";
import { getOptons, getStringData } from "../Utils/StringConcat";

const Customers = () => {
  const [customerData, setCustomerData] = useState({});
  const [lastOrdersData, setLastOrdersData] = useState({});
  const baseUrl = `${process.env.REACT_APP_API_URL}/users/get`;
  const token = Cookies.get(process.env.REACT_APP_ADMIN_JWT_TOKEN);
  let { id } = useParams();

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        let url = `${baseUrl}/details`;
        const headers = {
          Authorization: `Bearer ${token}`,
        };
        const body = {
          userId: id,
        };
        errorHandle.onLoading();
        const response = await axios.post(url, body, { headers });
        setCustomerData(response.data.customerData);
        setLastOrdersData(response.data.latestOrder);
        errorHandle.onLoadingClose();
      } catch (error) {
        errorHandle.onLoadingClose();
        errorHandle.onError();
      }
    };
    getUserDetails();
  }, [baseUrl, id, token]);

  // const getCustomerTime = (createDate) => {

  //   // Correct the date format
  //   let result = moment(createDate, 'DD-MM-YYYY HH:mm:ss').diff(
  //     moment(),
  //     'days'
  //   );

  //   if (result < 30) {
  //     return Math.abs(result) + ' days'; // Using Math.abs to handle negative values if createDate is in the future
  //   } else if (result >= 30 && result < 365) {
  //     let months = Math.floor(Math.abs(result) / 30);
  //     let days = Math.abs(result) % 30;
  //     if (days > 0) {
  //       return months + ' Months, ' + days + ' days';
  //     } else {
  //       return months + ' Months';
  //     }
  //   } else {
  //     return Math.floor(Math.abs(result) / 365) + ' Years';
  //   }
  // };

  const getCustomerTime = (createDate) => {
    // Helper function to pluralize units
    const pluralize = (value, unit) =>
      value === 1 ? `${value} ${unit}` : `${value} ${unit}s`;

    // Parse and calculate the difference in days
    let result = moment(createDate, "DD-MM-YYYY HH:mm:ss").diff(
      moment(),
      "days"
    );

    result = Math.abs(result); // Convert to positive days if needed

    if (result < 30) {
      return pluralize(result, "day");
    } else if (result < 365) {
      let months = Math.floor(result / 30);
      let days = result % 30;
      return days > 0
        ? `${pluralize(months, "Month")}, ${pluralize(days, "day")}`
        : pluralize(months, "Month");
    } else {
      let years = Math.floor(result / 365);
      let remainingDays = result % 365;
      let months = Math.floor(remainingDays / 30);
      let days = remainingDays % 30;

      let timeString = pluralize(years, "Year");
      if (months > 0) timeString += `, ${pluralize(months, "Month")}`;
      if (days > 0) timeString += `, ${pluralize(days, "day")}`;

      return timeString;
    }
  };

  const copyTxt = () => {
    navigator.clipboard.writeText(customerData.azst_customer_email);
  };

  return (
    <div className="adminSec">
      <AdminSideBar />
      <div className="commonSec">
        <div className="topSec">
          <div className="detailsSec">
            <BackBtn />
            <div className="details">
              <h4 className="profile-name">
                {customerData.azst_customer_fname +
                  " " +
                  customerData.azst_customer_lname}
              </h4>
              <label>
                {getStringData([
                  customerData.azst_customer_state,
                  customerData.azst_customer_country,
                ])}
              </label>

              <label>
                Customer for about{" "}
                {getCustomerTime(customerData.azst_customer_createdon)}
              </label>
            </div>
          </div>
          <div>
            <Dropdown className="adminBtn">
              <Dropdown.Toggle className="bootstrapBtn" id="dropdown-basic">
                More Actions
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item href="#/action-1">Disable account</Dropdown.Item>
                <Dropdown.Item href="#/action-3">Delete account</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
        <div className="row mb-5">
          <div className="col-md-8">
            {Object.keys(lastOrdersData).length === 0 && (
              <div className="bgStyle d-md-flex justify-content-md-between">
                <div className="leftSec">
                  <h6>Last order placed</h6>
                  <p>This customer hasn’t placed any orders yet</p>
                </div>
                <div className="rightSec">
                  <img
                    src="../../../no_orders.svg"
                    alt="No orders"
                    className="noOrdersImg"
                  />
                </div>
              </div>
            )}
            {Object.keys(lastOrdersData).length > 0 && (
              <>
                <div className="bgStyle" style={{ padding: "2%" }}>
                  <div className="row">
                    <div className="col-3 customerInfo ">
                      <div>
                        <FaBusinessTime
                          fill="Grey"
                          size={20}
                          className="me-2"
                        />
                        <label style={{ color: "grey" }}>All time</label>
                      </div>
                    </div>
                    <div className="col-1">
                      <div className="demarcatedLine"></div>
                    </div>
                    <div className="col-4 customerInfo">
                      <h6 className="customerInfoHeading">Amount spent</h6>
                      <h6>
                        <BiRupee />
                        {customerData.azst_customer_totalspent}
                      </h6>
                    </div>
                    <div className="col-1">
                      <div className="demarcatedLine"></div>
                    </div>
                    <div className="col-3 customerInfo">
                      <h6 className="customerInfoHeading">Orders</h6>
                      <h6>{customerData.azst_customer_totalorders}</h6>
                    </div>
                  </div>
                </div>
                <div className="bgStyle">
                  <h6>Last order placed</h6>
                  <div className="ordersPlaced">
                    <div className="d-md-flex justify-content-md-between p-2">
                      <div className="col-md-10">
                        <label className="orderId">
                          {lastOrdersData.azst_orders_id}
                        </label>
                        <label
                          className={
                            lastOrdersData.azst_orders_financial_status
                              ? "variantsOpt ms-2 me-2"
                              : "unPaidStatus  ms-2 me-2"
                          }
                        >
                          {lastOrdersData.azst_orders_financial_status
                            ? "Paid"
                            : "Payment pending"}
                        </label>
                        <label
                          className={
                            lastOrdersData.azst_orders_fulfillment_status
                              ? "variantsOpt"
                              : "unFullfilledStatus"
                          }
                        >
                          {lastOrdersData.azst_orders_fulfillment_status
                            ? "Fullfilled"
                            : "Unfulfilled"}
                        </label>
                        <p>
                          {moment(
                            lastOrdersData.azst_customer_createdon
                          ).format("D MMMM YYYY [at] h:mm a")}
                        </p>
                      </div>
                      <label className="col-md-2">
                        <BiRupee />
                        <strong>{lastOrdersData.azst_orders_total}</strong>
                      </label>
                    </div>
                    <hr
                      style={{
                        border: "1px dotted lightGray",
                        width: "100%",
                      }}
                    />
                    {lastOrdersData.products_details.map((product, i) => (
                      <div className="itemCont" key={i}>
                        <div className="col-sm-2">
                          <img
                            className="cartImg"
                            src={product.product_image}
                            alt="product"
                          />
                        </div>
                        <div className="col-sm-6">
                          <p>{product.product_title}</p>
                          {product.azst_order_variant_id !== 0 && (
                            <>
                              <label>
                                {getOptons(
                                  product.option1,
                                  product.option2,
                                  product.option3
                                )}
                              </label>
                            </>
                          )}
                        </div>
                        <div className="col-sm-2">
                          <label>x {product.azst_order_qty}</label>
                        </div>
                        <div className="col-sm-2">
                          <label>
                            <BiRupee />
                            {product.azst_product_price}
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                  {parseInt(customerData.azst_customer_totalorders) > 1 && (
                    <div className="d-flex justify-content-end mt-2">
                      <Link
                        to={{
                          pathname: "/orders",
                          search: `?${createSearchParams({
                            customer_id: id,
                          })}`,
                        }}
                        className="viewAllOrders"
                      >
                        View all orders
                      </Link>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
          <div className="col-md-4">
            <div className="bgStyle">
              <h6>Customer</h6>
              <label>Has a classic account</label>
              <h6>Contact information</h6>
              <label>
                {customerData.azst_customer_email}{" "}
                <FaRegCopy className="copyIcon" onClick={copyTxt} />
              </label>
              <label className="d-block">
                {customerData.azst_customer_mobile}
              </label>
              <label>Will receive notifications in English</label>
              <h6>Default address</h6>
              <address>
                <label>
                  {`${customerData.azst_customer_fname} 
                  ${customerData.azst_customer_lname},`}
                </label>
                <br />
                <label>
                  {getStringData([
                    customerData.azst_customer_hno,
                    customerData.azst_customer_area,
                  ])}
                </label>
                <br />
                <label>
                  {getStringData([
                    customerData.azst_customer_city,
                    customerData.azst_customer_country,
                  ])}
                </label>
                <br />
                <label>
                  {" "}
                  {getStringData([customerData.azst_customer_zip]) ??
                    getStringData([customerData.azst_customer_zip]) + "."}
                </label>
              </address>
              <h6>Marketing</h6>
              <ul>
                <li style={{ fontSize: "1rem" }}>Email subscribed</li>
                <li style={{ fontSize: "1rem" }}>SMS not subscribed</li>
              </ul>
              <h6>Tax exemptions</h6>
              <label>No exemptions</label>
            </div>
            <div className="bgStyle">
              <h6>Notes</h6>
              <textarea cols="40" rows="2"></textarea>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Customers;
