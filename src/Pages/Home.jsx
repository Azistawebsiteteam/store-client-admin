import React from "react";
import AdminSideBar from "./AdminSideBar";

const Home = () => {
  return (
    <div className="adminSec">
      <AdminSideBar />
      <div className="commonSec">
        <div className="container">
          <div className="row">
            <div className="m-5 pt-5">
              <p>well come to Home page Admin</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
