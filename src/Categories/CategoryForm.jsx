import React from "react";
import { FaUpload } from "react-icons/fa";
import { v4 } from "uuid";
import { AddIcon, RemoveIcon } from "../Components/Icons";

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
  } = props;

  const handleCategoryImage = (e) => {
    const image = e.target.files[0];
    setCategoryImg(image);
  };

  const handleBrandInput = (e) => {
    setCategoryData({ ...categoryData, [e.target.id]: e.target.value });
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

  console.log(deletedSubCats);

  const handleSubCategoryInput = (e, id) => {
    const newSubCategories = subCategories.map((each, i) => {
      if (each.id === id) {
        return { ...each, subCategoryName: e.target.value };
      } else {
        return each;
      }
    });
    setSubCategories(newSubCategories);
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
          <label htmlFor="text" className="form-label">
            Sub Category Name
          </label>
          <div className="d-flex flex-wrap">
            {subCategories?.map((each, i) => (
              <div
                key={i}
                className="subCategoryCont d-flex align-items-center m-1"
              >
                <input
                  type="text"
                  value={each.subCategoryName}
                  onChange={(e) => handleSubCategoryInput(e, each.id)}
                  className="form-control"
                  id="text"
                  style={{ width: "90%", height: "fitContent" }}
                />
                <div className="dltSubCat">
                  <RemoveIcon onClick={(e) => removeCategory(each.id)} />
                </div>
              </div>
            ))}
            <AddIcon onClick={addSubCategories} />
          </div>
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
