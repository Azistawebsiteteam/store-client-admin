import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useParams, useNavigate } from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";
import { TiArrowLeft } from "react-icons/ti";
import moment from "moment";
import { FaRegCopy } from "react-icons/fa";
import AdminSideBar from "../Pages/AdminSideBar";
import errorHandle from "../Pages/ErrorHandler";

const OrderDetails = () => {
  const [orderData, setOrderData] = useState({});
  const [ShippingDetails, setShippingDetails] = useState({});
  const [shippingLocation, setShippingLocation] = useState({});
  const [billingDetails, setBillingDetails] = useState({});

  const baseUrl = process.env.REACT_APP_API_URL;
  const token = Cookies.get(process.env.REACT_APP_ADMIN_JWT_TOKEN);
  let { id } = useParams();
  let navigate = useNavigate();

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        let url = `${baseUrl}/orders/admin/order/details`;
        const headers = {
          Authorization: `Bearer ${token}`,
        };
        const body = {
          orderId: id,
        };
        errorHandle.onLoading();
        const response = await axios.post(url, body, { headers });
        const { order_shipping_from, shipping_address, billing_address } =
          response.data;
        setOrderData(response.data);
        setShippingDetails(shipping_address);
        setShippingLocation(order_shipping_from);
        setBillingDetails(billing_address);
        errorHandle.onLoadingClose();
      } catch (error) {
        errorHandle.onLoadingClose();
        errorHandle.onError(error);
      }
    };
    getUserDetails();
  }, [baseUrl, id, token]);

  const copyTxt = () => {
    navigator.clipboard.writeText(ShippingDetails.address_email);
  };
  const copyNum = () => {
    navigator.clipboard.writeText(ShippingDetails.address_mobile);
  };

  if (Object.keys(orderData).length === 0) {
    return <div>Loading</div>;
  }

  const updateOrderDeliveryStatus = async (orderId, deliveryStatus) => {
    try {
      console.log(orderId, deliveryStatus);
      const url = `${baseUrl}/orders/admin/delivery`;
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const body = {
        orderId,
        deliveryStatus,
      };
      errorHandle.onLoading();
      const response = await axios.post(url, body, { headers });
      console.log(response);
      errorHandle.onLoadingClose();
    } catch (error) {
      errorHandle.onLoadingClose();
      errorHandle.onError(error);
    }
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
              <h3 className="d-inline">#{orderData.azst_orders_id}</h3>
              <small className="status">
                {orderData.azst_orders_financial_status
                  ? "Paid"
                  : "Payment pending"}
              </small>
              <small className="status">
                {orderData.azst_orders_fulfillment_status
                  ? "Fulfilled"
                  : "Unfulfilled"}
              </small>
              <small>
                {moment(
                  orderData.products_details.azst_orders_created_on
                ).format("D MMMM YYYY [at] h:mm a")}{" "}
                from Online Store
              </small>
            </div>
          </div>
          <div className="actions">
            <Dropdown>
              <Dropdown.Toggle variant="success" id="dropdown-basic">
                More Actions
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item href="#/action-1">Duplicate</Dropdown.Item>
                <Dropdown.Item href="#/action-2">Unarchive</Dropdown.Item>
                <Dropdown.Item href="#/action-3">
                  View order status page
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
        <div className="row">
          <div className="col-md-8">
            <div className="bgStyle">
              <div className="d-md-flex justify-content-md-between">
                <small className="status">
                  {orderData.azst_orders_fulfillment_status
                    ? "Fulfilled"
                    : "Unfulfilled"}
                </small>
              </div>
              <div className="ordersPlaced">
                <div className="">
                  <div className="d-flex flex-column">
                    <small>Location</small>
                    <small className="mb-1">
                      {shippingLocation.inventory_name}
                    </small>
                  </div>
                  <div className="d-flex flex-column">
                    <small>Delivery method</small>
                    <small>{orderData.azst_orderinfo_shippingtype}</small>
                  </div>
                </div>
                <span
                  style={{
                    border: "1px dotted lightgray",
                    width: "100%",
                  }}
                ></span>
                {orderData.products_details.map((eachProduct, i) => (
                  <div key={i} className="row mt-3 mb-3">
                    <div className="col-md-2">
                      <img
                        className="cartImg"
                        src={eachProduct.product_image}
                        alt="product"
                      />
                    </div>
                    <div className="col-md-4">
                      <h6>{eachProduct.product_title}</h6>
                    </div>
                    <div className="col-md-4">
                      {eachProduct.azst_product_price} x{" "}
                      {eachProduct.azst_order_qty}
                    </div>
                    <div className="col-md-2">
                      {parseFloat(eachProduct.azst_product_price) *
                        parseInt(eachProduct.azst_order_qty)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bgStyle">
              <div className="d-md-flex justify-content-md-between">
                <small className="status">
                  {orderData.azst_orders_financial_status
                    ? "Paid"
                    : "Payment pending"}
                </small>
              </div>
              <div className="ordersPlaced">
                <div className="row">
                  <div className="d-flex justify-content-between">
                    <small>Subtotal</small>
                    <small>{orderData.products_details.length} Items</small>
                    <small>{orderData.azst_orders_subtotal}/-</small>
                  </div>
                  <div className="d-flex justify-content-between">
                    <small>Shipping</small>
                    <small>{orderData.azst_orderinfo_shippingtype}</small>
                    <small>{orderData.azst_orderinfo_shpping_amount}/-</small>
                  </div>
                  <div className="d-flex justify-content-between">
                    <small>Taxes</small>
                    <small>IGST (18%) (Included)</small>
                    <small>{orderData.azst_orders_taxes}/-</small>
                  </div>
                  <div className="d-flex justify-content-between">
                    <strong>Total</strong>
                    <small>{orderData.azst_orders_total}/-</small>
                  </div>
                </div>
                <span
                  style={{
                    border: "1px dotted lightgray",
                    width: "100%",
                  }}
                ></span>

                <div className="">
                  <div className="d-flex justify-content-between">
                    <small>Paid</small>
                    <small>0/-</small>
                  </div>
                  <div className="d-flex justify-content-between">
                    <small>Balance</small>
                    <small>{orderData.azst_orders_total}/-</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="bgStyle">
              <h6>Customer</h6>
              <p style={{ marginBottom: "4px" }}>
                {ShippingDetails.address_fname} {ShippingDetails.address_lname}
              </p>
              <small>{orderData.products_details.length} orders</small>
              <h6>Contact information</h6>
              <small>
                {ShippingDetails.address_email}
                <FaRegCopy className="copyIcon" onClick={copyTxt} />
              </small>
              <small className="d-block">
                {ShippingDetails.address_mobile}
                <FaRegCopy className="copyIcon" onClick={copyNum} />
              </small>
              <br />
              <h6>Shipping address</h6>
              <address>
                <small>
                  {ShippingDetails.address_fname}{" "}
                  {ShippingDetails.address_lname}
                </small>
                <br />
                <small>{ShippingDetails.address_address1}</small>
                <br />
                <small>
                  {ShippingDetails.address_city}-{ShippingDetails.address_zip}
                </small>
                <br />
                <small>{ShippingDetails.address_mobile}</small>
              </address>
              <br />
              <h6>Billing address</h6>
              {orderData.azst_orderinfo_billing_adrs_issame === 1 ? (
                <small>Same As Shipping Address </small>
              ) : (
                <address>
                  <small>{billingDetails.billing_name}</small>
                  <br />
                  <small>{billingDetails.billing_hno}</small>
                  <br />
                  <small>{billingDetails.billing_address1}</small>
                  <br />
                  <small>
                    {billingDetails.billing_city}-{billingDetails.billing_zip}
                  </small>
                  <br />
                  <small>{billingDetails.billing_mobile}</small>
                </address>
              )}
              {/*  billing_name billing_address1 : "dfkdjfkdf" billing_address2 : "dfgfhbbf"
              billing_area : "pochamma wada" billing_city : "jagityal"
              billing_company : "ff" billing_country : "inida" billing_district
              : "jagital" billing_hno : "234-24/e" billing_landmark : "temple"
              billing_state : "telangana" billing_zip : "505454 */}
            </div>
            <div className="bgStyle">
              <h6>Notes</h6>
              <small>{orderData.azst_orderinfo_notes}</small>
            </div>
            <div className="bgStyle">
              <div className="deliveryOrderBtn d-flex">
                <button
                  type="button"
                  className="btn btn-primary me-2"
                  onClick={() =>
                    updateOrderDeliveryStatus(orderData.azst_orders_id, "1")
                  }
                >
                  Out for Delivery
                </button>
                <div className="deliveryOrderBtn">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() =>
                      updateOrderDeliveryStatus(orderData.azst_orders_id, "2")
                    }
                  >
                    Confirm Delivery
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
