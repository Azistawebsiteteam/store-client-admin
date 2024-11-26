import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BrandForm from "./BrandForm";
import AdminSideBar from "../Pages/AdminSideBar";
import Cookies from "js-cookie";
import swalErr from "../Pages/ErrorHandler";
import BackBtn from "../Components/BackBtn";
import { handleBrandsValidations } from "./BrandsValidation";

const CreateBrand = () => {
  const [brandImg, setBrandImg] = useState("");
  const [brandName, setBrandName] = useState("");
  const [description, setDescription] = useState("");
  const [brandsValidationErrors, setBrandsValidationErrors] = useState({});

  const baseUrl = process.env.REACT_APP_API_URL;
  const tokenKey = process.env.REACT_APP_ADMIN_JWT_TOKEN;
  const token = Cookies.get(tokenKey);
  const navigate = useNavigate();

  const brandsData = {
    brandImg,
    brandName,
    description,
  };

  const saveBrandBtn = async () => {
    const brandsValidationErrors = handleBrandsValidations(brandsData);
    console.log(brandsValidationErrors);
    if (Object.keys(brandsValidationErrors).length > 0) {
      window.scrollTo(0, 0);
      setBrandsValidationErrors(brandsValidationErrors);
      return;
    }
    try {
      const url = `${baseUrl}/brands/add`;
      const headers = { Authorization: `Bearer ${token}` };
      swalErr.onLoading();

      const formdata = new FormData();
      formdata.append("brandLogo", brandImg);
      formdata.append("brandName", brandName);
      formdata.append("description", description);
      await axios.post(url, formdata, { headers });
      swalErr.onLoadingClose();
      swalErr.onSuccess();
      navigate("/brands");
    } catch (error) {
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
              <div className="col-12">
                <h4 className="d-flex align-items-center mb-3">
                  <BackBtn />
                  Create Brand
                </h4>
                <div className="bgStyle">
                  <BrandForm
                    description={description}
                    setDescription={setDescription}
                    brandImg={brandImg}
                    setBrandImg={setBrandImg}
                    brandName={brandName}
                    setBrandName={setBrandName}
                    brandsValidationErrors={brandsValidationErrors}
                    setBrandsValidationErrors={setBrandsValidationErrors}
                  />
                </div>
              </div>
              <div className="col-12 d-flex justify-content-end mt-3 mb-4">
                <button className="adminBtn" onClick={saveBrandBtn}>
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
