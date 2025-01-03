import React from "react";
import axios from "axios";
import SliderForm from "./SliderForm";
import { useState } from "react";
import swalErr from "../Pages/ErrorHandler";
import Cookies from "js-cookie";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ErrorHandler from "../Pages/ErrorHandler";
import BackBtn from "./../Components/BackBtn";
import AdminSideBar from "../Pages/AdminSideBar";
import { handleValidationError } from "./Validation";

const EditSlider = () => {
  const [bannerDetails, setBannerDetails] = useState({
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

  const baseUrl = `${process.env.REACT_APP_API_URL}/banners`;
  const token = Cookies.get(process.env.REACT_APP_ADMIN_JWT_TOKEN);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const getBannerDetails = async () => {
      try {
        const url = baseUrl;
        const headers = {
          Authorization: `Bearer ${token}`,
        };
        const response = await axios.post(url, { bannerId: id }, { headers });
        if (response.status === 200) {
          const banner = response.data.banner_details;

          setBannerDetails({
            bannerType: banner.azst_banner_type,
            title: banner.azst_banner_title,
            description: banner.azst_banner_description,
            startTime: banner.azst_start_time,
            endTime: banner.azst_end_time,
            altText: banner.azst_alt_text,
            backgroundUrl: banner.azst_background_url,
            isDefault: banner.is_default,
          });

          setimgValue({
            webBanner: banner.azst_web_image,
            mobileBanner: banner.azst_mobile_image,
          });
        }
      } catch (error) {
        ErrorHandler.onError(error);
      }
    };
    getBannerDetails();
  }, [id, baseUrl, token]);

  const onUpdateSliderDetails = async () => {
    const validationErrorMsg = handleValidationError(bannerDetails, imgValue);
    if (Object.keys(validationErrorMsg).length > 0) {
      window.scrollTo(0, 0);
      setValidationErrors(validationErrorMsg);
      return;
    }
    try {
      const url = `${baseUrl}/update`;
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-type": "multipart/form-data",
      };

      const formdata = new FormData();
      swalErr.onLoading();
      formdata.append("bannerId", id);
      formdata.append("bannerType", bannerDetails.bannerType);
      formdata.append("title", bannerDetails.title);
      formdata.append("description", bannerDetails.description);
      formdata.append("altText", bannerDetails.altText);
      formdata.append("backgroundUrl", bannerDetails.backgroundUrl);
      formdata.append("startTime", bannerDetails.startTime);
      formdata.append("endTime", bannerDetails.endTime);
      formdata.append("isDefault", bannerDetails.isDefault);
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
              <h5>Edit Slider</h5>
            </div>
            <SliderForm
              setImgDetails={setBannerDetails}
              imgDetails={bannerDetails}
              setimgValue={setimgValue}
              imgValue={imgValue}
              validationErrors={validationErrors}
              setValidationErrors={setValidationErrors}
            />
            <div className="col-sm-12">
              <div className="btnCont">
                <button className="adminBtn" onClick={onUpdateSliderDetails}>
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditSlider;
