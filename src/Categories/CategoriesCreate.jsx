import React from "react";
import axios from "axios";
import { useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { v4 } from "uuid";
import swalHandle from "../Pages/ErrorHandler";
import CategoryForm from "./CategoryForm";
import AdminSideBar from "../Pages/AdminSideBar";
import BackBtn from "../Components/BackBtn";
import { handleCategoriesValidations } from "./CategoryValidation";

const CategoriesCreate = () => {
  const [categoryImg, setCategoryImg] = useState("");
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
  const [categoriesErrorMsg, setCategoriesErrorMsg] = useState({});

  const baseUrl = process.env.REACT_APP_API_URL;
  const tokenKey = process.env.REACT_APP_ADMIN_JWT_TOKEN;
  const token = Cookies.get(tokenKey);
  const navigate = useNavigate();

  const categoriesData = {
    categoryData,
    subCategories,
    categoryImg,
  };

  const saveCategory = async () => {
    const categoriesValidationsErrors =
      handleCategoriesValidations(categoriesData);
    console.log(categoriesValidationsErrors);
    if (Object.keys(categoriesValidationsErrors).length > 0) {
      window.scrollTo(0, 0);
      setCategoriesErrorMsg(categoriesValidationsErrors);
      return;
    }
    try {
      const url = `${baseUrl}/category/add`;
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
      // eslint-disable-next-line no-unused-vars
      const response = await axios.post(url, formdata, { headers });
      swalHandle.onSuccess();
      swalHandle.onLoadingClose();
      navigate(-1);
    } catch (error) {
      swalHandle.onLoadingClose();
      swalHandle.onError(error);
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
                <h4 className="d-flex align-items-center mb-3">
                  <BackBtn />
                  Create Category
                </h4>
                <CategoryForm
                  categoryData={categoryData}
                  categoryImg={categoryImg}
                  setCategoryData={setCategoryData}
                  setCategoryImg={setCategoryImg}
                  subCategories={subCategories}
                  setSubCategories={setSubCategories}
                  categoriesErrorMsg={categoriesErrorMsg}
                  setCategoriesErrorMsg={setCategoriesErrorMsg}
                />
              </div>
              <div className="col-12 d-flex justify-content-end mt-3 mb-4">
                <button className="adminBtn" onClick={saveCategory}>
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
