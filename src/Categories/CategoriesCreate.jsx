import React from "react";
import axios from "axios";
import { useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { v4 } from "uuid";
import swalHandle from "../Pages/ErrorHandler";
import CategoryForm from "./CategoryForm";
import AdminSideBar from "../Pages/AdminSideBar";

const CategoriesCreate = () => {
  const [categoryImg, setCategoryImg] = useState();
  const [categoryData, setCategoryData] = useState({
    text: "",
    description: "",
  });
  const [subCategories, setSubCategories] = useState([
    {
      id: v4(),
      subCategoryName: "",
    },
  ]);

  const baseUrl = process.env.REACT_APP_API_URL;
  const tokenKey = process.env.REACT_APP_ADMIN_JWT_TOKEN;
  const token = Cookies.get(tokenKey);
  const navigate = useNavigate();
  const saveCategory = async () => {
    try {
      const url = `http://192.168.214.253:5018/api/v1/category/add`;
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const formdata = new FormData();
      const { text, description } = categoryData;
      formdata.append("categoryName", text);
      formdata.append("description", description);
      formdata.append("categoryImg", categoryImg);
      formdata.append("subCategories", JSON.stringify(subCategories));

      swalHandle.onLoading();
      const response = await axios.post(url, formdata, { headers });
      swalHandle.onSuccess();
      swalHandle.onLoadingClose();
      navigate(-1);
      console.log(response);
    } catch (error) {
      swalHandle.onLoadingClose();
      swalHandle.onError(error);
      console.log(error);
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
                <h4>Create Category</h4>
                <CategoryForm
                  categoryData={categoryData}
                  categoryImg={categoryImg}
                  setCategoryData={setCategoryData}
                  setCategoryImg={setCategoryImg}
                  subCategories={subCategories}
                  setSubCategories={setSubCategories}
                />
              </div>
              <div className="col-12">
                <button className="saveBtn" onClick={saveCategory}>
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

export default CategoriesCreate;
