import React from "react";
import { Link } from "react-router-dom";
import AdminSideBar from "../Pages/AdminSideBar";

const BlogsListing = () => {
  return (
    <div className="adminSec">
      <div>
        <AdminSideBar />
      </div>
      <div className="commonSec">
        <div className="blogTopbar">
          <h3>Blogs</h3>
          <Link to="/blog/create">Create Blog</Link>
        </div>
        <div className="blogsDisplay"></div>
      </div>
    </div>
  );
};

export default BlogsListing;
