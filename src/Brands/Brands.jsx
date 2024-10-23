/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import AdminSideBar from "../Pages/AdminSideBar";
import Cookies from "js-cookie";
import axios from "axios";
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

  return (
    <div className="adminSec">
      <AdminSideBar />
      <div className="commonSec">
        <div className="addProductSection">
          <div className="container">
            <div className="row">
              <div className="col-12 mt-2 mb-2 d-flex justify-content-between">
                <h4>Brands</h4>
                <Link to="/brands/create" className="btn bg-dark text-light">
                  Create brands
                </Link>
              </div>
              <div className="tableCont">
                <table
                  className="table table-hover"
                  style={{ minWidth: "1000px" }}
                >
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Brand Logo</th>
                      <th scope="col">Brand Name</th>
                      <th scope="col">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {brands.map((each, i) => (
                      <tr className="item" key={i}>
                        <td>{i + 1}</td>
                        <td style={{ width: "20%" }}>
                          <img
                            className="brandThumbnail"
                            src={each.azst_brand_logo}
                            alt={each.azst_brand_id}
                          />
                        </td>
                        <td>{each.azst_brand_name}</td>
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
