import React from "react";
import axios from "axios";
import BrandForm from "./BrandForm";
import AdminSideBar from "./AdminSideBar";
import { useState } from "react";
import Cookies from "js-cookie";
import swalErr from "./ErrorHandler";

const CreateBrand = () => {
  const [brandImg, setBrandImg] = useState();
  const [brandName, setBrandName] = useState("");

  const baseUrl = process.env.REACT_APP_API_URL;
  const tokenKey = process.env.REACT_APP_ADMIN_JWT_TOKEN;
  const token = Cookies.get(tokenKey);

  const saveBrandBtn = async () => {
    try {
      const url = `${baseUrl}/brands/add`;
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      swalErr.onLoading();
      const formdata = new FormData();

      formdata.append("brandLogo", brandImg);
      formdata.append("brandName", brandName);
      await axios.post(url, formdata, { headers });
      swalErr.onLoadingClose();
      swalErr.onSuccess();
    } catch (error) {
      console.log(error);
      swalErr.onLoadingClose();
      swalErr.onError(error);
    }
  };

  return (
    <div className="adminSec">
      <AdminSideBar />
      <div className="commonSec">
        <div className="addProductSection">
          <div className="container">
            <div className="row">
              <BrandForm
                brandImg={brandImg}
                setBrandImg={setBrandImg}
                brandName={brandName}
                setBrandName={setBrandName}
              />
              <div className="col-12">
                <button className="saveBtn" onClick={saveBrandBtn}>
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateBrand;
