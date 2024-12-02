import React, { useEffect, useCallback, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";

import { MdDelete, MdModeEditOutline } from "react-icons/md";
import { Link } from "react-router-dom";

import swalHandle from "../Pages/ErrorHandler";
import AdminSideBar from "../Pages/AdminSideBar";

const BlogsListing = () => {
  const [blogsList, setBlogsList] = useState([]);

  const baseUrl = `${process.env.REACT_APP_API_URL}/blogs`;
  const token = Cookies.get(process.env.REACT_APP_ADMIN_JWT_TOKEN);

  const getBlogs = useCallback(async () => {
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      swalHandle.onLoading();
      const response = await axios.get(baseUrl, { headers });
      setBlogsList(response.data);
      swalHandle.onLoadingClose();
    } catch (error) {
      swalHandle.onLoadingClose();
      swalHandle.onError(error.message);
    }
  }, [baseUrl, token, setBlogsList]); // Add all dependencies

  useEffect(() => {
    getBlogs();
  }, [getBlogs]);

  const deleteBlog = async (id) => {
    try {
      const url = `${baseUrl}/${id}`;
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      swalHandle.onLoading();
      await axios.patch(url, {}, { headers });
      swalHandle.onLoadingClose();

      swalHandle.onSuccess();
      setTimeout(() => {
        getBlogs();
      }, 2000);
    } catch (error) {
      swalHandle.onLoadingClose();
      swalHandle.onError(error.message);
    }
  };

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <div className="adminSec">
      <div>
        <AdminSideBar />
      </div>
      <div className="commonSec">
        <div className="col-12">
          <div className="commonTopSec">
            <h4>Blogs</h4>
            <Link to="/blogs/create" className="adminBtn">
              Create Blog
            </Link>
          </div>
        </div>
        <div className="tableCont">
          <table className="table custom-table table-hover">
            <thead>
              <tr className="tableHeader">
                <th style={{ width: "8%" }} scope="col">
                  S.No
                </th>
                <th style={{ width: "20%" }} scope="col">
                  Title
                </th>
                <th scope="col" style={{ width: "25%" }}>
                  Description
                </th>
                <th scope="col" style={{ width: "20%" }}>
                  Image
                </th>
                <th scope="col" style={{ width: "15%" }}>
                  Blog Type
                </th>
                <th style={{ width: "10%" }} scope="col">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {blogsList?.map((each, i) => (
                <tr className="item" key={i}>
                  <td>{i + 1}</td>
                  <td style={{ whiteSpace: "normal" }}>
                    {truncateText(each.azst_blg_title, 80)}
                  </td>
                  <td style={{ whiteSpace: "normal" }}>
                    {truncateText(each.azst_blg_description, 100)}
                  </td>
                  <td>
                    <img
                      className="blogThumbnailImg"
                      src={each.azst_blg_img}
                      alt="blog"
                    />
                  </td>
                  <td>{each.azst_blg_type}</td>
                  <td>
                    <MdDelete
                      className="icons"
                      onClick={() => deleteBlog(each.azst_blg_id)}
                    />{" "}
                    <Link to={`/blogs/edit/${each.azst_blg_id}`}>
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

export default BlogsListing;
