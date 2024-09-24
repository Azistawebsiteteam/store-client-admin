import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import axios from "axios";
import Cookies from "js-cookie";
import swalErr from "../Pages/ErrorHandler";

import CollectionForm from "./CollectionForm";

const UpdateCollection = () => {
  const [collectionData, setCollectionData] = useState({
    title: "",
    content: "",
    metaTitle: "",
    metaDescription: "",
    urlHandle: "",
    collectionImg: "",
  });

  const baseUrl = process.env.REACT_APP_API_URL;
  const tokenKey = process.env.REACT_APP_ADMIN_JWT_TOKEN;
  const token = Cookies.get(tokenKey);
  const { id } = useParams();

  useEffect(() => {
    const getCollectionDetails = async () => {
      try {
        const url = `${baseUrl}/collections`;
        const headers = {
          Authorization: `Bearer ${token}`,
        };
        const body = {
          collectionId: id,
        };
        swalErr.onLoading();
        const response = await axios.post(url, body, { headers });
        if (response.status === 200) {
          const details = response.data;
          setCollectionData({
            title: details.azst_collection_name,
            content: details.azst_collection_content,
            metaTitle: details.azst_collection_seo_tile,
            metaDescription: details.azst_collection_seo_content,
            urlHandle: details.azst_collection_url,
            collectionImg: details.azst_collection_img,
          });
        }
        swalErr.onLoadingClose();
      } catch (error) {
        swalErr.onLoadingClose();
        swalErr.onError(error);
      }
    };
    getCollectionDetails();
  }, [id, token, baseUrl]);

  const onUpdateCollection = async () => {
    try {
      const url = `${baseUrl}/collections`;
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
      formdata.append("collectionId", id);
      formdata.append("title", title);
      formdata.append("content", content);
      formdata.append("metaDetails", JSON.stringify(metaDetails));
      formdata.append("collectionImg", collectionImg);

      // eslint-disable-next-line no-unused-vars
      const response = await axios.put(url, formdata, { headers });
      swalErr.onLoadingClose();
      swalErr.onSuccess();
    } catch (error) {
      swalErr.onLoadingClose();
      swalErr.onError(error);
    }
  };
  return (
    <div>
      <CollectionForm
        collectionData={collectionData}
        setCollectionData={setCollectionData}
      />
      <div className="col-sm-12">
        <div className="btnCont">
          <button className="adminBtn" onClick={onUpdateCollection}>
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateCollection;
