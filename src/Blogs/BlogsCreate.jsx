import React, { useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import swalHandle from "../Pages/ErrorHandler";
import AdminSideBar from "../Pages/AdminSideBar";
import BlogForm from "./BlogForm";
import BackBtn from "../Components/BackBtn";
import { handleValidationErrors } from "./Validations";

const BlogsCreate = () => {
  const [inputValues, setInputValues] = useState({
    title: "",
    description: "",
    content: "",
    product: "",
    type: "",
    blogImg: "",
    blogThumbnailImg: "",
  });
  const [validationErrors, setValidationErrors] = useState({});

  const navigate = useNavigate();
  const baseUrl = `${process.env.REACT_APP_API_URL}/blogs`;

  const token = Cookies.get(process.env.REACT_APP_ADMIN_JWT_TOKEN);

  const handleSubmit = async (e) => {
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
      const formdata = new FormData();
      formdata.append("blogImg", inputValues.blogImg);
      formdata.append("blogThumbnailImg", inputValues.blogThumbnailImg);
      formdata.append("type", inputValues.type);
      formdata.append("title", inputValues.title);
      formdata.append("description", inputValues.description);
      formdata.append("content", inputValues.content);
      formdata.append("product", inputValues.product);
      swalHandle.onLoading();
      await axios.post(url, formdata, { headers });
      swalHandle.onLoadingClose();
      swalHandle.onSuccess();
      setTimeout(() => {
        navigate("/blogs");
      }, 2000);
    } catch (error) {
      swalHandle.onLoadingClose();
      swalHandle.onError(error);
    }
  };

  return (
    <div className="adminSec">
      <AdminSideBar />
      <div className="commonSec">
        <div className="d-flex align-items-center mb-3">
          <div className="BackArrow">
            <BackBtn />
          </div>
          <h5>Create Blog</h5>
        </div>
        <BlogForm
          buttonText={"Save"}
          inputValues={inputValues}
          setInputValues={setInputValues}
          handleSubmit={handleSubmit}
          validationErrors={validationErrors}
          setValidationErrors={setValidationErrors}
        />
      </div>
    </div>
  );
};

export default BlogsCreate;
