import React from "react";
import { FaRegFileImage } from "react-icons/fa";

import "./component.css";
import { RemoveIcon } from "./Icons";

const FeaturesT = () => {
  return (
    <div className="container">
      <div className="row">
        {Array.from({ length: 13 }).map((_, i) => (
          <div className="col-6 col-md-4" key={i}>
            <div className="ingrident-containers">
              <div className="cross-icon">
                <RemoveIcon />
              </div>
              <div className="file-contaner">
                <div className="img-icon">
                  <FaRegFileImage />
                </div>
                <div className="img-input">
                  <input type="file" />
                </div>
              </div>
              <div className="d-flex align-items-center">
                <label className="heading" htmlFor="title">
                  Title :
                </label>
                <input
                  id="title"
                  type="text"
                  className="form-control"
                  placeholder="Enter Title here"
                />
              </div>
              <div className="form-group">
                <label className="heading" htmlFor="description">
                  Description
                </label>
                <textarea
                  id="description"
                  className="form-control"
                  cols="50"
                  rows="4"
                  maxLength="200"
                />
                <p className="infoTxt">20 of 200 characters used</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturesT;
