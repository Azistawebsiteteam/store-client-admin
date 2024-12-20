/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import AdminSideBar from "../Pages/AdminSideBar";
import Cookies from "js-cookie";
import axios from "axios";
import { downloadExcel } from "react-export-table-to-excel";
import { MdDelete } from "react-icons/md";
import { MdModeEditOutline } from "react-icons/md";
import { Link } from "react-router-dom";
import swalHandle from "../Pages/ErrorHandler";
import "../Pages/Admin.css";

const Brands = () => {
  const [brands, setBrands] = useState([]);
  const baseUrl = process.env.REACT_APP_API_URL;
  const jwtToken = process.env.REACT_APP_ADMIN_JWT_TOKEN;
  const token = Cookies.get(jwtToken);

  const apiCallback = async () => {
    try {
      const brandsUrl = `${baseUrl}/brands/data`;
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      swalHandle.onLoading();

      const brandsList = await axios.get(brandsUrl, headers);

      if (brandsList.status === 200) {
        swalHandle.onLoadingClose();
        setBrands(brandsList.data);
      }
    } catch (error) {
      swalHandle.onLoadingClose();
      swalHandle.onError();
    }
  };

  useEffect(() => {
    apiCallback();
  }, []);

  const deleteBrand = async (index) => {
    try {
      const url = `${baseUrl}/brands`;
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const body = {
        brandId: index,
      };
      swalHandle.onLoading();
      const response = await axios.patch(url, body, { headers });
      if (response.status === 200) {
        swalHandle.onSuccess();
        swalHandle.onLoadingClose();
      }
      apiCallback();
    } catch (error) {
      swalHandle.onLoadingClose();
      swalHandle.onError();
    }
  };

  const header = ["Brand Name", "Number of Products"];
  function handleDownloadExcel() {
    downloadExcel({
      fileName: "brands",
      sheet: "brands-list",
      tablePayload: {
        header,
        body: brands.map((b) => ({
          azst_category_name: b.azst_brand_name,
          no_products: b.no_products,
        })),
      },
    });
  }

  return (
    <div className="adminSec">
      <AdminSideBar />
      <div className="commonSec">
        <div className="addProductSection">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="commonTopSec">
                  <h4>Brands</h4>
                  <button className="exportBtn" onClick={handleDownloadExcel}>
                    Export
                  </button>
                  <Link to="/brands/create" className="infoBtn">
                    Create brands
                  </Link>
                </div>
              </div>
              <div className="tableCont" style={{ maxHeight: "76vh" }}>
                <table
                  className="table table-hover"
                  style={{ minWidth: "1000px" }}
                >
                  <thead>
                    <tr className="tableHeader">
                      <th scope="col" style={{ width: "8%" }}>
                        #
                      </th>
                      <th scope="col" style={{ width: "20%" }}>
                        Brand Logo
                      </th>
                      <th scope="col" style={{ width: "40%" }}>
                        Brand Name
                      </th>
                      <th scope="col" style={{ width: "20%" }}>
                        No. Products
                      </th>
                      <th scope="col" style={{ width: "12%" }}>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {brands.map((each, i) => (
                      <tr className="item" key={i}>
                        <td>{i + 1}</td>
                        <td>
                          <img
                            className="brandThumbnail"
                            src={each.azst_brand_logo}
                            alt={each.azst_brand_id}
                          />
                        </td>
                        <td>{each.azst_brand_name}</td>
                        <td>{each.no_products}</td>
                        <td>
                          <MdDelete
                            className="icons"
                            onClick={() => deleteBrand(each.azst_brands_id)}
                          />{" "}
                          <Link to={`/edit-brand/${each.azst_brands_id}`}>
                            <MdModeEditOutline className="icons" />
                          </Link>
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
  );
};

export default Brands;
