import React from "react";
import { FaUpload } from "react-icons/fa";

const CategoryForm = (props) => {
  const { categoryImg, setCategoryImg, categoryData, setCategoryData } = props;

  const handleCategoryImage = (e) => {
    const image = e.target.files[0];
    setCategoryImg(image);
  };

  const handleBrandInput = (e) => {
    setCategoryData({ ...categoryData, [e.target.id]: e.target.value });
  };

  return (
    <div className="bgStyle">
      <form className="row g-3">
        <div className="col-md-6">
          <label htmlFor="text" className="form-label">
            Category Name
          </label>
          <input
            type="text"
            value={categoryData.text}
            onChange={handleBrandInput}
            className="form-control"
            id="text"
          />
        </div>
        <div className="col-md-12">
          <label htmlFor="description" className="form-label">
            Category Description
          </label>
          <input
            type="text"
            value={categoryData.description}
            onChange={handleBrandInput}
            className="form-control"
            id="description"
          />
        </div>
        <div className="col-12">
          <div className="form-group">
            <h6>Image</h6>
            <div className="drop-zone">
              {categoryImg ? (
                typeof categoryImg === "string" ? (
                  <img
                    className="categoryThumbnail"
                    src={categoryImg}
                    width={200}
                    height={180}
                    alt=""
                  />
                ) : (
                  <img
                    className="categoryThumbnail"
                    src={URL.createObjectURL(categoryImg)}
                    width={200}
                    height={180}
                    alt=""
                  />
                )
              ) : (
                <span className="dropZoneOverlay">
                  <FaUpload /> Drop file here or click to upload
                </span>
              )}
              <input
                type="file"
                className="FileUpload"
                id="categoryImage"
                onChange={handleCategoryImage}
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;
