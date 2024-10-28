/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useLocation, useNavigate } from "react-router-dom";
import AdminSideBar from "../Pages/AdminSideBar";
import errorHandle from "../Pages/ErrorHandler";
import moment from "moment";
import { CiCalendarDate } from "react-icons/ci";
import { RxCheckCircled } from "react-icons/rx";
import { RxCrossCircled } from "react-icons/rx";
import "./index.css";
import ErrorHandler from "../Pages/ErrorHandler";
import Pagination from "../Components/Pagination";
import Swal from "sweetalert2";

const OrdersListing = () => {
  const [orders, setOrders] = useState([]);
  const [duration, setDuration] = useState("1");
  const [statisticsData, setStatisticsData] = useState({});
  const [onClickDuration, setOnClickDuration] = useState(false);
  const [inventory, setInventory] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [filteredOrdersList, setFilteredOrdersList] = useState([]);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const customerId = searchParams.get("customer_id");
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

  useEffect(() => {
    const getInventoryLocations = async () => {
      try {
        const url = `${process.env.REACT_APP_API_URL}/inventory/locations`;

        const headers = {
          Authorization: `Bearer ${jwtToken}`,
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
  }, [baseUrl, jwtToken]);

  const displayDuration = (duration) => {
    switch (duration) {
      case "1":
        return "Today";
      case "7":
        return "Last 7 Days";
      case "30":
        return "Last 30 Days";
      default:
        return "Today";
    }
  };

  const date = (createDate) => {
    return moment(createDate).format("D MMMM [at] h:mm a");
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

  const handleOrderConfirmation = async (e, id, orderStatus, type, invId) => {
    try {
      if (type !== "cancel" && invId === undefined) {
        alert("Please select the Inventory");
        return;
      }

      ErrorHandler.onLoading();

      const payload = {
        orderId: id,
        orderStatus,
        inventoryId: invId,
      }; // Exclude `type` here
      const response = await axios.post(`${baseUrl}/confirm`, payload, {
        headers: { Authorization: `Bearer ${jwtToken}` },
      });

      ErrorHandler.onLoadingClose();
      const updateOrders = orders.map((ord) => {
        if (ord.azst_orders_id === id) {
          return { ...ord, azst_orders_confirm_status: orderStatus };
        }
        return ord;
      });
      setOrders(updateOrders);
    } catch (error) {
      ErrorHandler.onLoadingClose();
      ErrorHandler.onError(error);
    }
  };

  const confirmationOrderStatus = async (e, id, orderStatus, type) => {
    if (type === "submit") {
      const inputOptions = inventory.reduce((options, item) => {
        options[item.inventory_id] = item.inventory_name;
        return options;
      }, {});

      // Generate custom HTML for radio buttons
      const inputHtml = Object.keys(inputOptions)
        .map(
          (key) => `
      <label>
        <input type="radio" name="inventory" value="${key}" />
        ${inputOptions[key]}
      </label>
    `
        )
        .join("<br/>"); // Add line breaks for vertical alignment

      const { value: invId } = await Swal.fire({
        title: "Choose the Inventory",
        html: inputHtml, // Use custom HTML for the radio buttons
        focusConfirm: false,
        showCancelButton: true, // Optionally show a cancel button
        preConfirm: () => {
          // Get the selected radio button value
          const selectedRadio = document.querySelector(
            'input[name="inventory"]:checked'
          );
          if (!selectedRadio) {
            Swal.showValidationMessage("Please choose an inventory."); // Error if no selection is made
          }
          return selectedRadio ? selectedRadio.value : false; // Return selected value or false
        },
      });

      if (invId) {
        handleOrderConfirmation(e, id, orderStatus, type, invId);
      }
    } else {
      Swal.fire({
        title: "Would you like to reject the order?",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      }).then((result) => {
        if (result.isConfirmed) {
          handleOrderConfirmation(e, id, orderStatus, type, "");
        } else if (result.isDenied) {
          Swal.fire("Changes are not saved", "", "info");
        }
      });
    }
  };

  const handleOnClickDuration = (e) => {
    setOnClickDuration(!onClickDuration);
  };

  return (
    <div className="adminSec">
      <AdminSideBar />
      <div className="commonSec">
        <div className="container">
          <div className="row">
            <h4>Orders</h4>
            <div className="middleSec">
              {filteredOrdersList.length ? (
                <div className="tableSec">
                  <div className="orders-info-cont">
                    <div className="orders-info-duration-cont">
                      <button
                        onClick={handleOnClickDuration}
                        style={{ border: "none", background: "transparent" }}
                        className="d-flex align-items-center"
                      >
                        <CiCalendarDate size={20} strokeWidth={1} />
                        <span className="ms-1">
                          {displayDuration(duration)}
                        </span>
                      </button>
                      {onClickDuration && (
                        <div className="orders-info-duration">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="date-range"
                              id="1"
                              checked={duration === "1"}
                              onClick={onSubmitDuration}
                              onChange={handleDateRange}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="flexRadioDefault1"
                            >
                              Today
                              <small className="d-block">
                                Compared to yesterday upto current hour
                              </small>
                            </label>
                          </div>
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="date-range"
                              id="7"
                              checked={duration === "7"}
                              onClick={onSubmitDuration}
                              onChange={handleDateRange}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="flexRadioDefault2"
                            >
                              Last 7 Days
                              <small className="d-block">
                                Compared to previous 7 days
                              </small>
                            </label>
                          </div>
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="date-range"
                              id="30"
                              checked={duration === "30"}
                              onClick={onSubmitDuration}
                              onChange={handleDateRange}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="flexRadioDefault2"
                            >
                              Last 30 Days
                              <small className="d-block">
                                Compared to previous 30 days
                              </small>
                            </label>
                          </div>
                        </div>
                      )}
                    </div>
                    <hr className="v1" />
                    <div className="">
                      <span style={{ borderBottom: "2px dotted #dee2e6" }}>
                        Total orders
                      </span>
                      <div className="">{statisticsData.TotalOrders}</div>
                    </div>
                    <hr className="v1" />
                    <div className="">
                      <span style={{ borderBottom: "2px dotted grey" }}>
                        Ordered items over time
                      </span>
                      <div className="">{statisticsData.TotalItems}</div>
                    </div>
                    <hr className="v1" />
                    <div className="">
                      <span style={{ borderBottom: "2px dotted grey" }}>
                        Returns
                      </span>
                      <div className="">{statisticsData.ReturnItems}</div>
                    </div>
                    <hr className="v1" />
                    <div className="">
                      <span style={{ borderBottom: "2px dotted grey" }}>
                        Fulfilled orders over time
                      </span>
                      <div className="">{statisticsData.FullFilOrders}</div>
                    </div>
                    <hr className="v1" />
                    <div className="">
                      <span style={{ borderBottom: "2px dotted grey" }}>
                        Delivered orders over time
                      </span>
                      <div className="">{statisticsData.deliveryOrders}</div>
                    </div>
                  </div>
                  <div className="tableCont">
                    <table
                      className="table table-hover"
                      style={{ minWidth: "1200px" }}
                    >
                      <thead>
                        <tr className="tableHeader">
                          <th className="sticky-column" scope="col">
                            Order
                          </th>
                          <th scope="col">Date</th>
                          <th scope="col">Customer</th>
                          <th scope="col">Channel</th>
                          <th scope="col">Total</th>
                          <th scope="col">Payment Status</th>
                          <th className="text-nowrap" scope="col">
                            Fulfillment Status
                          </th>
                          <th scope="col">Items</th>
                          <th scope="col">Delivery Method</th>
                          <th scope="col" style={{ width: "10%" }}>
                            Order status
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredOrdersList.map((eachOrder, i) => (
                          <tr key={i} className="order">
                            <th
                              onClick={() =>
                                handleCustOrder(eachOrder.azst_orders_id)
                              }
                              className="sticky-column text-nowrap"
                            >
                              {eachOrder.azst_orders_id}
                            </th>
                            <td className="text-nowrap">
                              {date(eachOrder.azst_orders_created_on)}
                            </td>
                            <td className="text-nowrap">
                              {eachOrder.customer_name}
                            </td>
                            <td className="text-nowrap">Online store</td>
                            <td className="text-nowrap">
                              {eachOrder.azst_orders_total}
                            </td>
                            <td className="text-nowrap">
                              {eachOrder.azst_orders_financial_status === "1"
                                ? "Paid"
                                : "Payment pending"}
                            </td>
                            <td className="text-nowrap">
                              {eachOrder.azst_orders_fulfillment_status === "1"
                                ? "Fullfilled"
                                : "Unfulfilled"}
                            </td>
                            <td className="text-nowrap">{eachOrder.items}</td>
                            <td className="text-nowrap">
                              {eachOrder.azst_order_delivery_method}
                            </td>
                            <td
                              style={{ width: "10%" }}
                              className="text-nowrap"
                            >
                              <div>
                                {eachOrder.azst_orders_status === 1 ? (
                                  eachOrder.azst_orders_confirm_status === 0 ? (
                                    <span className="d-flex">
                                      <button
                                        onClick={(e) =>
                                          confirmationOrderStatus(
                                            e,
                                            eachOrder.azst_orders_id,
                                            1,
                                            "submit"
                                          )
                                        }
                                        className="me-1"
                                        style={{
                                          border: "none",
                                          backgroundColor: "transparent",
                                        }}
                                      >
                                        <RxCheckCircled
                                          color="green"
                                          size={25}
                                        />
                                      </button>

                                      <button
                                        onClick={(e) =>
                                          confirmationOrderStatus(
                                            e,
                                            eachOrder.azst_orders_id,
                                            2,
                                            "cancel"
                                          )
                                        }
                                        style={{
                                          border: "none",
                                          backgroundColor: "transparent",
                                        }}
                                      >
                                        <RxCrossCircled size={25} color="red" />
                                      </button>
                                    </span>
                                  ) : eachOrder.azst_orders_confirm_status ===
                                    1 ? (
                                    <span
                                      style={{
                                        backgroundColor: "#8ccd8c",
                                        padding: "4px 8px",
                                        borderRadius: "8px",
                                        color: "#444343",
                                      }}
                                    >
                                      Approved
                                    </span>
                                  ) : (
                                    <span
                                      style={{
                                        backgroundColor: "#eb4556",
                                        padding: "4px 8px",
                                        borderRadius: "8px",
                                        color: "#fff",
                                      }}
                                    >
                                      Rejected
                                    </span>
                                  )
                                ) : (
                                  <span
                                    style={{
                                      backgroundColor: "#eb4556",
                                      padding: "4px 8px",
                                      borderRadius: "8px",
                                      color: "#fff",
                                    }}
                                  >
                                    Cancelled
                                  </span>
                                )}
                              </div>
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

// <button
// id="popupButton"
// type="button"
// data-bs-toggle="modal"
// data-bs-target="#inventoryPopup"
// style={{
//   display: "none",
// }}
// ></button>
// <div
// className="modal fade"
// id="inventoryPopup"
// tabIndex="-1"
// aria-labelledby="exampleModalLabel"
// aria-hidden="true"
// >
// <div className="modal-dialog">
//   <div className="modal-content">
//     <div className="modal-header">
//       <h1
//         className="modal-title fs-5"
//         id="exampleModalLabel"
//       >
//         Choose the Inventory
//       </h1>
//       <button
//         type="button"
//         className="btn-close"
//         data-bs-dismiss="modal"
//         aria-label="Close"
//       ></button>
//     </div>
//     <div className="modal-body">
//       {inventory.map((each, i) => (
//         <div className="form-check" key={i}>
//           <input
//             className="form-check-input"
//             type="radio"
//             name="inventory"
//             id={each.inventory_id}
//             // checked={
//             //   selectedInventoryId === "1235555"
//             // }
//             value={selectedOrder.inventoryId}
//             onChange={handleInventoryChange}
//           />
//           <label
//             className="form-check-label"
//             htmlFor={each.inventory_id}
//           >
//             {each.inventory_name}
//           </label>
//         </div>
//       ))}
//     </div>
//     <div className="modal-footer">
//       <button
//         type="button"
//         className="btn btn-secondary"
//         data-bs-dismiss="modal"
//       >
//         Close
//       </button>
//       <button
//         type="button"
//         className="btn btn-primary"
//         data-bs-dismiss="modal"
//         onClick={saveInventory}
//       >
//         Save changes
//       </button>
//     </div>
//   </div>
// </div>
// </div>
