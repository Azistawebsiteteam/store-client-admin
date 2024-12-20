import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { v4 } from "uuid";
import Cookies from "js-cookie";
import AdminSideBar from "../Pages/AdminSideBar";
import CategoryForm from "./CategoryForm";
import ErrorHandler from "../Pages/ErrorHandler";
import BackBtn from "../Components/BackBtn";
import { handleCategoriesValidations } from "./CategoryValidation";

const CategoryEdit = () => {
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
  const [categoriesErrorMsg, setCategoriesErrorMsg] = useState({});
  const [deletedSubCats, setDeletedSubCats] = useState([]);

  const baseUrl = process.env.REACT_APP_API_URL;
  const token = Cookies.get(process.env.REACT_APP_ADMIN_JWT_TOKEN);
  const { id } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const url = `${baseUrl}/category/`;
        const headers = {
          Authorization: `Bearer ${token}`,
        };
        ErrorHandler.onLoading();
        const response = await axios.post(url, { categoryId: id }, { headers });
        ErrorHandler.onLoadingClose();
        const {
          azst_category_name,
          azst_category_img,
          azst_category_description,
          azst_subCategories = [],
        } = response.data;
        setCategoryImg(azst_category_img);
        setCategoryData({
          text: azst_category_name,
          description: azst_category_description,
        });
        const subCats = azst_subCategories
          ? azst_subCategories.map((c) => ({
              id: c.azst_sub_category_id,
              subCategoryName: c.azst_sub_category_name,
            }))
          : [];
        setSubCategories(subCats);
      } catch (error) {
        ErrorHandler.onLoadingClose();
        ErrorHandler.onError(error);
      }
    };
    fetchCategories();
  }, [baseUrl, id, token]);

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
      const url = `${baseUrl}/category`;
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const formdata = new FormData();
      const { text, description } = categoryData;

      formdata.append("categoryId", id);
      formdata.append("categoryName", text);
      formdata.append("description", description);
      formdata.append("categoryImg", categoryImg);
      formdata.append("subCategories", JSON.stringify(subCategories));
      formdata.append("deletedSubCats", JSON.stringify(deletedSubCats));

      ErrorHandler.onLoading();
      await axios.put(url, formdata, { headers });
      ErrorHandler.onLoadingClose();
      ErrorHandler.onSuccess();
      navigate(-1);
      setDeletedSubCats([]);
    } catch (error) {
      ErrorHandler.onLoadingClose();
      ErrorHandler.onError(error);
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
                  Update Category
                </h4>
                <CategoryForm
                  categoryData={categoryData}
                  categoryImg={categoryImg}
                  setCategoryData={setCategoryData}
                  setCategoryImg={setCategoryImg}
                  subCategories={subCategories}
                  setSubCategories={setSubCategories}
                  deletedSubCats={deletedSubCats}
                  setDeletedSubCats={setDeletedSubCats}
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

export default CategoryEdit;
