import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate, useParams } from "react-router-dom";

import AdminSideBar from "../Pages/AdminSideBar";
import BlogForm from "./BlogForm";
import swalHandle from "../Pages/ErrorHandler";
import BackBtn from "../Components/BackBtn";
import { handleValidationErrors } from "./Validations";

const BlogEdit = () => {
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
  const { id } = useParams();
  const navigate = useNavigate();
  const baseUrl = `${process.env.REACT_APP_API_URL}/blogs`;

  const token = Cookies.get(process.env.REACT_APP_ADMIN_JWT_TOKEN);

  const getBlogDetails = useCallback(async () => {
    try {
      const url = `${baseUrl}/${id}`;

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      swalHandle.onLoading();
      const { data } = await axios.get(url, { headers });
      const {
        azst_blg_title,
        azst_blg_content,
        azst_blg_product,
        azst_blg_type,
        azst_blg_img,
        azst_blg_description,
        azst_blg_thumbnail_img,
      } = data;

      setInputValues({
        title: azst_blg_title,
        description: azst_blg_description,
        content: azst_blg_content,
        product: azst_blg_product,
        type: azst_blg_type,
        blogImg: azst_blg_img,
        blogThumbnailImg: azst_blg_thumbnail_img,
      });

      swalHandle.onLoadingClose();
    } catch (error) {
      swalHandle.onLoadingClose();
      swalHandle.onError(error);
    }
  }, [baseUrl, id, token]);

  useEffect(() => {
    getBlogDetails();
  }, [getBlogDetails]);

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
      formdata.append("id", id);
      formdata.append("blogImg", inputValues.blogImg);
      formdata.append("blogThumbnailImg", inputValues.blogThumbnailImg);
      formdata.append("type", inputValues.type);
      formdata.append("title", inputValues.title);
      formdata.append("description", inputValues.description);
      formdata.append("content", inputValues.content);
      formdata.append("product", inputValues.product);
      swalHandle.onLoading();
      await axios.put(url, formdata, { headers });
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
          <h5>Update Blog</h5>
        </div>
        <BlogForm
          buttonText={"Update"}
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

export default BlogEdit;
