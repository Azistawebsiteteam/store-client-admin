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
import { downloadExcel } from 'react-export-table-to-excel';

const OrdersListing = () => {
  const [orders, setOrders] = useState([]);
  const [duration, setDuration] = useState('1');
  const [statisticsData, setStatisticsData] = useState({});
  const [onClickDuration, setOnClickDuration] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [filteredOrdersList, setFilteredOrdersList] = useState([]);
  const [checkAllOrders, setCheckAllOrders] = useState(false);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const customerId = searchParams.get('customer_id');
  const navigate = useNavigate();

  const baseUrl = `${process.env.REACT_APP_API_URL}/orders/admin`;
  const jwtToken = Cookies.get(process.env.REACT_APP_ADMIN_JWT_TOKEN);

  const logsPerPage = 7;

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

  // useEffect(() => {
  //   setCheckAllOrders(false);
  // }, [currentPage]);

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
      2: { text: 'Delivered', style: getStatusStyle('#24b00e') },
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

  const onChangeCheckAllOrdrs = (e) => {
    setCheckAllOrders(e.target.checked);
    const updateChecks = orders.map((item) => ({
      ...item,
      isChecked: e.target.checked,
    }));
    setFilteredOrdersList(updateChecks);
    setOrders(updateChecks);
  };

  const onCheckOrder = (e, id) => {
    e.stopPropagation();
    const updateChecks = orders.map((item) => {
      if (item.azst_orders_id === id) {
        return {
          ...item,
          isChecked: e.target.checked,
        };
      } else {
        return item;
      }
    });
    setFilteredOrdersList(updateChecks);
    setOrders(updateChecks);
  };

  function handleDownloadExcel() {
    const header = [
      'Order Id',
      'Date',
      'Customer',
      'channel',
      'total',
      'payment status',
      'fullfilment status',
      'items',
      'Delivery Method',
      'Order Status',
    ];

    const diveryText = (status) => {
      const statuses = {
        0: 'Shipped',
        1: 'Out for Delivery',
        2: 'Delivered',
      };
      return statuses[status];
    };

    const confirmStatusText = (status, delivery) => {
      const statuses = {
        0: 'Confirm Pending',
        1: diveryText(delivery),
        2: 'Rejected',
      };
      return statuses[status];
    };

    const getOrderStatusText = (order) => {
      const statuses = {
        0: 'Cancelled',
        1: confirmStatusText(
          order.azst_orders_confirm_status,
          order.azst_orders_delivery_status
        ),
      };
      return statuses[order.azst_orders_status];
    };

    const ischecked = filteredOrdersList.find((o) => o.isChecked);

    let downloadOrders = orders;

    if (ischecked) {
      downloadOrders = orders.filter((o) => o.isChecked); // Only include checked items
    }

    const body = downloadOrders.map((o) => ({
      azst_orders_id: o.azst_orders_id,
      Date: date(o.azst_orders_created_on),
      Customer: o.customer_name,
      channel: o.azst_orders_source,
      total: o.azst_orders_total,
      'payment status': o.azst_orders_financial_status,
      'fullfilment status': o.azst_orders_fulfillment_status,
      items: o.items,
      'Delivery Method': o.azst_orderinfo_shippingtype,
      'Order Status': getOrderStatusText(o),
    }));

    downloadExcel({
      fileName: 'orders',
      sheet: 'orders-list',
      tablePayload: {
        header,
        body,
      },
    });
  }

  return (
    <div className='adminSec'>
      <AdminSideBar />
      <div className='commonSec'>
        <div className='container'>
          <div className='row'>
            <div className='commonTopSec'>
              <h4>Orders</h4>
              <button className='exportBtn' onClick={handleDownloadExcel}>
                Export
              </button>
            </div>

            <div className='middleSec'>
              {filteredOrdersList.length ? (
                <div className='tableSec'>
                  <div className='orders-info-cont'>
                    <div className='orders-info-duration-cont ordersTab'>
                      <button
                        onClick={handleOnClickDuration}
                        style={{
                          border: 'none',
                          background: 'transparent',
                          cursor: 'pointer',
                        }}
                        className='d-flex align-items-center'>
                        <CiCalendarDate size={20} strokeWidth={1} />
                        <label
                          className='ms-2 pb-0'
                          style={{ cursor: 'pointer' }}>
                          {displayDuration(duration)}
                        </label>
                      </button>
                      {onClickDuration && (
                        <div className='orders-info-duration'>
                          <div className='form-check'>
                            <input
                              className='form-check-input filterInput'
                              type='radio'
                              name='date-range'
                              id='1'
                              checked={duration === '1'}
                              onClick={onSubmitDuration}
                              onChange={handleDateRange}
                            />
                            <label
                              className='form-check-label pb-0'
                              htmlFor='flexRadioDefault1'>
                              Today
                              <small className='d-block mt-1'>
                                Compared to yesterday upto current hour
                              </small>
                            </label>
                          </div>
                          <div className='form-check mt-2'>
                            <input
                              className='form-check-input filterInput'
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
                              <small className='d-block mt-1'>
                                Compared to previous 7 days
                              </small>
                            </label>
                          </div>
                          <div className='form-check mt-2'>
                            <input
                              className='form-check-input filterInput'
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
                              <small className='d-block mt-1'>
                                Compared to previous 30 days
                              </small>
                            </label>
                          </div>
                        </div>
                      )}
                    </div>
                    <hr className='v1' />
                    <div className='ordersTab'>
                      <label
                        className='pb-0'
                        style={{ borderBottom: '2px dotted #dee2e6' }}>
                        Total orders
                      </label>
                      <div className='mt-2'>
                        <label>{statisticsData.TotalOrders}</label>
                      </div>
                    </div>
                    <hr className='v1' />
                    <div className='ordersTab'>
                      <label
                        className='pb-0'
                        style={{ borderBottom: '2px dotted grey' }}>
                        Ordered items over time
                      </label>
                      <div className='mt-2'>
                        <label>{statisticsData.TotalItems}</label>
                      </div>
                    </div>
                    <hr className='v1' />
                    <div className='ordersTab'>
                      <label
                        className='pb-0'
                        style={{ borderBottom: '2px dotted grey' }}>
                        Returns
                      </label>
                      <div className='mt-2'>
                        <label>{statisticsData.ReturnItems}</label>
                      </div>
                    </div>
                    <hr className='v1' />
                    <div className='ordersTab'>
                      <label
                        className='pb-0'
                        style={{ borderBottom: '2px dotted grey' }}>
                        Fulfilled orders over time
                      </label>
                      <div className='mt-2'>
                        <label>{statisticsData.FullFilOrders}</label>
                      </div>
                    </div>
                    <hr className='v1' />
                    <div className='ordersTab'>
                      <label
                        className='pb-0'
                        style={{ borderBottom: '2px dotted grey' }}>
                        Delivered orders over time
                      </label>
                      <div className='mt-2'>
                        <label>{statisticsData.deliveryOrders}</label>
                      </div>
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
                            <input
                              className='form-check-input me-2'
                              type='checkbox'
                              checked={checkAllOrders}
                              id='flexCheckDefault'
                              onChange={onChangeCheckAllOrdrs}
                            />
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
                              <input
                                className='form-check-input me-2'
                                type='checkbox'
                                checked={eachOrder.isChecked}
                                id='flexCheckDefault'
                                onClick={(e) =>
                                  onCheckOrder(e, eachOrder.azst_orders_id)
                                }
                              />
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
                              {eachOrder.azst_orders_financial_status ===
                              '1' ? (
                                <label className='orderSecStatusBtn paidStatus'>
                                  Paid
                                </label>
                              ) : (
                                <label className='orderSecStatusBtn pendingStatus'>
                                  Payment pending
                                </label>
                              )}
                            </td>
                            <td className='text-nowrap'>
                              {eachOrder.azst_orders_fulfillment_status ===
                              '1' ? (
                                <label className='orderSecStatusBtn fulfilledStatus'>
                                  Fullfilled
                                </label>
                              ) : (
                                <label className='orderSecStatusBtn unFulfilledStatus'>
                                  Unfulfilled
                                </label>
                              )}
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
                <p>No Orders Found </p>
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
