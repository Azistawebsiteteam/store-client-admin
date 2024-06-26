import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import Table from "react-bootstrap/Table";
import AdminSideBar from "../Pages/AdminSideBar";
import errorHandle from "../Pages/ErrorHandler";
import moment from "moment";
import "./index.css";

const OrdersListing = () => {
  const [orders, setOrders] = useState([]);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const customerId = searchParams.get("customer_id");
  console.log(customerId, "searchParams");
  const navigate = useNavigate();

  const baseUrl = `${process.env.REACT_APP_API_URL}/orders/admin`;
  const jwtToken = Cookies.get(process.env.REACT_APP_ADMIN_JWT_TOKEN);

  const { id } = useParams();
  console.log(id, "id");
  useEffect(() => {
    const getOrders = async () => {
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
        console.log(response, "response");
        errorHandle.onLoadingClose();
        setOrders(response.data);
      } catch (error) {
        errorHandle.onLoadingClose();
        errorHandle.onError(error);
        console.log(error);
      }
    };
    getOrders();
  }, [baseUrl, jwtToken, customerId]);

  const date = (createDate) => {
    return moment(createDate).format("D MMMM [at] h:mm a");
  };

  const handleCustOrder = (id) => {
    navigate(`/orders/${id}`);
  };

  return (
    <div className="adminSec">
      <AdminSideBar />
      <div className="commonSec">
        <div className="container">
          <div className="row">
            <h3>Orders</h3>
            <div className="tableSec">
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th className="fixed-side" scope="col">
                      Order
                    </th>
                    <th scope="col">Date</th>
                    <th scope="col">Customer</th>
                    <th scope="col">Channel</th>
                    <th scope="col">Total</th>
                    <th scope="col">Payment Status</th>
                    <th scope="col">Fulfillment Status</th>
                    <th scope="col">Items</th>
                    <th scope="col">Delivery Method</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((eachOrder, i) => (
                    <tr
                      key={i}
                      className="order"
                      onClick={() => handleCustOrder(eachOrder.azst_orders_id)}
                    >
                      <th className="fixed-side">{eachOrder.azst_orders_id}</th>
                      <td>{date(eachOrder.azst_orders_created_on)}</td>
                      <td>{eachOrder.customer_name}</td>
                      <td>Online store</td>
                      <td>{eachOrder.azst_orders_total}</td>
                      <td>
                        {eachOrder.azst_orders_financial_status
                          ? "Paid"
                          : "Payment pending"}
                      </td>
                      <td>
                        {eachOrder.azst_orders_fulfillment_status
                          ? "Fullfilled"
                          : "Unfulfilled"}
                      </td>
                      <td>{eachOrder.items}</td>
                      <td>{eachOrder.azst_order_delivery_method}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersListing;
