import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BrandForm from "./BrandForm";
import AdminSideBar from "./AdminSideBar";
import Cookies from "js-cookie";
import swalErr from "./ErrorHandler";

const CreateBrand = () => {
  const [brandImg, setBrandImg] = useState();
  const [brandName, setBrandName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const baseUrl = process.env.REACT_APP_API_URL;
  const tokenKey = process.env.REACT_APP_ADMIN_JWT_TOKEN;
  const token = Cookies.get(tokenKey);
  const navigate = useNavigate();

  const saveBrandBtn = async () => {
    if (!brandName || !description || !brandImg) {
      swalErr.onError("All fields are required.");
      return;
    }

    try {
      setLoading(true);
      const url = `${baseUrl}/brands/add`;
      const headers = { Authorization: `Bearer ${token}` };
      swalErr.onLoading();

      const formdata = new FormData();
      formdata.append("brandLogo", brandImg);
      formdata.append("brandName", brandName);
      formdata.append("brandDescription", description);

      await axios.post(url, formdata, { headers });
      swalErr.onLoadingClose();
      swalErr.onSuccess();
      navigate("/brands"); // Redirect to brand list
    } catch (error) {
      swalErr.onLoadingClose();
      swalErr.onError(error.response?.data?.message || "An error occurred.");
    } finally {
      setLoading(false);
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
                <h4>Create Brand</h4>
                <div className="bgStyle">
                  <BrandForm
                    description={description}
                    setDescription={setDescription}
                    brandImg={brandImg}
                    setBrandImg={setBrandImg}
                    brandName={brandName}
                    setBrandName={setBrandName}
                  />
                </div>
              </div>
              <div className="col-12">
                <button
                  className="saveBtn"
                  onClick={saveBrandBtn}
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save"}
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
