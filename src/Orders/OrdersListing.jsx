/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useLocation, useNavigate } from 'react-router-dom';
import AdminSideBar from '../Pages/AdminSideBar';
import errorHandle from '../Pages/ErrorHandler';
import moment from 'moment';
import { CiCalendarDate } from 'react-icons/ci';
import { RxCheckCircled } from 'react-icons/rx';
import { RxCrossCircled } from 'react-icons/rx';
import './index.css';
import ErrorHandler from '../Pages/ErrorHandler';
import Pagination from '../Components/Pagination';
import Swal from 'sweetalert2';

const OrdersListing = () => {
  const [orders, setOrders] = useState([]);
  const [duration, setDuration] = useState('1');
  const [statisticsData, setStatisticsData] = useState({});
  const [onClickDuration, setOnClickDuration] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [filteredOrdersList, setFilteredOrdersList] = useState([]);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const customerId = searchParams.get('customer_id');
  const navigate = useNavigate();

  const baseUrl = `${process.env.REACT_APP_API_URL}/orders/admin`;
  const jwtToken = Cookies.get(process.env.REACT_APP_ADMIN_JWT_TOKEN);

  const logsPerPage = 10;

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
      const ordersResponse = response.data;
      setOrders(ordersResponse);
      setTotalOrders(ordersResponse.length);
    } catch (error) {
      errorHandle.onLoadingClose();
      errorHandle.onError(error);
    }
  }, [baseUrl, jwtToken, customerId]);

  useEffect(() => {
    getOrders();
  }, [getOrders]);

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

  const handleOnClickDuration = (e) => {
    setOnClickDuration(!onClickDuration);
  };

  const getStatusStyle = (backgroundColor, textColor = '#fff') => ({
    backgroundColor,
    padding: '4px 8px',
    borderRadius: '8px',
    color: textColor,
  });

  // Delivery status view
  const deliveryStatus = (status) => {
    const statuses = {
      0: { text: 'Shipped', style: getStatusStyle('#60def7') },
      1: {
        text: 'Out for Delivery',
        style: getStatusStyle('#1ba8fa'),
      },
      2: { text: 'Delivered', style: getStatusStyle('#0783f0') },
    };
    return statuses[status] ? (
      <span style={statuses[status].style}>{statuses[status].text}</span>
    ) : null;
  };

  // Confirmation status view
  const confirmStatus = (status, delivery) => {
    const statuses = {
      0: { text: 'Confirm Pending', style: getStatusStyle('#8c8c8b') },
      1: deliveryStatus(delivery),
      2: { text: 'Rejected', style: getStatusStyle('#eb4556') },
    };
    const statusView = statuses[status];
    return statusView?.text ? (
      <span style={statusView.style}>{statusView.text}</span>
    ) : (
      statusView
    );
  };

  // Order status view
  const getOrderStatusView = (order) => {
    const statuses = {
      0: { text: 'Cancelled', style: getStatusStyle('#eb4556') },
      1: confirmStatus(
        order.azst_orders_confirm_status,
        order.azst_orders_delivery_status
      ),
    };
    const statusView = statuses[order.azst_orders_status];
    return statusView?.text ? (
      <span style={statusView.style}>{statusView.text}</span>
    ) : (
      statusView
    );
  };

  return (
    <div className='adminSec'>
      <AdminSideBar />
      <div className='commonSec'>
        <div className='container'>
          <div className='row'>
            <h4>Orders</h4>
            <div className='middleSec'>
              {filteredOrdersList.length ? (
                <div className='tableSec'>
                  <div className='orders-info-cont'>
                    <div className='orders-info-duration-cont'>
                      <button
                        onClick={handleOnClickDuration}
                        style={{ border: 'none', background: 'transparent' }}
                        className='d-flex align-items-center'>
                        <CiCalendarDate size={20} strokeWidth={1} />
                        <span className='ms-1'>
                          {displayDuration(duration)}
                        </span>
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
                  <div className='tableCont'>
                    <table className='table table-hover'>
                      <thead>
                        <tr className='tableHeader'>
                          <th
                            className='sticky-column'
                            scope='col'
                            style={{ width: '10%' }}>
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
                        {filteredOrdersList.map((eachOrder, i) => (
                          <tr
                            key={i}
                            className='order'
                            onClick={() =>
                              handleCustOrder(eachOrder.azst_orders_id)
                            }>
                            <th className='sticky-column text-nowrap'>
                              {eachOrder.azst_orders_id}
                            </th>
                            <td className='text-nowrap'>
                              {date(eachOrder.azst_orders_created_on)}
                            </td>
                            <td className='text-nowrap'>
                              {eachOrder.customer_name}
                            </td>
                            <td className='text-nowrap'>Online store</td>
                            <td className='text-nowrap'>
                              {eachOrder.azst_orders_total}
                            </td>
                            <td className='text-nowrap'>
                              {eachOrder.azst_orders_financial_status === '1'
                                ? 'Paid'
                                : 'Payment pending'}
                            </td>
                            <td className='text-nowrap'>
                              {eachOrder.azst_orders_fulfillment_status === '1'
                                ? 'Fullfilled'
                                : 'Unfulfilled'}
                            </td>
                            <td className='text-nowrap'>{eachOrder.items}</td>
                            <td className='text-nowrap'>
                              {eachOrder.azst_orderinfo_shippingtype}
                            </td>
                            <td
                              style={{ width: '10%' }}
                              className='text-nowrap'>
                              {getOrderStatusView(eachOrder)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <p>No Products in the Inventory</p>
              )}
            </div>
            <Pagination
              logsPerPage={logsPerPage}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalItems={totalOrders}
              listOfItems={orders}
              setFilteredItemsList={setFilteredOrdersList}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersListing;
