import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import Cookies from 'js-cookie';
import { useParams, useNavigate } from 'react-router-dom';
import Dropdown from 'react-bootstrap/Dropdown';
import Swal from 'sweetalert2';

import { TiArrowLeft } from 'react-icons/ti';
import { FaRegCopy } from 'react-icons/fa';
import AdminSideBar from '../Pages/AdminSideBar';
import errorHandle from '../Pages/ErrorHandler';

const OrderDetails = () => {
  const [orderData, setOrderData] = useState({});
  const [ShippingDetails, setShippingDetails] = useState({});
  const [shippingLocation, setShippingLocation] = useState({});
  const [billingDetails, setBillingDetails] = useState({});

  const [inventory, setInventory] = useState([]);

  const baseUrl = `${process.env.REACT_APP_API_URL}/orders/admin`;
  const token = Cookies.get(process.env.REACT_APP_ADMIN_JWT_TOKEN);

  let { id } = useParams();
  let navigate = useNavigate();

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
      if (orderStatus === '1' && (inventory?.length < 1 || shipping < 1)) {
        alert('Please select the Inventory');
        return;
      }

      if (orderStatus === '2' && reason?.length < 1) {
        alert('Please select the Inventory');
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
        orderStatus === '1' ? 'Confirmed' : 'Rejected'
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
      input: 'textarea',
      inputLabel: 'Reason',
      inputPlaceholder: 'Enter your reason (10-500 characters)',
      inputAttributes: {
        minlength: 10,
        maxlength: 500,
        'aria-label': 'Type your message here',
      },
      showCancelButton: true,
      confirmButtonText: 'Confirm',
      cancelButtonText: 'Cancel',
      customClass: {
        inputLabel: 'swal-custom-label', // Use a custom class for the label
      },
      preConfirm: (reason) => {
        if (!reason || reason.length < 10 || reason.length > 500) {
          Swal.showValidationMessage(
            'Reason must be between 10 and 500 characters.'
          );
        }
        return reason;
      },
    });

    if (reason) {
      handleOrderConfirmation('2', reason);
    }
  };

  const shippingMethods = [
    { id: 1, method: 'ShipRocket' },
    { id: 2, method: 'Express Shipping' },
    { id: 3, method: 'Next-Day Delivery' },
    { id: 4, method: 'Delhivery' },
    { id: 5, method: 'Postal' },
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
             .join('')}
    </select>
    
    <label for="swal-shipping" style="display:block;margin:10px 0 5px;">Select Shipping Method</label>
    <select id="swal-shipping" class="swal2-input" style="width: 100%; box-sizing: border-box;">
      <option value="" disabled selected>Select a method</option>
      ${shippingMethods
        .map(
          (method) => `<option value="${method.id}">${method.method}</option>`
        )
        .join('')}
    </select>
  `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Confirm',
      cancelButtonText: 'Cancel',
      customClass: {
        inputLabel: 'swal-custom-label', // Used a custom class for the label
      },
      preConfirm: () => {
        const inventoryValue = document.getElementById('swal-inventory').value;
        const shippingValue = document.getElementById('swal-shipping').value;

        if (!inventoryValue) {
          Swal.showValidationMessage('Please select an inventory item.');
          return false;
        }

        if (!shippingValue) {
          Swal.showValidationMessage('Please select a shipping method.');
          return false;
        }

        return [inventoryValue, shippingValue];
      },
    });

    if (formValues) {
      // Pass selected values to the function
      const [inventory, shipping] = formValues;
      handleOrderConfirmation('1', '', inventory, shipping);
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
    <div className='adminSec'>
      <AdminSideBar />
      <div className='commonSec'>
        <div className='topSec'>
          <div className='detailsSec'>
            <TiArrowLeft
              onClick={() => navigate(-1)}
              style={{ fontSize: '30px' }}
            />
            <div className='details' style={{ display: 'inline-block' }}>
              <h3 className='d-inline'>#{orderData.azst_orders_id}</h3>
              <small className='status'>
                {orderData.azst_orders_financial_status
                  ? 'Paid'
                  : 'Payment pending'}
              </small>
              <small className='status'>
                {orderData.azst_orders_fulfillment_status
                  ? 'Fulfilled'
                  : 'Unfulfilled'}
              </small>
              <small>
                {moment(
                  orderData.products_details.azst_orders_created_on
                ).format('D MMMM YYYY [at] h:mm a')}{' '}
                from Online Store
              </small>
            </div>
          </div>
          <div className='actions'>
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
          </div>
        </div>
        <div className='row'>
          <div className='col-md-8'>
            <div className='bgStyle'>
              <div className='d-md-flex justify-content-md-between'>
                <small className='status'>
                  {orderData.azst_orders_fulfillment_status
                    ? 'Fulfilled'
                    : 'Unfulfilled'}
                </small>
              </div>
              <div className='ordersPlaced'>
                <div className=''>
                  <div className='d-flex flex-column'>
                    <small>Location</small>
                    <small className='mb-1'>
                      {shippingLocation.inventory_name}
                    </small>
                  </div>
                  <div className='d-flex flex-column'>
                    <small>Delivery method</small>
                    <small>{orderData.azst_orderinfo_shippingtype}</small>
                  </div>
                </div>
                <span
                  style={{
                    border: '1px dotted lightgray',
                    width: '100%',
                  }}></span>
                {orderData.products_details.map((eachProduct, i) => (
                  <div key={i} className='row mt-3 mb-3'>
                    <div className='col-md-2'>
                      <img
                        className='cartImg'
                        src={eachProduct.product_image}
                        alt='product'
                      />
                    </div>
                    <div className='col-md-4'>
                      <h6>{eachProduct.product_title}</h6>
                    </div>
                    <div className='col-md-4'>
                      {eachProduct.azst_product_price} x{' '}
                      {eachProduct.azst_order_qty}
                    </div>
                    <div className='col-md-2'>
                      {parseFloat(eachProduct.azst_product_price) *
                        parseInt(eachProduct.azst_order_qty)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className='bgStyle'>
              <div className='d-md-flex justify-content-md-between'>
                <small className='status'>
                  {orderData.azst_orders_financial_status
                    ? 'Paid'
                    : 'Payment pending'}
                </small>
              </div>
              <div className='ordersPlaced'>
                <div className='row'>
                  <div className='d-flex justify-content-between'>
                    <small>Subtotal</small>
                    <small>{orderData.products_details.length} Items</small>
                    <small>{orderData.azst_orders_subtotal}/-</small>
                  </div>
                  <div className='d-flex justify-content-between'>
                    <small>Shipping</small>
                    <small>{orderData.azst_orderinfo_shippingtype}</small>
                    <small>{orderData.azst_orderinfo_shpping_amount}/-</small>
                  </div>
                  <div className='d-flex justify-content-between'>
                    <small>Taxes</small>
                    <small>IGST (18%) (Included)</small>
                    <small>{orderData.azst_orders_taxes}/-</small>
                  </div>
                  <div className='d-flex justify-content-between'>
                    <strong>Total</strong>
                    <small>{orderData.azst_orders_total}/-</small>
                  </div>
                </div>
                <span
                  style={{
                    border: '1px dotted lightgray',
                    width: '100%',
                  }}></span>

                <div className=''>
                  <div className='d-flex justify-content-between'>
                    <small>Paid</small>
                    <small>0/-</small>
                  </div>
                  <div className='d-flex justify-content-between'>
                    <small>Balance</small>
                    <small>{orderData.azst_orders_total}/-</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='col-md-4'>
            <div className='bgStyle'>
              <h6>Customer</h6>
              <p style={{ marginBottom: '4px' }}>
                {ShippingDetails.address_fname} {ShippingDetails.address_lname}
              </p>
              <small>{orderData.products_details.length} orders</small>
              <h6>Contact information</h6>
              <small>
                {ShippingDetails.address_email}
                <FaRegCopy className='copyIcon' onClick={copyTxt} />
              </small>
              <small className='d-block'>
                {ShippingDetails.address_mobile}
                <FaRegCopy className='copyIcon' onClick={copyNum} />
              </small>
              <br />
              <h6>Shipping address</h6>
              <address>
                <small>
                  {ShippingDetails.address_fname}{' '}
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
            <div className='bgStyle'>
              <h6>Notes</h6>
              <small>{orderData.azst_orderinfo_notes}</small>
            </div>
            <div className='bgStyle'>
              <div className='deliveryOrderBtn d-flex'>
                <button
                  type='button'
                  className='btn btn-primary me-2'
                  onClick={handleOrderConfirm}>
                  Approve
                </button>
                <div className='deliveryOrderBtn'>
                  <button
                    type='button'
                    className='btn btn-primary'
                    onClick={handleOrderRejection}>
                    Recject
                  </button>
                </div>
              </div>
            </div>
            <div className='bgStyle'>
              <div className='deliveryOrderBtn d-flex'>
                <button
                  type='button'
                  className='btn btn-primary me-2'
                  onClick={() =>
                    updateOrderDeliveryStatus(orderData.azst_orders_id, '1')
                  }>
                  Out for Delivery
                </button>
                <div className='deliveryOrderBtn'>
                  <button
                    type='button'
                    className='btn btn-primary'
                    onClick={() =>
                      updateOrderDeliveryStatus(orderData.azst_orders_id, '2')
                    }>
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
