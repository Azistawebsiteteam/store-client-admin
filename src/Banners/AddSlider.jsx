import axios from "axios";
import React, { useState } from "react";
import Cookies from "js-cookie";
import swalErr from "../Pages/ErrorHandler";
import SliderForm from "./SliderForm";

const AddSlider = () => {
  const [imgDetails, setImgDetails] = useState({
    bannerType: "",
    title: "",
    description: "",
    startTime: "",
    endTime: "",
    altText: "",
    backgroundUrl: "",
    isDefault: "1",
  });

  const [imgValue, setimgValue] = useState({
    webBanner: "",
    mobileBanner: "",
  });

  const baseUrl = process.env.REACT_APP_API_URL;
  const token = Cookies.get(process.env.REACT_APP_ADMIN_JWT_TOKEN);

  const onSubmitSliderDetails = async () => {
    try {
      if (
        imgDetails.isDefault === "0" &&
        (imgDetails.startTime === "" || imgDetails.endTime === "")
      ) {
        return alert("please select date");
      }
      swalErr.onLoading();
      const url = `${baseUrl}/banners/add`;
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-type": "multipart/form-data",
      };

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
      console.log(response);
      swalErr.onLoadingClose();
      swalErr.onSuccess();
    } catch (error) {
      console.log(error);
      swalErr.onLoadingClose();
      swalErr.onError(error);
    }
  };

  return (
    <div>
      <SliderForm
        setImgDetails={setImgDetails}
        imgDetails={imgDetails}
        setimgValue={setimgValue}
        imgValue={imgValue}
      />
      <div className="col-sm-12">
        <div className="btnCont">
          <button className="adminBtn" onClick={onSubmitSliderDetails}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddSlider;
