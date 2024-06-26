import React from "react";
import axios from "axios";
import SliderForm from "./SliderForm";
import { useState } from "react";
import swalErr from "../Pages/ErrorHandler";
import Cookies from "js-cookie";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

const EditSlider = () => {
  const [bannerDetails, setBannerDetails] = useState({
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

  const baseUrl = `${process.env.REACT_APP_API_URL}/banners`;
  const token = Cookies.get(process.env.REACT_APP_ADMIN_JWT_TOKEN);
  const { id } = useParams();

  useEffect(() => {
    const getBannerDetails = async () => {
      try {
        const url = baseUrl;
        const headers = {
          Authorization: `Bearer ${token}`,
        };
        const response = await axios.post(url, { bannerId: id }, { headers });
        console.log(response);
        if (response.status === 200) {
          const banner = response.data.banner_details;

          setBannerDetails({
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
        console.log(error);
      }
    };
    getBannerDetails();
  }, [id, baseUrl, token]);

  const onUpdateSliderDetails = async () => {
    try {
      if (
        bannerDetails.isDefault === "0" &&
        (bannerDetails.startTime === "" || bannerDetails.endTime === "")
      ) {
        return alert("please select date");
      }
      swalErr.onLoading();
      const url = `${baseUrl}/update`;
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-type": "multipart/form-data",
      };

      const formdata = new FormData();

      formdata.append("bannerId", id);
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
        setImgDetails={setBannerDetails}
        imgDetails={bannerDetails}
        setimgValue={setimgValue}
        imgValue={imgValue}
      />
      <div className="col-sm-12">
        <div className="btnCont">
          <button className="adminBtn" onClick={onUpdateSliderDetails}>
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditSlider;
