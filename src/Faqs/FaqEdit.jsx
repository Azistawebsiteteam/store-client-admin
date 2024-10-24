import React, { useCallback, useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import AdminSideBar from "../Pages/AdminSideBar";
import swalHandle from "../Pages/ErrorHandler";
import FaqForm from "./FaqForm";
import { useParams } from "react-router-dom";
import BackBtn from "../Components/BackBtn";

const FaqEdit = () => {
  const [inputVlaues, setInputValues] = useState({
    type: "",
    question: "",
    answer: "",
    productId: 0,
  });
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

  const onUpdateFaq = async (e) => {
    try {
      const url = baseUrl;
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      swalHandle.onLoading();
      await axios.put(url, { id, ...inputVlaues }, { headers });
      swalHandle.onLoadingClose();
      swalHandle.onSuccess();
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
        <div className="d-flex align-items-center">
          <BackBtn /> <h3>Update Faq</h3>
        </div>
        <FaqForm inputVlaues={inputVlaues} setInputValues={setInputValues} />
        <button className="btn btn-primary" onClick={onUpdateFaq}>
          Update
        </button>
      </div>

      <hr style={{ color: "grey" }} />
    </div>
  );
};

export default FaqEdit;
