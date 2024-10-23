import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate, useParams } from "react-router-dom";

import AdminSideBar from "../Pages/AdminSideBar";
import BlogForm from "./BlogForm";
import swalHandle from "../Pages/ErrorHandler";
import BackBtn from "../Components/BackBtn";

const BlogEdit = () => {
  const [inputVlaues, setInputValues] = useState({
    title: "",
    description: "",
    content: "",
    product: "",
    type: "",
    blogImg: "",
    blogThumbnailImg: "",
  });
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
    try {
      const url = baseUrl;

      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const formdata = new FormData();
      formdata.append("id", id);
      formdata.append("blogImg", inputVlaues.blogImg);
      formdata.append("blogThumbnailImg", inputVlaues.blogThumbnailImg);
      formdata.append("type", inputVlaues.type);
      formdata.append("title", inputVlaues.title);
      formdata.append("description", inputVlaues.description);
      formdata.append("content", inputVlaues.content);
      formdata.append("product", inputVlaues.product);
      swalHandle.onLoading();
      await axios.put(url, formdata, { headers });
      swalHandle.onLoadingClose();
      swalHandle.onSuccess();
      setTimeout(() => {
        navigate("/blogs");
      }, 2000);
    } catch (error) {
      console.log(error);
      swalHandle.onLoadingClose();
      swalHandle.onError(error);
    }
  };

  return (
    <div className="adminSec">
      <AdminSideBar />
      <div className="commonSec">
        <div className="d-flex align-items-center">
          <BackBtn /> <h3>Update Blog</h3>
        </div>
        <BlogForm
          buttonText={"Update"}
          inputVlaues={inputVlaues}
          setInputValues={setInputValues}
          handleSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default BlogEdit;
