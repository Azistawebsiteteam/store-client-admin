import React from "react";

import { FaUpload } from "react-icons/fa";

import "../Pages/Admin.css";
import TextEditor from "../Pages/TextEditor";
//import { ProductState } from '../Context/ProductContext';

const BlogForm = (props) => {
  const { buttonText, inputVlaues, setInputValues, handleSubmit } = props;
  //const { allProducts } = ProductState();

  const handleinputVlaues = (e) => {
    const { id, value } = e.target;
    setInputValues({ ...inputVlaues, [id]: value });
  };

  const handleBannerImg = (e) => {
    setInputValues({ ...inputVlaues, [e.target.id]: e.target.files[0] });
  };

  const setContent = (content) => {
    setInputValues({ ...inputVlaues, content: content });
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
                  value={inputVlaues.type}
                  onChange={handleinputVlaues}
                  placeholder="Enter Blog Type"
                />
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
                  value={inputVlaues.title}
                  onChange={handleinputVlaues}
                />
                <p className="infoTxt">
                  {inputVlaues.title.length} of 50 characters used
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
                  value={inputVlaues.description}
                ></textarea>
                <p className="infoTxt">
                  {inputVlaues.description.length} of 200 characters used
                </p>
              </div>
              <div className="col-sm-12 form-group">
                <TextEditor
                  content={inputVlaues.content}
                  setContent={setContent}
                />
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
              value={inputVlaues.product}
              onChange={handleinputVlaues}
              placeholder="Enter Product Name"
            />
          </div>
        </div>
        <div className="bgStyle">
          <div className="form-group mt-2">
            <label className="heading">Blog Thumbnail</label>
            <div className="drop-zone">
              {inputVlaues.blogThumbnailImg ? (
                typeof inputVlaues.blogThumbnailImg === "string" ? (
                  <img
                    src={inputVlaues.blogThumbnailImg}
                    alt="thumbnail"
                    className="bImg"
                  />
                ) : (
                  <img
                    src={URL.createObjectURL(inputVlaues.blogThumbnailImg)}
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
            <label className="mt-1" style={{ whiteSpace: "normal" }}>
              <strong>Note:-</strong> Image dimensions must be in 855*982 pixels
            </label>
          </div>
        </div>
        <div className="bgStyle">
          <div className="form-group mt-2">
            <label className="heading">Blog Image</label>
            <div className="drop-zone">
              {inputVlaues.blogImg ? (
                typeof inputVlaues.blogImg === "string" ? (
                  <img
                    src={inputVlaues.blogImg}
                    alt="Banner"
                    className="bImg"
                  />
                ) : (
                  <img
                    src={URL.createObjectURL(inputVlaues.blogImg)}
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
