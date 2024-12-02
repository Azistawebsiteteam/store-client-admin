import React from "react";
import AdminSideBar from "./AdminSideBar";

const Home = () => {
  return (
    <div className="adminSec">
      <AdminSideBar />
      <div className="commonSec">
        <div className="homeSection">
          <div className="container">
            <div className="row">
              <div className="d-flex justify-content-center align-items-center">
                <h1
                  className="text-center"
                  style={{ fontSize: "3rem", fontWeight: "600" }}
                >
                  Welcome to Admin Home page
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
