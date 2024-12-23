import React, { useCallback, useEffect, useRef, useState } from "react";
import AdminSideBar from "../Pages/AdminSideBar";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import { downloadExcel } from "react-export-table-to-excel";
import "../Pages/Admin.css";
import ErrorHandler from "../Pages/ErrorHandler";
import { MdEdit, MdDelete } from "react-icons/md";
import moment from "moment";

const Discounts = () => {
  const [discounts, setDiscount] = useState([]);

  const navigate = useNavigate();
  const baseUrl = process.env.REACT_APP_API_URL;
  const jwtToken = Cookies.get(process.env.REACT_APP_ADMIN_JWT_TOKEN);

  const tableRef = useRef(null);

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

  const header = [
    "S.No",
    "Title",
    "Discount Code",
    "Method",
    "Type",
    "Created On",
    "Status",
  ];

  function handleDownloadExcel() {
    downloadExcel({
      fileName: "discounts",
      sheet: "discount-list",
      tablePayload: {
        header,
        body: discounts.map((d, i) => ({
          sno: i + 1,
          title: d.title,
          code: d.code,
          method: d.method,
          scope: d.scope,
          created_on: moment(d.created_on).format("DD MMM, YYYY"),
          status: d.status === 1 ? "Active" : "In Active",
        })),
      },
    });
  }

  return (
    <div className="adminSec">
      <AdminSideBar />
      <div className="commonSec">
        <div className="container">
          <div className="row">
            <div className="col-sm-12">
              <div className="col-sm-12">
                <div className="commonTopSec">
                  <h4>List of Discounts</h4>
                  <button className="exportBtn" onClick={handleDownloadExcel}>
                    Export
                  </button>
                  <Link to="/discount/create" className="infoBtn">
                    Create Discount
                  </Link>
                </div>
              </div>
              <div className="col-sm-12">
                {discounts?.length > 0 ? (
                  <div className="tableCont">
                    <table
                      ref={tableRef}
                      className="table table-hover"
                      style={{ minWidth: "1000px" }}
                    >
                      <thead>
                        <tr>
                          {header.map((name, i) => (
                            <th key={i} scope="col">
                              {name}
                            </th>
                          ))}
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
                            <td>
                              {each.status === 1 ? "Active" : "In Active"}
                            </td>
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
                ) : (
                  <div className="noContentSec">
                    <h6>No Discounts Available</h6>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Discounts;
