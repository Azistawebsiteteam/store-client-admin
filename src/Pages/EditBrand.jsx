import React from "react";
import axios from "axios";
import AdminSideBar from "./AdminSideBar";
import BrandForm from "./BrandForm";
import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import swalHandle from "./ErrorHandler";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";

const EditBrand = () => {
  const [brandImg, setBrandImg] = useState();
  const [brandName, setBrandName] = useState("");
  const [description, setDescription] = useState("");

  const baseUrl = process.env.REACT_APP_API_URL;
  const tokenKey = process.env.REACT_APP_ADMIN_JWT_TOKEN;
  const token = Cookies.get(tokenKey);

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const apiCallback = async () => {
      try {
        const brandsUrl = `${baseUrl}/brands`;
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        swalHandle.onLoading();

        const brand = await axios.post(brandsUrl, { brandId: id }, { headers });
        if (brand.status === 200) {
          Swal.close();
          const { azst_brand_name, azst_brand_logo, azst_brand_description } =
            brand.data;
          setBrandName(azst_brand_name);
          setBrandImg(azst_brand_logo);
          setDescription(azst_brand_description);
        }
      } catch (error) {
        Swal.close();
        swalHandle.onError();
      }
    };
    apiCallback();
  }, [baseUrl, id, token]);

  const saveBrand = async () => {
    try {
      const url = `${baseUrl}/brands`;
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const formData = new FormData();
      formData.append("brandId", id);
      formData.append("brandName", brandName);
      formData.append("brandLogo", brandImg);
      formData.append("description", description);

      swalHandle.onLoading();
      const response = await axios.put(url, formData, { headers });
      if (response.status === 200) {
        Swal.close();
        navigate("/brands");
      }
    } catch (error) {
      swalHandle.onError(error);
      Swal.close();
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
                <h4>Edit Brand</h4>
                <div className="bgStyle">
                  <BrandForm
                    brandImg={brandImg}
                    setBrandImg={setBrandImg}
                    brandName={brandName}
                    setBrandName={setBrandName}
                    description={description}
                    setDescription={setDescription}
                  />
                </div>
              </div>
              <div className="col-12">
                <button className="saveBtn" onClick={saveBrand}>
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

export default EditBrand;
