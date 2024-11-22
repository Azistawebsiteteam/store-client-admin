import React, { useCallback, useEffect, useState } from "react";
import AdminSideBar from "../Pages/AdminSideBar";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import "../Pages/Admin.css";
import ErrorHandler from "../Pages/ErrorHandler";
import { MdEdit, MdDelete } from "react-icons/md";
import moment from "moment";

const Discounts = () => {
  const [discounts, setDiscount] = useState([]);

  const navigate = useNavigate();
  const baseUrl = process.env.REACT_APP_API_URL;
  const jwtToken = Cookies.get(process.env.REACT_APP_ADMIN_JWT_TOKEN);

  const getDiscount = useCallback(async () => {
    try {
      const url = `${baseUrl}/discount`;
      const headers = {
        Authorization: `Bearer ${jwtToken}`,
      };
      ErrorHandler.onLoading();
      const response = await axios.get(url, { headers });
      ErrorHandler.onLoadingClose();
      if (response.status === 200) {
        setDiscount(response.data);
      }
    } catch (error) {
      ErrorHandler.onLoadingClose();
      ErrorHandler.onError(error);
    }
  }, [baseUrl, jwtToken]);

  useEffect(() => {
    getDiscount();
  }, [getDiscount]);

  const deleteDiscount = async (id) => {
    try {
      const url = `${baseUrl}/discount`;
      const headers = {
        Authorization: `Bearer ${jwtToken}`,
      };
      const formData = new FormData();
      formData.append("discountId", id);
      ErrorHandler.onLoading();
      await axios.patch(url, formData, { headers });
      ErrorHandler.onLoadingClose();
      getDiscount();
    } catch (error) {
      ErrorHandler.onLoadingClose();
      ErrorHandler.onError(error);
    }
  };

  return (
    <div className="adminSec">
      <AdminSideBar />
      <div className="commonSec">
        <div className="container">
          <div className="row">
            <div className="col-sm-12">
              <div className="col-sm-12">
                <div className="d-flex justify-content-between">
                  <h4>List of Discounts</h4>
                  <Link to="/discount/create" className="infoBtn">
                    Create Discount
                  </Link>
                </div>
              </div>
              <div className="col-sm-12">
                <div className="tableCont">
                  <table
                    className="table table-hover"
                    style={{ minWidth: "1000px" }}
                  >
                    <thead>
                      <tr>
                        <th scope="col">S.No</th>
                        <th scope="col">Title</th>
                        <th scope="col">Discount Code</th>

                        <th scope="col">Method</th>
                        <th scope="col">Type</th>
                        <th scope="col">Created On</th>
                        <th scope="col">Status</th>
                        <th scope="col"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {discounts.map((each, i) => (
                        <tr key={i}>
                          <th scope="row">{i + 1}</th>
                          <td>{each.title}</td>
                          <td>{each.code}</td>

                          <td>{each.method}</td>
                          <td>{each.scope}</td>
                          <td>
                            {moment(each.created_on).format("DD MMM, YYYY")}
                          </td>
                          <td>{each.status}</td>
                          <td>
                            <MdEdit
                              style={{ cursor: "pointer" }}
                              onClick={() => {
                                navigate(`/discounts-edit/${each.dsc_id}`);
                              }}
                            />
                            <MdDelete
                              style={{ cursor: "pointer", marginLeft: "4px" }}
                              onClick={() => deleteDiscount(each.dsc_id)}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Discounts;
