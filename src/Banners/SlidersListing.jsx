/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import Cookies from "js-cookie";
import AdminSideBar from "../Pages/AdminSideBar";
import swalHandle from "../Pages/ErrorHandler";
import BannersForm from "./BannersForm";

const SlidersListing = () => {
  const baseUrl = process.env.REACT_APP_API_URL;
  let token = Cookies.get(process.env.REACT_APP_ADMIN_JWT_TOKEN);

  const [sliders, setSliders] = useState([]);

  const sliderDetails = async () => {
    try {
      const url = `${baseUrl}/banners`;
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      swalHandle.onLoading();
      const response = await axios.get(url, { headers });
      Swal.close();
      setSliders(response.data);
    } catch (error) {
      swalHandle.onError(error);
    }
  };

  useEffect(() => {
    sliderDetails();
  }, [token, baseUrl]);

  return (
    <div className="adminSec">
      <AdminSideBar />
      <div className="commonSec">
        <BannersForm
          sliders={sliders}
          mainTitle={"List of Slider Banners"}
          linkTitle={"Slider"}
          sliderDetails={sliderDetails}
        />
      </div>
    </div>
  );
};

export default SlidersListing;
