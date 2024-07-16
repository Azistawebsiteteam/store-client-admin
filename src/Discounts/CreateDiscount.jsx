import React from "react";
import AdminSideBar from "../Pages/AdminSideBar";
import DiscountForm from "./DiscountForm";
import { useState } from "react";
import "../Pages/Admin.css";

const CreateDiscount = () => {
  const [selectedDiscount, setDiscount] = useState("Amount of products");
  const [count, setCount] = useState(0);

  const handleDiscountsTab = (e) => {
    setDiscount(e.target.value);
    setCount(count + 1);
  };

  return (
    <div className="adminSec">
      <AdminSideBar />
      <div className="commonSec">
        <div className="container">
          <div className="row">
            <div className="col-sm-12">
              <div className="mb-4">
                <h3>Create product discount</h3>
              </div>
            </div>
            <div className="col-sm-12">
              <div className="bgStyle">
                <h5>Select discount type</h5>
                <select
                  className="form-select"
                  value={selectedDiscount}
                  onChange={handleDiscountsTab}
                >
                  <option selected>Select discount type</option>
                  <option value="Amount of products">Amount of products</option>
                  <option value="Buy X get Y">Buy X get Y</option>
                </select>
              </div>
            </div>
          </div>
          <div className="row">
            <DiscountForm selectedDiscount={selectedDiscount} key={count} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateDiscount;
