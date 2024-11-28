import React from "react";

import { FaUpload } from "react-icons/fa";

import "../Pages/Admin.css";
import TextEditor from "../Pages/TextEditor";
//import { ProductState } from '../Context/ProductContext';

const BlogForm = (props) => {
  const {
    buttonText,
    inputValues,
    setInputValues,
    handleSubmit,
    validationErrors,
    setValidationErrors,
  } = props;
  //const { allProducts } = ProductState();

  const handleinputVlaues = (e) => {
    const { id, value } = e.target;
    setInputValues({ ...inputValues, [id]: value });
    setValidationErrors({ ...validationErrors, [e.target.id]: "" });
  };

  const handleBannerImg = (e) => {
    setInputValues({ ...inputValues, [e.target.id]: e.target.files[0] });
    setValidationErrors({ ...validationErrors, [e.target.id]: "" });
  };

  const setContent = (content) => {
    setInputValues({ ...inputValues, content: content });
    setValidationErrors({ ...validationErrors, content: "" });
  };

  const onSubmitBlog = () => {
    handleSubmit();
  };

  return (
    <div className="row">
      <div className="col-12 col-md-8">
        <div className="bgStyle">
          <div className="container">
            <div className="row">
              <div className="col-sm-12 col-md-6">
                <label className="heading" htmlFor="type">
                  Blog Type
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="type"
                  value={inputValues.type}
                  onChange={handleinputVlaues}
                  placeholder="Enter Blog Type"
                  maxLength="40"
                />
                {validationErrors.type && (
                  <span className="errorValue">{validationErrors.type}</span>
                )}
              </div>

              <div className="col-sm-12 col-md-6 form-group">
                <label className="heading" htmlFor="title">
                  Title
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="title"
                  maxLength="50"
                  value={inputValues.title}
                  onChange={handleinputVlaues}
                />
                {validationErrors.title && (
                  <span className="errorValue">{validationErrors.title}</span>
                )}
                <p className="infoTxt">
                  {inputValues.title.length} of 50 characters used
                </p>
              </div>
              <div className="col-sm-12 form-group">
                <label className="heading" htmlFor="description">
                  Short Description
                </label>
                <textarea
                  id="description"
                  className="form-control"
                  cols="60"
                  rows="2"
                  maxLength="200"
                  onChange={handleinputVlaues}
                  value={inputValues.description}
                ></textarea>
                {validationErrors.description && (
                  <span className="errorValue">
                    {validationErrors.description}
                  </span>
                )}
                <p className="infoTxt">
                  {inputValues.description.length} of 200 characters used
                </p>
              </div>
              <div className="col-sm-12 form-group">
                <TextEditor
                  content={inputValues.content}
                  setContent={setContent}
                />
                {validationErrors.content && (
                  <span className="errorValue">{validationErrors.content}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-12 col-md-4">
        <div className="bgStyle">
          <div className="col-12">
            <label className="heading" htmlFor="product">
              Product (or) Brand Name
            </label>
            <input
              type="text"
              className="form-control"
              id="product"
              value={inputValues.product}
              onChange={handleinputVlaues}
              placeholder="Enter Product Name"
              maxLength="50"
            />
            {validationErrors.product && (
              <span className="errorValue">{validationErrors.product}</span>
            )}
          </div>
        </div>
        <div className="bgStyle">
          <div className="form-group mt-2">
            <label className="heading">Blog Thumbnail</label>
            <div className="drop-zone">
              {inputValues.blogThumbnailImg ? (
                typeof inputValues.blogThumbnailImg === "string" ? (
                  <img
                    src={inputValues.blogThumbnailImg}
                    alt="thumbnail"
                    className="bImg"
                  />
                ) : (
                  <img
                    src={URL.createObjectURL(inputValues.blogThumbnailImg)}
                    alt="thumbnail"
                    className="bImg"
                  />
                )
              ) : (
                <label className="dropZoneOverlay">
                  <FaUpload /> Drop file here or click to upload
                </label>
              )}
              <input
                type="file"
                accept="image/*"
                className="FileUpload"
                style={{ position: "absolute" }}
                id="blogThumbnailImg"
                onChange={handleBannerImg}
              />
            </div>
            {validationErrors.blogThumbnailImg && (
              <span className="errorValue">
                {validationErrors.blogThumbnailImg}
              </span>
            )}
            <label className="mt-1" style={{ whiteSpace: "normal" }}>
              <strong>Note:-</strong> Image dimensions must be in 855*982 pixels
            </label>
          </div>
        </div>
        <div className="bgStyle">
          <div className="form-group mt-2">
            <label className="heading">Blog Image</label>
            <div className="drop-zone">
              {inputValues.blogImg ? (
                typeof inputValues.blogImg === "string" ? (
                  <img
                    src={inputValues.blogImg}
                    alt="Banner"
                    className="bImg"
                  />
                ) : (
                  <img
                    src={URL.createObjectURL(inputValues.blogImg)}
                    alt="Banner"
                    className="bImg"
                  />
                )
              ) : (
                <label className="dropZoneOverlay">
                  <FaUpload /> Drop file here or click to upload
                </label>
              )}
              <input
                type="file"
                accept="image/*"
                className="FileUpload"
                style={{ position: "absolute" }}
                id="blogImg"
                onChange={handleBannerImg}
              />
            </div>
            {validationErrors.type && (
              <span className="errorValue">{validationErrors.blogImg}</span>
            )}
            <label className="mt-1" style={{ whiteSpace: "normal" }}>
              <strong>Note:-</strong> Image dimensions must be in 1220*550
              pixels
            </label>
          </div>
        </div>
        <div className="mt-3 d-flex justify-content-end">
          <div className="btnCont">
            <button className="adminBtn" onClick={onSubmitBlog}>
              {buttonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogForm;
