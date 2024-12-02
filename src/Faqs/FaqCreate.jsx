import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

import AdminSideBar from "../Pages/AdminSideBar";
import swalHandle from "../Pages/ErrorHandler";
import FaqForm from "./FaqForm";
import { useNavigate } from "react-router-dom";
import BackBtn from "../Components/BackBtn";

const FaqCreate = () => {
  const [inputVlaues, setInputValues] = useState({
    type: "",
    question: "",
    answer: "",
    productId: 0,
  });
  const navigate = useNavigate();
  const baseUrl = `${process.env.REACT_APP_API_URL}/faqs`;
  const token = Cookies.get(process.env.REACT_APP_ADMIN_JWT_TOKEN);

  const onSubmitFaq = async (e) => {
    try {
      const url = baseUrl;

      const headers = {
        Authorization: `Bearer ${token}`,
      };
      swalHandle.onLoading();
      await axios.post(url, inputVlaues, { headers });
      swalHandle.onLoadingClose();
      swalHandle.onSuccess();
      setTimeout(() => {
        navigate("/faqs");
      }, 2000);
    } catch (error) {
      swalHandle.onLoadingClose();
      swalHandle.onError(error);
    }
  };

  return (
    <div className="adminSec">
      <div>
        <AdminSideBar />
      </div>
      <div className="commonSec">
        <div className="d-flex align-items-center mb-3">
          <BackBtn /> <h4>Create Faq</h4>
        </div>
        <FaqForm inputVlaues={inputVlaues} setInputValues={setInputValues} />
        <button className="adminBtn" onClick={onSubmitFaq}>
          Save
        </button>
      </div>

      <hr style={{ color: "grey" }} />
    </div>
  );
};

export default FaqCreate;
