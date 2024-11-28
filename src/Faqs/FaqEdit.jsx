import React, { useCallback, useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import AdminSideBar from "../Pages/AdminSideBar";
import swalHandle from "../Pages/ErrorHandler";
import FaqForm from "./FaqForm";
import { useParams, useNavigate } from "react-router-dom";
import BackBtn from "../Components/BackBtn";
import { handleValidationErrors } from "./Validations";

const FaqEdit = () => {
  const [inputValues, setInputValues] = useState({
    type: "",
    question: "",
    answer: "",
    productId: 0,
  });
  const [validationErrors, setValidationErrors] = useState({});
  const { id } = useParams();

  const baseUrl = `${process.env.REACT_APP_API_URL}/faqs`;
  const token = Cookies.get(process.env.REACT_APP_ADMIN_JWT_TOKEN);
  const getFaqDetials = useCallback(async () => {
    const url = `${baseUrl}/faq`;
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const response = await axios.post(url, { id }, { headers });
    const blog = response.data;
    setInputValues({
      type: blog.azst_faq_type,
      question: blog.azst_faq_question,
      answer: blog.azst_faq_ans,
      productId: blog.azst_faq_product_id ?? 0,
    });
  }, [baseUrl, token, id]);

  useEffect(() => {
    getFaqDetials();
  }, [getFaqDetials]);

  const navigate = useNavigate();

  const onUpdateFaq = async (e) => {
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
      await axios.put(url, { id, ...inputValues }, { headers });
      swalHandle.onLoadingClose();
      swalHandle.onSuccess();
      navigate(-1);
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
          <BackBtn /> <h4>Update FAQ</h4>
        </div>
        <FaqForm
          inputValues={inputValues}
          setInputValues={setInputValues}
          validationErrors={validationErrors}
          setValidationErrors={setValidationErrors}
        />
        <button className="adminBtn" onClick={onUpdateFaq}>
          Update
        </button>
      </div>

      <hr style={{ color: "grey" }} />
    </div>
  );
};

export default FaqEdit;
