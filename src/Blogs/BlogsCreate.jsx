import React, { useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import swalHandle from "../Pages/ErrorHandler";
import AdminSideBar from "../Pages/AdminSideBar";
import BlogForm from "./BlogForm";
import BackBtn from "../Components/BackBtn";

const BlogsCreate = () => {
  const [inputVlaues, setInputValues] = useState({
    title: "",
    description: "",
    content: "",
    product: "",
    type: "",
    blogImg: "",
    blogThumbnailImg: "",
  });

  const navigate = useNavigate();
  const baseUrl = `${process.env.REACT_APP_API_URL}/blogs`;

  const token = Cookies.get(process.env.REACT_APP_ADMIN_JWT_TOKEN);

  const handleSubmit = async (e) => {
    try {
      const url = baseUrl;

      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const formdata = new FormData();
      formdata.append("blogImg", inputVlaues.blogImg);
      formdata.append("blogThumbnailImg", inputVlaues.blogThumbnailImg);
      formdata.append("type", inputVlaues.type);
      formdata.append("title", inputVlaues.title);
      formdata.append("description", inputVlaues.description);
      formdata.append("content", inputVlaues.content);
      formdata.append("product", inputVlaues.product);
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
          inputVlaues={inputVlaues}
          setInputValues={setInputValues}
          handleSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default BlogsCreate;
