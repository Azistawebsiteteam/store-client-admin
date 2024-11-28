import React from "react";
import { FaUpload } from "react-icons/fa6";
import "../Pages/Admin.css";

const CollectionForm = (props) => {
  const {
    collectionData,
    setCollectionData,
    validationErrors,
    setValidationErrors,
  } = props;
  const {
    title,
    content,
    metaTitle,
    metaDescription,
    urlHandle,
    collectionImg,
  } = collectionData;

  const handleCollectionsTitle = (e) => {
    setCollectionData({
      ...collectionData,
      title: e.target.value,
      urlHandle: `${
        window.location.origin
      }/collections/${e.target.value.replace(/ /g, "-")}`,
    });
    setValidationErrors({ ...validationErrors, title: "" });
  };

  const handleMetaDetails = (e) => {
    setCollectionData({ ...collectionData, [e.target.id]: e.target.value });
  };

  const setCollectionContent = (e) => {
    setCollectionData({ ...collectionData, content: e.target.value });
    setValidationErrors({ ...validationErrors, content: "" });
  };

  const onChangeCollectionImage = (e) => {
    const collectionImg = e.target.files[0];
    setCollectionData({ ...collectionData, collectionImg: collectionImg });
    setValidationErrors({ ...validationErrors, collectionImg: "" });
  };

  return (
    <>
      <div className="col-sm-8">
        <div className="row">
          <div className="col-sm-12">
            <div className="bgStyle">
              <div className="form-group">
                <label className="heading" htmlFor="title">
                  Title
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="title"
                  value={title}
                  onChange={handleCollectionsTitle}
                  placeholder="e.g. Summer collections, under $100, Staff Picks"
                />
                {validationErrors.title && (
                  <label className="errorValue">{validationErrors.title}</label>
                )}
              </div>
              <div className="form-group d-flex flex-column mt-2">
                <label className="heading" htmlFor="content">
                  Description
                </label>
                <textarea
                  id="content"
                  value={content}
                  onChange={setCollectionContent}
                  cols={50}
                  rows={4}
                  className="form-control"
                ></textarea>
                {validationErrors.content && (
                  <label className="errorValue">
                    {validationErrors.content}
                  </label>
                )}
              </div>
            </div>
            <div className="bgStyle">
              <h6>Search engine listing</h6>
              <p>
                Add a title and description to see how this product might appear
                in a search engine listing
              </p>
              <div className="form-group">
                <label className="heading" htmlFor="metaTitle">
                  Meta title
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="metaTitle"
                  maxLength="200"
                  value={metaTitle}
                  onChange={handleMetaDetails}
                />
                <p className="infoTxt">
                  {metaTitle.length} of 200 characters used
                </p>
              </div>
              <div className="form-group">
                <label className="heading" htmlFor="metaDescription">
                  Meta description
                </label>
                <textarea
                  id="metaDescription"
                  className="form-control"
                  maxLength="320"
                  onChange={handleMetaDetails}
                  value={metaDescription}
                ></textarea>
                <p className="infoTxt">
                  {metaDescription.length} of 320 characters used
                </p>
              </div>
              <div className="form-group">
                <label className="heading" htmlFor="urlHandle">
                  URL handle
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="urlHandle"
                  value={urlHandle}
                  onChange={handleMetaDetails}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-sm-4">
        <div className="bgStyle">
          <div className="form-group">
            <h6>Image</h6>
            <div className="drop-zone">
              {collectionImg ? (
                typeof collectionImg === "string" ? (
                  <img
                    className="CollectionsThumbnail"
                    src={collectionImg}
                    width={200}
                    height={180}
                    alt=""
                  />
                ) : (
                  <img
                    className="CollectionsThumbnail"
                    src={URL.createObjectURL(collectionImg)}
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
                onChange={onChangeCollectionImage}
              />
            </div>
            {validationErrors.collectionImg && (
              <label
                className="errorvalue"
                style={{ color: "red", fontSize: "1.2rem" }}
              >
                {validationErrors.collectionImg}
              </label>
            )}
            <label style={{ whiteSpace: "normal", marginTop: "1rem" }}>
              <strong>Note:- </strong>Kindly use an image with dimensions 310 x
              380 pixels for better appeal.
            </label>
          </div>
        </div>
      </div>
    </>
  );
};

export default CollectionForm;
