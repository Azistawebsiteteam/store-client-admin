import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { MdDelete } from "react-icons/md";
import { MdModeEditOutline } from "react-icons/md";
import swalHandle from "../Pages/ErrorHandler";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import AdminSideBar from "../Pages/AdminSideBar";

const Categories = () => {
  const [categories, setCategories] = useState();

  const baseUrl = process.env.REACT_APP_API_URL;
  const token = Cookies.get(process.env.REACT_APP_ADMIN_JWT_TOKEN);

  const getCategories = useCallback(async () => {
    try {
      const url = `${baseUrl}/category/data`;
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.get(url, { headers });
      setCategories(response.data);
    } catch (error) {
      console.log(error);
    }
  }, [baseUrl, token]);

  useEffect(() => {
    getCategories();
  }, [getCategories]);

  const deleteBrand = async (index) => {
    try {
      const url = `${baseUrl}/category/`;
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const body = {
        categoryId: index,
      };
      swalHandle.onLoading();
      const response = await axios.patch(url, body, { headers });
      if (response.status === 200) {
        console.log(response);
        swalHandle.onSuccess();
        Swal.close();
      }
      getCategories();
    } catch (error) {
      Swal.close();
      swalHandle.onError();
      console.log(error);
    }
  };

  console.log(categories);

  return (
    <div className="adminSec">
      <div>
        <AdminSideBar />
      </div>
      <div className="commonSec">
        <div className="col-12 mt-2 mb-2 d-flex justify-content-between">
          <h4>Categories</h4>
          <Link to="/category/create">Create category</Link>
        </div>
        <div className="col-sm-12">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Category Image</th>
                <th scope="col">Category Name</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories?.map((each, i) => (
                <tr className="item" key={i}>
                  <td>{i + 1}</td>
                  <td>
                    <img
                      className="brandThumbnail"
                      src={each.azst_category_img}
                      alt={each.azst_category_name}
                    />
                  </td>
                  <td>{each.azst_category_name}</td>
                  <td>
                    <MdDelete
                      className="icons"
                      onClick={() => deleteBrand(each.azst_category_id)}
                    />{" "}
                    <Link to={`/edit-category/${each.azst_category_id}`}>
                      <MdModeEditOutline className="icons" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Categories;
