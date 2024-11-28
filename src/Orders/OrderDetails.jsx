import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import Cookies from "js-cookie";
import { useParams } from "react-router-dom";
// import Dropdown from "react-bootstrap/Dropdown";
import Swal from "sweetalert2";
import BackBtn from "../Components/BackBtn";
import { FaRegCopy } from "react-icons/fa";
import AdminSideBar from "../Pages/AdminSideBar";
import errorHandle from "../Pages/ErrorHandler";

const OrderDetails = () => {
  const [orderData, setOrderData] = useState({});
  const [ShippingDetails, setShippingDetails] = useState({});
  const [shippingLocation, setShippingLocation] = useState({});
  const [billingDetails, setBillingDetails] = useState({});

  const [inventory, setInventory] = useState([]);

  const baseUrl = `${process.env.REACT_APP_API_URL}/orders/admin`;
  const token = Cookies.get(process.env.REACT_APP_ADMIN_JWT_TOKEN);

  let { id } = useParams();

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        let url = `${baseUrl}/order/details`;
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

  useEffect(() => {
    const getInventoryLocations = async () => {
      try {
        const url = `${process.env.REACT_APP_API_URL}/inventory/locations`;

        const headers = {
          Authorization: `Bearer ${token}`,
        };
        errorHandle.onLoading();
        const response = await axios.get(url, { headers });
        const { data } = response;
        setInventory(data);
        errorHandle.onLoadingClose();
      } catch (error) {
        errorHandle.onLoadingClose();
        errorHandle.onError(error);
      }
    };
    getInventoryLocations();
  }, [token]);

  const copyTxt = () => {
    navigator.clipboard.writeText(ShippingDetails.address_email);
  };
  const copyNum = () => {
    navigator.clipboard.writeText(ShippingDetails.address_mobile);
  };

  if (Object.keys(orderData).length === 0) {
    return <div>Loading</div>;
  }

  const handleOrderConfirmation = async (
    orderStatus,
    reason,
    inventory,
    shipping
  ) => {
    try {
      if (orderStatus === "1" && (inventory?.length < 1 || shipping < 1)) {
        alert("Please select the Inventory");
        return;
      }

      if (orderStatus === "2" && reason?.length < 1) {
        alert("Please select the Inventory");
        return;
      }

      errorHandle.onLoading();

      const payload = {
        orderId: id,
        orderStatus,
        inventoryId: inventory,
        reason,
        shippingMethod: shipping,
      };
      //  alert(`${baseUrl}/confirm`); ///admin/confirm
      await axios.post(`${baseUrl}/confirm`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const message = `Order ${
        orderStatus === "1" ? "Confirmed" : "Rejected"
      } successfully `;
      errorHandle.onLoadingClose();
      errorHandle.onSuccess(message);
    } catch (error) {
      errorHandle.onLoadingClose();
      errorHandle.onError(error);
    }
  };

  const handleOrderRejection = async () => {
    const { value: reason } = await Swal.fire({
      input: "textarea",
      inputLabel: "Reason",
      inputPlaceholder: "Enter your reason (10-500 characters)",
      inputAttributes: {
        minlength: 10,
        maxlength: 500,
        "aria-label": "Type your message here",
      },
      showCancelButton: true,
      confirmButtonText: "Confirm",
      cancelButtonText: "Cancel",
      customClass: {
        inputLabel: "swal-custom-label", // Use a custom class for the label
      },
      preConfirm: (reason) => {
        if (!reason || reason.length < 10 || reason.length > 500) {
          Swal.showValidationMessage(
            "Reason must be between 10 and 500 characters."
          );
        }
        return reason;
      },
    });

    if (reason) {
      handleOrderConfirmation("2", reason);
    }
  };

  const shippingMethods = [
    { id: 1, method: "ShipRocket" },
    { id: 2, method: "Express Shipping" },
    { id: 3, method: "Next-Day Delivery" },
    { id: 4, method: "Delhivery" },
    { id: 5, method: "Postal" },
  ];

  const handleOrderConfirm = async () => {
    const { value: formValues } = await Swal.fire({
      html: `
    <label for="swal-inventory" style="display:block;margin-bottom:5px;fonst-size:25px;">Select Inventory</label>
    <select id="swal-inventory" class="swal2-input" style="width: 100%; box-sizing: border-box;">
      <option value=""  selected>Select an inventory</option>
           ${inventory
             .map(
               (item) =>
                 `<option value="${item.inventory_id}">${item.inventory_name}</option>`
             )
             .join("")}
    </select>
    
    <label for="swal-shipping" style="display:block;margin:10px 0 5px;">Select Shipping Method</label>
    <select id="swal-shipping" class="swal2-input" style="width: 100%; box-sizing: border-box;">
      <option value="" disabled selected>Select a method</option>
      ${shippingMethods
        .map(
          (method) => `<option value="${method.id}">${method.method}</option>`
        )
        .join("")}
    </select>
  `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Confirm",
      cancelButtonText: "Cancel",
      customClass: {
        inputLabel: "swal-custom-label", // Used a custom class for the label
      },
      preConfirm: () => {
        const inventoryValue = document.getElementById("swal-inventory").value;
        const shippingValue = document.getElementById("swal-shipping").value;

        if (!inventoryValue) {
          Swal.showValidationMessage("Please select an inventory item.");
          return false;
        }

        if (!shippingValue) {
          Swal.showValidationMessage("Please select a shipping method.");
          return false;
        }

        return [inventoryValue, shippingValue];
      },
    });

    if (formValues) {
      // Pass selected values to the function
      const [inventory, shipping] = formValues;
      handleOrderConfirmation("1", "", inventory, shipping);
    }
  };

  const updateOrderDeliveryStatus = async (orderId, deliveryStatus) => {
    try {
      const url = `${baseUrl}/delivery`;
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const body = {
        orderId,
        deliveryStatus,
      };
      errorHandle.onLoading();
      await axios.post(url, body, { headers });
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
          <div className="orderDetailsSec">
            <BackBtn />
            <div className="details" style={{ display: "inline-block" }}>
              <h4 className="d-inline mb-0">#{orderData.azst_orders_id}</h4>

              {orderData.azst_orders_financial_status ? (
                <label className="status orderSecStatusBtn paidStatus">
                  Paid
                </label>
              ) : (
                <label className="status orderSecStatusBtn unFulfilledStatus">
                  Payment pending
                </label>
              )}

              {orderData.azst_orders_fulfillment_status ? (
                <label className="status orderSecStatusBtn paidStatus">
                  Fulfilled
                </label>
              ) : (
                <label className="status orderSecStatusBtn unFulfilledStatus">
                  Unfulfilled
                </label>
              )}
              <label style={{ whiteSpace: "normal" }}>
                {moment(
                  orderData.products_details.azst_orders_created_on
                ).format("D MMMM YYYY [at] h:mm a")}{" "}
                from Online Store
              </label>
            </div>
          </div>
          {/* <div className='actions'>
            <Dropdown>
              <Dropdown.Toggle variant='success' id='dropdown-basic'>
                More Actions
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item href='#/action-1'>Duplicate</Dropdown.Item>
                <Dropdown.Item href='#/action-2'>Unarchive</Dropdown.Item>
                <Dropdown.Item href='#/action-3'>
                  View order status page
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div> */}
        </div>
        <div className="row">
          <div className="col-md-8">
            <div className="bgStyle">
              <div className="d-md-flex justify-content-md-between">
                {orderData.azst_orders_fulfillment_status ? (
                  <label className="status orderSecStatusBtn paidStatus">
                    Fulfilled
                  </label>
                ) : (
                  <label className="status orderSecStatusBtn unFulfilledStatus">
                    Unfulfilled
                  </label>
                )}
              </div>
              <div className="ordersPlaced">
                <div className="">
                  <div className="d-flex flex-column">
                    <label>Location</label>
                    <label className="mb-1">
                      {shippingLocation.inventory_name}
                    </label>
                  </div>
                  <div className="d-flex flex-column">
                    <label>Delivery method</label>
                    <label>{orderData.azst_orderinfo_shippingtype}</label>
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
                    <div className="col-2">
                      <img
                        className="cartImg"
                        src={eachProduct.product_image}
                        alt="product"
                      />
                    </div>
                    <div className="col-4 ps-4">
                      <h6>{eachProduct.product_title}</h6>
                    </div>
                    <div className="col-4">
                      <label>
                        {eachProduct.azst_product_price} x{" "}
                        {eachProduct.azst_order_qty}
                      </label>
                    </div>
                    <div className="col-2">
                      <label>
                        {" "}
                        {parseFloat(eachProduct.azst_product_price) *
                          parseInt(eachProduct.azst_order_qty)}
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bgStyle">
              <div className="d-md-flex justify-content-md-between">
                {orderData.azst_orders_financial_status ? (
                  <label className="status orderSecStatusBtn paidStatus">
                    Paid
                  </label>
                ) : (
                  <label className="status orderSecStatusBtn unFulfilledStatus">
                    Payment pending
                  </label>
                )}
              </div>
              <div className="ordersPlaced">
                <div className="row">
                  <div className="d-flex justify-content-between">
                    <label>Subtotal</label>
                    <label>{orderData.products_details.length} Items</label>
                    <label>{orderData.azst_orders_subtotal}/-</label>
                  </div>
                  <div className="d-flex justify-content-between">
                    <label>Shipping</label>
                    <label>{orderData.azst_orderinfo_shippingtype}</label>
                    <label>{orderData.azst_orderinfo_shpping_amount}/-</label>
                  </div>
                  <div className="d-flex justify-content-between">
                    <label>Taxes</label>
                    <label>IGST (18%) (Included)</label>
                    <label>{orderData.azst_orders_taxes}/-</label>
                  </div>
                  <div className="d-flex justify-content-between">
                    <strong>Total</strong>
                    <label>{orderData.azst_orders_total}/-</label>
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
                    <label>Paid</label>
                    <label>0/-</label>
                  </div>
                  <div className="d-flex justify-content-between">
                    <label>Balance</label>
                    <label>{orderData.azst_orders_total}/-</label>
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
              <label>{orderData.products_details.length} orders</label>
              <h6>Contact information</h6>
              <label>
                {ShippingDetails.address_email}
                <FaRegCopy className="copyIcon" onClick={copyTxt} />
              </label>
              <label className="d-block">
                {ShippingDetails.address_mobile}
                <FaRegCopy className="copyIcon" onClick={copyNum} />
              </label>
              <br />
              <h6>Shipping address</h6>
              <address>
                <label>
                  {ShippingDetails.address_fname}{" "}
                  {ShippingDetails.address_lname}
                </label>
                <br />
                <label>{ShippingDetails.address_address1}</label>
                <br />
                <label>
                  {ShippingDetails.address_city}-{ShippingDetails.address_zip}
                </label>
                <br />
                <label>{ShippingDetails.address_mobile}</label>
              </address>
              <br />
              <h6>Billing address</h6>
              {orderData.azst_orderinfo_billing_adrs_issame === 1 ? (
                <label>Same As Shipping Address </label>
              ) : (
                <address>
                  <label>{billingDetails.billing_name}</label>
                  <br />
                  <label>{billingDetails.billing_hno}</label>
                  <br />
                  <label>{billingDetails.billing_address1}</label>
                  <br />
                  <label>
                    {billingDetails.billing_city}-{billingDetails.billing_zip}
                  </label>
                  <br />
                  <label>{billingDetails.billing_mobile}</label>
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
              {orderData.azst_orderinfo_notes ? (
                <label>{orderData.azst_orderinfo_notes}</label>
              ) : (
                <>
                  <textarea
                    className="form-control"
                    placeholder="Leave a comment here"
                    id="floatingTextarea"
                  ></textarea>
                  <button className="mt-2 saveBtn">Save</button>
                </>
              )}
            </div>
            <div className="bgStyle">
              <div className="deliveryOrderBtn d-flex">
                <button
                  type="button"
                  className="adminBtn me-2"
                  onClick={handleOrderConfirm}
                >
                  Approve
                </button>
                <div className="deliveryOrderBtn">
                  <button
                    type="button"
                    className="adminBtn"
                    onClick={handleOrderRejection}
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
            <div className="bgStyle">
              <div className="deliveryOrderBtn d-flex">
                <button
                  type="button"
                  className="adminBtn me-2"
                  onClick={() =>
                    updateOrderDeliveryStatus(orderData.azst_orders_id, "1")
                  }
                >
                  Out for Delivery
                </button>
                <div className="deliveryOrderBtn">
                  <button
                    type="button"
                    className="adminBtn"
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
