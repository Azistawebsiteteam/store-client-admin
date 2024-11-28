import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import AdminSideBar from "../Pages/AdminSideBar";
import swalHandle from "../Pages/ErrorHandler";
import FaqForm from "./FaqForm";
import { useNavigate } from "react-router-dom";
import BackBtn from "../Components/BackBtn";
import { handleValidationErrors } from "./Validations";

const FaqCreate = () => {
  const [inputValues, setInputValues] = useState({
    type: "",
    question: "",
    answer: "",
    productId: 0,
  });
  const [validationErrors, setValidationErrors] = useState({});

  const navigate = useNavigate();
  const baseUrl = `${process.env.REACT_APP_API_URL}/faqs`;
  const token = Cookies.get(process.env.REACT_APP_ADMIN_JWT_TOKEN);

  const onSubmitFaq = async (e) => {
    const validationsMsgs = handleValidationErrors(inputValues);
    if (Object.keys(validationsMsgs).length > 0) {
      setValidationErrors(validationsMsgs);
      return;
    }
    try {
      const url = baseUrl;

      const headers = {
        Authorization: `Bearer ${token}`,
      };
      swalHandle.onLoading();
      await axios.post(url, inputValues, { headers });
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
          <BackBtn /> <h4>Create FAQ</h4>
        </div>
        <FaqForm
          inputValues={inputValues}
          setInputValues={setInputValues}
          validationErrors={validationErrors}
          setValidationErrors={setValidationErrors}
        />
        <button className="adminBtn" onClick={onSubmitFaq}>
          Save
        </button>
      </div>

      <hr style={{ color: "grey" }} />
    </div>
  );
};

export default FaqCreate;
