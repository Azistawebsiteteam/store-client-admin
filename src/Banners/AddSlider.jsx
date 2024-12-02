import axios from "axios";
import React, { useState } from "react";
import Cookies from "js-cookie";
import swalErr from "../Pages/ErrorHandler";
import SliderForm from "./SliderForm";
import { useNavigate } from "react-router-dom";
import BackBtn from "./../Components/BackBtn";
import AdminSideBar from "../Pages/AdminSideBar";
import { handleValidationError } from "./Validation";

const AddSlider = () => {
  const [imgDetails, setImgDetails] = useState({
    bannerType: "",
    title: "",
    description: "",
    startTime: "",
    endTime: "",
    altText: "",
    backgroundUrl: "",
    isDefault: 1,
  });

  const [imgValue, setimgValue] = useState({
    webBanner: "",
    mobileBanner: "",
  });
  const [validationErrors, setValidationErrors] = useState({});

  const baseUrl = process.env.REACT_APP_API_URL;
  const token = Cookies.get(process.env.REACT_APP_ADMIN_JWT_TOKEN);
  const navigate = useNavigate();

  const onSubmitSliderDetails = async () => {
    const validationErrorMsg = handleValidationError(imgDetails, imgValue);
    if (Object.keys(validationErrorMsg).length > 0) {
      window.scrollTo(0, 0);
      setValidationErrors(validationErrorMsg);
      return;
    }
    try {
      const url = `${baseUrl}/banners/add`;
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-type": "multipart/form-data",
      };
      swalErr.onLoading();
      const formdata = new FormData();
      formdata.append("bannerType", imgDetails.bannerType);
      formdata.append("title", imgDetails.title);
      formdata.append("description", imgDetails.description);
      formdata.append("altText", imgDetails.altText);
      formdata.append("backgroundUrl", imgDetails.backgroundUrl);
      formdata.append("startTime", imgDetails.startTime);
      formdata.append("endTime", imgDetails.endTime);
      formdata.append("isDefault", imgDetails.isDefault);
      formdata.append("webBanner", imgValue.webBanner);
      formdata.append("mobileBanner", imgValue.mobileBanner);

      const response = await axios.post(url, formdata, { headers });
      if (response.status === 200) {
        navigate(-1);
      }
      swalErr.onLoadingClose();
      swalErr.onSuccess();
    } catch (error) {
      swalErr.onLoadingClose();
      swalErr.onError(error);
    }
  };

  return (
    <div className="adminSec">
      <AdminSideBar />
      <div className="commonSec">
        <div className="container">
          <div className="row">
            <div className="d-flex align-items-center mb-3">
              <BackBtn />
              <h5>Add Slider</h5>
            </div>
            <SliderForm
              setImgDetails={setImgDetails}
              imgDetails={imgDetails}
              setimgValue={setimgValue}
              imgValue={imgValue}
              validationErrors={validationErrors}
              setValidationErrors={setValidationErrors}
            />
            <div className="col-sm-12">
              <div className="btnCont">
                <button className="adminBtn" onClick={onSubmitSliderDetails}>
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

export default AddSlider;
