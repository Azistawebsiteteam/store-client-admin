import React from "react";
import { FaUpload } from "react-icons/fa";
import "../Pages/Admin.css";

const BrandForm = (props) => {
  const {
    brandImg,
    setBrandImg,
    brandName,
    setBrandName,
    description,
    setDescription,
    brandsValidationErrors,
    setBrandsValidationErrors,
  } = props;

  const handleBrandImage = (e) => {
    const image = e.target.files[0];
    setBrandImg(image);
    setBrandsValidationErrors({ ...brandsValidationErrors, brandImg: "" });
  };

  const handleBrandInput = (e) => {
    setBrandName(e.target.value);
    setBrandsValidationErrors({ ...brandsValidationErrors, brandName: "" });
  };
  const handleBrandDescription = (e) => {
    setDescription(e.target.value);
    setBrandsValidationErrors({ ...brandsValidationErrors, description: "" });
  };

  return (
    <form className="row g-3">
      <div className="col-md-6">
        <label htmlFor="name" className="form-label">
          Brand Name
        </label>
        <input
          type="text"
          value={brandName}
          onChange={handleBrandInput}
          maxLength="50"
          className="form-control"
          id="name"
        />
        {brandsValidationErrors.brandName && (
          <span className="errorValue">{brandsValidationErrors.brandName}</span>
        )}
      </div>
      <div className="col-md-12">
        <label htmlFor="description" className="form-label">
          Brand Description
        </label>
        <input
          type="text"
          value={description}
          onChange={handleBrandDescription}
          className="form-control"
          maxLength="500"
          id="description"
        />
        {brandsValidationErrors.description && (
          <span className="errorValue">
            {brandsValidationErrors.description}
          </span>
        )}
      </div>
      <div className="col-12">
        <div className="form-group">
          <h6>Image</h6>
          <div className="drop-zone">
            {brandImg ? (
              typeof brandImg === "string" ? (
                <img
                  className="CollectionsThumbnail"
                  src={brandImg}
                  width={200}
                  height={180}
                  alt=""
                />
              ) : (
                <img
                  className="CollectionsThumbnail"
                  src={URL.createObjectURL(brandImg)}
                  width={200}
                  height={180}
                  alt=""
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
              id="collectionImage"
              onChange={handleBrandImage}
            />
          </div>
          {brandsValidationErrors.brandImg && (
            <span className="errorValue">
              {brandsValidationErrors.brandImg}
            </span>
          )}
        </div>
      </div>
    </form>
  );
};

export default BrandForm;
