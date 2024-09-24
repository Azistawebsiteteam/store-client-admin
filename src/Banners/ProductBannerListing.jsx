import React, { useCallback, useEffect, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import Cookies from "js-cookie";
import AdminSideBar from "../Pages/AdminSideBar";
import swalHandle from "../Pages/ErrorHandler";
import BannersForm from "./BannersForm";

const ProductBannerListing = () => {
  const baseUrl = process.env.REACT_APP_API_URL;
  const adminToken = process.env.REACT_APP_ADMIN_JWT_TOKEN;
  let token = Cookies.get(adminToken);

  const [banners, setBanners] = useState([]);

  const sliderDetails = useCallback(
    () => async () => {
      try {
        const url = `${baseUrl}/banners/product/all`;
        const headers = {
          Authorization: `Bearer ${token}`,
        };
        swalHandle.onLoading();
        const response = await axios.get(url, { headers });
        Swal.close();
        setBanners(response.data);
      } catch (error) {
        swalHandle.onError(error);
      }
    },
    [baseUrl, token]
  );

  useEffect(() => {
    sliderDetails();
  }, [token, baseUrl, sliderDetails]);

  return (
    <div className="adminSec">
      <AdminSideBar />
      <div className="commonSec">
        <BannersForm
          sliders={banners}
          mainTitle={"List of Product Banners"}
          linkTitle={"Product banner"}
          sliderDetails={sliderDetails}
        />
      </div>
    </div>
  );
};

export default ProductBannerListing;
