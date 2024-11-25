import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import BackBtn from "../Components/BackBtn";
import AdminSideBar from "../Pages/AdminSideBar";
import CollectionForm from "./CollectionForm";
import swalErr from "../Pages/ErrorHandler";
import { handleCollectionValidations } from "./CollectionValidations";
import "../Pages/Admin.css";

const CreateCollections = () => {
  const [collectionData, setCollectionData] = useState({
    title: "",
    content: "",
    metaTitle: "",
    metaDescription: "",
    urlHandle: `${window.location.origin}/collections/`,
    collectionImg: "",
  });
  const [validationErrors, setValidationErrors] = useState({});

  const tokenKey = process.env.REACT_APP_ADMIN_JWT_TOKEN;
  const token = Cookies.get(tokenKey);
  const baseUrl = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();

  const onSubmitCollection = async () => {
    const validationErrors = handleCollectionValidations(collectionData);
    if (Object.keys(validationErrors).length > 0) {
      window.scrollTo(0, 0);
      setValidationErrors(validationErrors);
      return;
    }
    try {
      const url = `${baseUrl}/collections/add`;
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-type": "multipart/form-data",
      };
      swalErr.onLoading();
      const formdata = new FormData();

      const {
        title,
        content,
        metaTitle,
        metaDescription,
        urlHandle,
        collectionImg,
      } = collectionData;

      const metaDetails = {
        metaTitle,
        metaDescription,
        urlHandle,
      };

      formdata.append("title", title);
      formdata.append("content", content);
      formdata.append("metaDetails", JSON.stringify(metaDetails));
      formdata.append("collectionImg", collectionImg);

      await axios.post(url, formdata, { headers });
      swalErr.onLoadingClose();
      swalErr.onSuccess();
      navigate(-1);
    } catch (error) {
      swalErr.onLoadingClose();
      swalErr.onError(error);
    }
  };

  return (
    <div className="adminSec">
      <AdminSideBar />
      <div className="commonSec">
        <div className="container">
          <div className="row">
            <div className="d-flex align-items-center mb-3">
              <BackBtn onClick={() => navigate(-1)} />
              <h5>Create Collections</h5>
            </div>
            <CollectionForm
              collectionData={collectionData}
              setCollectionData={setCollectionData}
              validationErrors={validationErrors}
              setValidationErrors={setValidationErrors}
            />
            <div className="col-sm-12">
              <div className="btnCont">
                <button className="adminBtn" onClick={onSubmitCollection}>
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCollections;
