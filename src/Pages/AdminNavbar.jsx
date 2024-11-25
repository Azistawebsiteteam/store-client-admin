// import axios from 'axios'
import Cookies from "js-cookie";
import React from "react";
import { HiMiniUserCircle } from "react-icons/hi2";
import { HiMiniBars3 } from "react-icons/hi2";
import { ProductState } from "../Context/ProductContext";
// import { IoMdSearch } from "react-icons/io";

import { Link } from "react-router-dom";
import DropDown from "./DropDown";

import "./Admin.css";

const AdminNavbar = () => {
  const adminData = JSON.parse(localStorage.getItem("adminDetails"));
  const profilePic = adminData?.azst_admin_details_profile_photo || "";
  const adminToken = process.env.REACT_APP_ADMIN_JWT_TOKEN;
  let token = Cookies.get(adminToken);

  const { toggleSidebar, setToggleSidebar } = ProductState();

  const handleCloseSidebar = () => {
    setToggleSidebar(!toggleSidebar);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-dark fixed-top adminNavbar">
      <div className="container-fluid adminNavbarInnerSection">
        <div className="navBars">
          <HiMiniBars3 fill="white" size={30} onClick={handleCloseSidebar} />
        </div>
        <div className="navIcon">
          <Link
            className="navbar-brand m-auto mr-md-auto text-light navText d-flex align-items-center"
            to="/"
          >
            <img className="navlogo" src="../../../azista.png" alt="img" />{" "}
            <h4 className="mb-0">Azista</h4>
          </Link>
        </div>
        {/* <form className="form input_group searchInputCont">
          <span>
            <IoMdSearch className="searchIcon" />
          </span>
          <input type="search" className="searchInput" placeholder="Search.." />
        </form> */}
        <ul className="navbar-nav d-flex align-items-center">
          <li className="nav-item d-flex justify-content-center align-items-center">
            {profilePic && token ? (
              <img src={profilePic} className="userProfile" alt="userProfile" />
            ) : (
              <HiMiniUserCircle className="nav_social_icon" />
            )}
          </li>
          {token ? (
            <li>
              <DropDown />
            </li>
          ) : (
            <li>
              <Link className="adminLoginBtn" to="/adminLoginPage">
                Login
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default AdminNavbar;
