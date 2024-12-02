import React from "react";
import { FaUpload } from "react-icons/fa";
import { v4 } from "uuid";
import { AddIcon } from "../Components/Icons";
import { RxCross2 } from "react-icons/rx";

const CategoryForm = (props) => {
  const {
    categoryImg,
    setCategoryImg,
    subCategories,
    setSubCategories,
    categoryData,
    setCategoryData,
    deletedSubCats,
    setDeletedSubCats,
    categoriesErrorMsg,
    setCategoriesErrorMsg,
  } = props;

  const handleCategoryImage = (e) => {
    const image = e.target.files[0];
    setCategoryImg(image);
    setCategoriesErrorMsg({ ...categoriesErrorMsg, categoryImg: "" });
  };

  const handleBrandInput = (e) => {
    setCategoryData({ ...categoryData, [e.target.id]: e.target.value });
    setCategoriesErrorMsg({ ...categoriesErrorMsg, [e.target.id]: "" });
  };

  const addSubCategories = () => {
    setSubCategories([
      ...subCategories,
      {
        id: v4(),
        subCategoryName: "",
      },
    ]);
  };

  const removeCategory = (id) => {
    if (setDeletedSubCats) {
      setDeletedSubCats([...deletedSubCats, id]);
    }
    const updateCategories = subCategories.filter(
      (subCategory) => subCategory.id !== id
    );
    setSubCategories(updateCategories);
  };

  const handleSubCategoryInput = (e, id) => {
    const newSubCategories = subCategories.map((each, i) => {
      if (each.id === id) {
        return { ...each, subCategoryName: e.target.value };
      } else {
        return each;
      }
    });
    setSubCategories(newSubCategories);
    setCategoriesErrorMsg({ ...categoriesErrorMsg, subCategoryName: "" });
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
            maxLength={50}
            className="form-control"
            id="text"
          />
          {categoriesErrorMsg.text && (
            <span className="errorValue">{categoriesErrorMsg.text}</span>
          )}
        </div>
        <div className="col-md-12">
          <label htmlFor="description" className="form-label">
            Category Description
          </label>
          <textarea
            type="text"
            value={categoryData.description}
            onChange={handleBrandInput}
            className="form-control"
            id="description"
            maxLength="500"
          ></textarea>
          {categoriesErrorMsg.description && (
            <span className="errorValue">{categoriesErrorMsg.description}</span>
          )}
        </div>
        <div className="col-md-12">
          <label htmlFor="text" className="form-label">
            Sub Category Name
          </label>
          <div className="d-flex align-items-center flex-wrap">
            {subCategories?.map((each, i) => (
              <div key={i} className="subCategoryCont">
                <input
                  type="text"
                  value={each.subCategoryName}
                  onChange={(e) => handleSubCategoryInput(e, each.id)}
                  className="form-control"
                  id="text"
                  maxLength="50"
                  style={{ width: "90%", height: "fitContent" }}
                />
                <div className="dltSubCat">
                  <RxCross2
                    size={16}
                    strokeWidth={1}
                    color="grey"
                    onClick={(e) => removeCategory(each.id)}
                  />
                </div>
              </div>
            ))}
            <AddIcon onClick={addSubCategories} />
          </div>
          {categoriesErrorMsg.subCategoryName && (
            <span className="errorValue">
              {categoriesErrorMsg.subCategoryName}
            </span>
          )}
        </div>
        <div className="col-sm-12 col-md-6">
          <div className="form-group">
            <h6>Image</h6>
            <div className="drop-zone" style={{ borderRadius: "0.6rem" }}>
              {categoryImg ? (
                typeof categoryImg === "string" ? (
                  <img
                    className="categoryThumbnailInput"
                    src={categoryImg}
                    width={200}
                    height={180}
                    alt="category"
                  />
                ) : (
                  <img
                    className="categoryThumbnailInput"
                    src={URL.createObjectURL(categoryImg)}
                    width={200}
                    height={180}
                    alt="category"
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
                className="FileUpload categoryImgUpload"
                id="categoryImage"
                onChange={handleCategoryImage}
              />
            </div>
            {categoriesErrorMsg.categoryImg && (
              <span className="errorValue">
                {categoriesErrorMsg.categoryImg}
              </span>
            )}
            <label className="labelForm">
              <strong>Note:</strong> Shape the image into a circle for a more
              appealing design.
            </label>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;
