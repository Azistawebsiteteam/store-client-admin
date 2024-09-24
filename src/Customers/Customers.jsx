import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import {
  useParams,
  useNavigate,
  Link,
  createSearchParams,
} from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";
import { BiRupee } from "react-icons/bi";
import { TiArrowLeft } from "react-icons/ti";
import { FaBusinessTime } from "react-icons/fa";
import moment from "moment";
import { FaRegCopy } from "react-icons/fa";
import AdminSideBar from "../Pages/AdminSideBar";
import errorHandle from "../Pages/ErrorHandler";

const Customers = () => {
  const [customerData, setCustomerData] = useState({});
  const [lastOrdersData, setLastOrdersData] = useState({});
  const baseUrl = `${process.env.REACT_APP_API_URL}/users/get`;
  const token = Cookies.get(process.env.REACT_APP_ADMIN_JWT_TOKEN);
  let { id } = useParams();
  let navigate = useNavigate();

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

  const date = (createDate) => {
    let result = moment(createDate, "MM-DD-YYYY HH:mm:ss").diff(
      moment(),
      "days"
    );

    if (result < 30) {
      return result + " days";
    } else if (result >= 30 && result < 365) {
      let months = Math.floor(result / 30);
      let days = result % 30;
      if (days > 0) {
        return months + " Months, " + days + " days";
      } else {
        return months + " Months";
      }
    } else {
      return Math.floor(result / 365) + " Years";
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
            <TiArrowLeft
              onClick={() => navigate(-1)}
              style={{ fontSize: "30px" }}
            />
            <div className="details" style={{ display: "inline-block" }}>
              <h3>
                {customerData.azst_customer_fname +
                  " " +
                  customerData.azst_customer_lname}
              </h3>
              <small>
                {customerData.azst_customer_state +
                  ", " +
                  customerData.azst_customer_country}
              </small>
              <small>
                {", "}
                Customer for about {date(customerData.azst_customer_createdon)}
              </small>
            </div>
          </div>
          <div className="actions">
            <Dropdown>
              <Dropdown.Toggle variant="success" id="dropdown-basic">
                More Actions
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item href="#/action-1">Disable account</Dropdown.Item>
                <Dropdown.Item href="#/action-2">Merge customer</Dropdown.Item>
                <Dropdown.Item href="#/action-3">Delete account</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
        <div className="row">
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
                <div className="bgStyle d-md-flex justify-content-md-between align-items-md-center">
                  <div className="leftSec">
                    <FaBusinessTime />
                    <span>All time</span>
                  </div>
                  <div className="midSec">
                    <h6>Amount spent</h6>
                    <h6>
                      <BiRupee />
                      {customerData.azst_customer_totalspent}
                    </h6>
                  </div>
                  <div className="rightSec">
                    <h6>Orders</h6>
                    <h6>{customerData.azst_customer_totalorders}</h6>
                  </div>
                </div>
                <div className="bgStyle">
                  <h6>Last order placed</h6>
                  <div className="ordersPlaced">
                    <div className="d-md-flex justify-content-md-between">
                      <div className="col-md-10">
                        <strong>
                          {lastOrdersData.azst_orders_id}{" "}
                          <small className="status">
                            {lastOrdersData.azst_orders_financial_status
                              ? "Paid"
                              : "Payment pending"}
                          </small>
                          <small className="status">
                            {lastOrdersData.azst_orders_fulfillment_status
                              ? "Fullfilled"
                              : "Unfulfilled"}
                          </small>
                        </strong>
                        <p>
                          {moment(
                            lastOrdersData.azst_customer_createdon
                          ).format("D MMMM YYYY [at] h:mm a")}
                        </p>
                      </div>
                      <span className="col-md-2">
                        {lastOrdersData.azst_orders_total}
                      </span>
                    </div>
                    <span
                      style={{ border: "1px dotted lightGray", width: "100%" }}
                    ></span>
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
                              <small>{product.option1}</small>
                              {product.option2 && (
                                <>
                                  {" / "} <small>{product.option2}</small>
                                </>
                              )}
                              {product.option3 && (
                                <>
                                  {" / "} <small>{product.option3}</small>
                                </>
                              )}
                            </>
                          )}
                        </div>
                        <div className="col-sm-2">
                          <span>x {product.azst_order_qty}</span>
                        </div>
                        <div className="col-sm-2">
                          <span>{product.azst_product_price}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  {customerData.azst_customer_totalorders > 1 && (
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
              <p>Has a classic account</p>
              <h6>Contact information</h6>
              <small>
                {customerData.azst_customer_email}{" "}
                <FaRegCopy className="copyIcon" onClick={copyTxt} />
              </small>
              <small className="d-block">
                {customerData.azst_customer_mobile}
              </small>
              <small>Will receive notifications in English</small>
              <h6>Default address</h6>
              <address>
                <span>
                  {`${customerData.azst_customer_fname} 
                  ${customerData.azst_customer_lname},`}
                </span>
                <br />
                <span>
                  {`${customerData.azst_customer_hno}, 
                  ${customerData.azst_customer_area},`}
                </span>
                <br />
                <span>
                  {`${customerData.azst_customer_city}, 
                  ${customerData.azst_customer_country},`}
                </span>
                <br />
                <span>{`${customerData.azst_customer_zip}.`}</span>
              </address>
              <h6>Marketing</h6>
              <ul>
                <li>Email subscribed</li>
                <li>SMS not subscribed</li>
              </ul>
              <h6>Tax exemptions</h6>
              <small>No exemptions</small>
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
