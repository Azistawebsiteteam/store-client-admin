/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useLocation, useNavigate } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import AdminSideBar from '../Pages/AdminSideBar';
import errorHandle from '../Pages/ErrorHandler';
import moment from 'moment';
import { CiCalendarDate } from 'react-icons/ci';
import { FcApprove } from 'react-icons/fc';
import { FcDisapprove } from 'react-icons/fc';
import './index.css';
import ErrorHandler from '../Pages/ErrorHandler';

const OrdersListing = () => {
  const [orders, setOrders] = useState([]);
  const [duration, setDuration] = useState('1');
  const [statisticsData, setStatisticsData] = useState({});
  const [onClickDuration, setOnClickDuration] = useState(false);
  const [inventory, setInventory] = useState([]);
  const [inventoryId, setInventoryId] = useState('');

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const customerId = searchParams.get('customer_id');
  const navigate = useNavigate();

  const baseUrl = `${process.env.REACT_APP_API_URL}/orders/admin`;
  const jwtToken = Cookies.get(process.env.REACT_APP_ADMIN_JWT_TOKEN);

  const getOrders = useCallback(async () => {
    try {
      const url = `${baseUrl}/all`;
      const headers = {
        Authorization: `Bearer ${jwtToken}`,
      };

      errorHandle.onLoading();
      let body = {};
      if (customerId) {
        body = {
          customerId,
        };
      }
      const response = await axios.post(url, body, { headers });

      errorHandle.onLoadingClose();
      setOrders(response.data);
    } catch (error) {
      errorHandle.onLoadingClose();
      errorHandle.onError(error);
    }
  }, [baseUrl, jwtToken, customerId]);

  useEffect(() => {
    getOrders();
  }, [getOrders]);

  useEffect(() => {
    const getInventoryLocations = async () => {
      try {
        const url = `${process.env.REACT_APP_API_URL}/inventory/locations`;

        const headers = {
          Authorization: `Bearer ${jwtToken}`,
        };
        errorHandle.onLoading();
        const response = await axios.get(url, { headers });
        setInventory(response.data);
        if (response.data.length > 0) {
          setInventoryId(response.data[0].inventory_id);
        }
        errorHandle.onLoadingClose();
      } catch (error) {
        errorHandle.onLoadingClose();
        errorHandle.onError(error);
      }
    };
    getInventoryLocations();
  }, [baseUrl, jwtToken]);

  const displayDuration = (duration) => {
    switch (duration) {
      case '1':
        return 'Today';
      case '7':
        return 'Last 7 Days';
      case '30':
        return 'Last 30 Days';
      default:
        return 'Today';
    }
  };

  const date = (createDate) => {
    return moment(createDate).format('D MMMM [at] h:mm a');
  };

  const handleCustOrder = (id) => {
    navigate(`/orders/${id}`);
  };

  const handleDateRange = (e) => {
    setDuration(e.target.id);
  };

  const onSubmitDuration = async (e) => {
    try {
      const url = `${baseUrl}/stats`;
      const headers = {
        Authorization: `Bearer ${jwtToken}`,
      };
      ErrorHandler.onLoading();
      const response = await axios.post(
        url,
        { formDays: duration },
        { headers }
      );
      if (response.status === 200) {
        setStatisticsData(response.data);
      }
      getOrders();
      ErrorHandler.onLoadingClose();
      setOnClickDuration(false);
    } catch (error) {
      ErrorHandler.onLoadingClose();
      ErrorHandler.onError(error);
    }
  };

  useEffect(() => {
    onSubmitDuration();
  }, [duration]);

  const handleOrderConfirmation = async (e, id, orderStatus, type) => {
    try {
      if (type !== 'cancel') {
        if (inventory === '') {
          return alert('Please select the Inventory');
        }
      }

      const url = `${baseUrl}/confirm`;
      const headers = {
        Authorization: `Bearer ${jwtToken}`,
      };
      const body = {
        orderId: id,
        orderStatus,
        inventoryId: inventoryId,
      };
      ErrorHandler.onLoading();
      // eslint-disable-next-line no-unused-vars
      const response = await axios.post(url, body, { headers });
      ErrorHandler.onLoadingClose();
      getOrders();
    } catch (error) {
      ErrorHandler.onLoadingClose();
      ErrorHandler.onError(error);
    }
  };

  const handleInventoryChange = (e) => {
    setInventoryId(e.target.id);
  };

  const handleOnClickDuration = (e) => {
    setOnClickDuration(!onClickDuration);
  };

  return (
    <div className='adminSec'>
      <AdminSideBar />
      <div className='commonSec'>
        <div className='container'>
          <div className='row'>
            <h3>Orders</h3>
            <div className='tableSec'>
              <div className='orders-info-cont'>
                <div className='orders-info-duration-cont'>
                  <button
                    onClick={handleOnClickDuration}
                    style={{ border: 'none', background: 'transparent' }}
                    className='d-flex align-items-center'>
                    <CiCalendarDate size={20} strokeWidth={1} />
                    <span className='ms-1'>{displayDuration(duration)}</span>
                  </button>
                  {onClickDuration && (
                    <div className='orders-info-duration'>
                      <div className='form-check'>
                        <input
                          className='form-check-input'
                          type='radio'
                          name='date-range'
                          id='1'
                          checked={duration === '1'}
                          onClick={onSubmitDuration}
                          onChange={handleDateRange}
                        />
                        <label
                          className='form-check-label'
                          htmlFor='flexRadioDefault1'>
                          Today
                          <small className='d-block'>
                            Compared to yesterday upto current hour
                          </small>
                        </label>
                      </div>
                      <div className='form-check'>
                        <input
                          className='form-check-input'
                          type='radio'
                          name='date-range'
                          id='7'
                          checked={duration === '7'}
                          onClick={onSubmitDuration}
                          onChange={handleDateRange}
                        />
                        <label
                          className='form-check-label'
                          htmlFor='flexRadioDefault2'>
                          Last 7 Days
                          <small className='d-block'>
                            Compared to previous 7 days
                          </small>
                        </label>
                      </div>
                      <div className='form-check'>
                        <input
                          className='form-check-input'
                          type='radio'
                          name='date-range'
                          id='30'
                          checked={duration === '30'}
                          onClick={onSubmitDuration}
                          onChange={handleDateRange}
                        />
                        <label
                          className='form-check-label'
                          htmlFor='flexRadioDefault2'>
                          Last 30 Days
                          <small className='d-block'>
                            Compared to previous 30 days
                          </small>
                        </label>
                      </div>
                    </div>
                  )}
                </div>
                <hr className='v1' />
                <div className=''>
                  <span style={{ borderBottom: '2px dotted #dee2e6' }}>
                    Total orders
                  </span>
                  <div className=''>{statisticsData.TotalOrders}</div>
                </div>
                <hr className='v1' />
                <div className=''>
                  <span style={{ borderBottom: '2px dotted grey' }}>
                    Ordered items over time
                  </span>
                  <div className=''>{statisticsData.TotalItems}</div>
                </div>
                <hr className='v1' />
                <div className=''>
                  <span style={{ borderBottom: '2px dotted grey' }}>
                    Returns
                  </span>
                  <div className=''>{statisticsData.ReturnItems}</div>
                </div>
                <hr className='v1' />
                <div className=''>
                  <span style={{ borderBottom: '2px dotted grey' }}>
                    Fulfilled orders over time
                  </span>
                  <div className=''>{statisticsData.FullFilOrders}</div>
                </div>
                <hr className='v1' />
                <div className=''>
                  <span style={{ borderBottom: '2px dotted grey' }}>
                    Delivered orders over time
                  </span>
                  <div className=''>{statisticsData.deliveryOrders}</div>
                </div>
              </div>
              <div className='tableInfo'>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th className='fixed-side' scope='col'>
                        Order
                      </th>
                      <th scope='col'>Date</th>
                      <th scope='col'>Customer</th>
                      <th scope='col'>Channel</th>
                      <th scope='col'>Total</th>
                      <th scope='col'>Payment Status</th>
                      <th scope='col'>Fulfillment Status</th>
                      <th scope='col'>Items</th>
                      <th scope='col'>Delivery Method</th>
                      <th scope='col'>Order status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((eachOrder, i) => (
                      <tr key={i} className='order'>
                        <th
                          onClick={() =>
                            handleCustOrder(eachOrder.azst_orders_id)
                          }
                          className='fixed-side'>
                          {eachOrder.azst_orders_id}
                        </th>
                        <td>{date(eachOrder.azst_orders_created_on)}</td>
                        <td>{eachOrder.customer_name}</td>
                        <td>Online store</td>
                        <td>{eachOrder.azst_orders_total}</td>
                        <td>
                          {eachOrder.azst_orders_financial_status
                            ? 'Paid'
                            : 'Payment pending'}
                        </td>
                        <td>
                          {eachOrder.azst_orders_fulfillment_status
                            ? 'Fullfilled'
                            : 'Unfulfilled'}
                        </td>
                        <td>{eachOrder.items}</td>
                        <td>{eachOrder.azst_order_delivery_method}</td>
                        <td>
                          <div>
                            {eachOrder.azst_orders_status === 1 ? (
                              eachOrder.azst_orders_confirm_status === 0 ? (
                                <span className='d-flex'>
                                  <button
                                    type='button'
                                    data-bs-toggle='modal'
                                    data-bs-target='#inventoryPopup'
                                    style={{
                                      border: 'none',
                                      backgroundColor: 'transparent',
                                    }}>
                                    <FcApprove size={40} />
                                  </button>{' '}
                                  <FcDisapprove
                                    size={40}
                                    onClick={(e) =>
                                      handleOrderConfirmation(
                                        e,
                                        eachOrder.azst_orders_id,
                                        2,
                                        'cancel'
                                      )
                                    }
                                  />
                                </span>
                              ) : eachOrder.azst_orders_confirm_status === 1 ? (
                                <span
                                  style={{
                                    backgroundColor: '#8ccd8c',
                                    padding: '4px 8px',
                                    borderRadius: '8px',
                                    color: '#444343',
                                  }}>
                                  Approved
                                </span>
                              ) : (
                                <span
                                  style={{
                                    backgroundColor: '#eb4556',
                                    padding: '4px 8px',
                                    borderRadius: '8px',
                                    color: '#fff',
                                  }}>
                                  Rejected
                                </span>
                              )
                            ) : (
                              <span
                                style={{
                                  backgroundColor: '#eb4556',
                                  padding: '4px 8px',
                                  borderRadius: '8px',
                                  color: '#fff',
                                }}>
                                Cancelled
                              </span>
                            )}
                          </div>
                          <div
                            className='modal fade'
                            id='inventoryPopup'
                            tabIndex='-1'
                            aria-labelledby='exampleModalLabel'
                            aria-hidden='true'>
                            <div className='modal-dialog'>
                              <div className='modal-content'>
                                <div className='modal-header'>
                                  <h1
                                    className='modal-title fs-5'
                                    id='exampleModalLabel'>
                                    Choose the Inventory
                                  </h1>
                                  <button
                                    type='button'
                                    className='btn-close'
                                    data-bs-dismiss='modal'
                                    aria-label='Close'></button>
                                </div>
                                <div className='modal-body'>
                                  {inventory.map((each, i) => (
                                    <div className='form-check' key={i}>
                                      <input
                                        className='form-check-input'
                                        type='radio'
                                        name='inventory'
                                        id={each.inventory_id}
                                        // checked={inventory === "chintal"}
                                        onChange={handleInventoryChange}
                                      />
                                      <label
                                        className='form-check-label'
                                        htmlFor='chintal'>
                                        {each.inventory_name}
                                      </label>
                                    </div>
                                  ))}
                                </div>
                                <div className='modal-footer'>
                                  <button
                                    type='button'
                                    className='btn btn-secondary'
                                    data-bs-dismiss='modal'>
                                    Close
                                  </button>
                                  <button
                                    type='button'
                                    className='btn btn-primary'
                                    data-bs-dismiss='modal'
                                    onClick={(e) =>
                                      handleOrderConfirmation(
                                        e,
                                        eachOrder.azst_orders_id,
                                        1,
                                        'submit'
                                      )
                                    }>
                                    Save changes
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersListing;
