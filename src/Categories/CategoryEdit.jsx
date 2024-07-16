import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";
import AdminSideBar from "../Pages/AdminSideBar";
import CategoryForm from "./CategoryForm";

const CategoryEdit = () => {
  const [categoryImg, setCategoryImg] = useState();
  const [categoryData, setCategoryData] = useState({
    text: "",
    description: "",
  });

  const baseUrl = process.env.REACT_APP_API_URL;
  const token = Cookies.get(process.env.REACT_APP_ADMIN_JWT_TOKEN);
  const { id } = useParams();

  useEffect(() => {
    const fetchCategories = async () => {
      const url = `${baseUrl}/category/`;
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.post(url, { categoryId: id }, { headers });
      console.log(response, "res");
      const {
        azst_category_name,
        azst_category_img,
        azst_category_description,
      } = response.data;
      setCategoryImg(azst_category_img);
      setCategoryData({
        text: azst_category_name,
        description: azst_category_description,
      });
    };
    fetchCategories();
  }, [baseUrl, id, token]);

  const saveCategory = async () => {
    try {
      const url = `${baseUrl}/category`;
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const formdata = new FormData();
      const { text, description } = categoryData;

      formdata.append("categoryId", id);
      formdata.append("text", text);
      formdata.append("description", description);
      formdata.append("categoryImg", categoryImg);

      const response = await axios.put(url, formdata, { headers });
      console.log(response);
    } catch (error) {
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

export default CategoryEdit;
