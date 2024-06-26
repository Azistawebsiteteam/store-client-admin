import React, { useEffect, useState } from "react";
import AdminSideBar from "../Pages/AdminSideBar";
import { Link } from "react-router-dom";
import { FaRegFileImage } from "react-icons/fa";
import Cookies from "js-cookie";
import axios from "axios";
import swalErr from "../Pages/ErrorHandler";
import { ProductState } from "../Context/ProductContext";
import "../Pages/Admin.css";

const Collections = () => {
  const [collectionData, setCollectionData] = useState([]);
  const baseUrl = process.env.REACT_APP_API_URL;
  const tokenKey = process.env.admin_jwt_token;
  const token = Cookies.get(tokenKey);

  const { setDropdownItems } = ProductState();

  useEffect(() => {
    setDropdownItems(true);
    const collections = async () => {
      try {
        const url = `${baseUrl}/collections/data`;
        const headers = {
          Authorization: `Bearer ${token}`,
        };
        swalErr.onLoading();
        const response = await axios.get(url, { headers });
        swalErr.onLoadingClose();
        setCollectionData(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    collections();
  }, [baseUrl, token, setDropdownItems]);

  console.log("sasda", collectionData);

  return (
    <div className="adminSec">
      <div>
        <AdminSideBar />
      </div>
      <div className="commonSec">
        <div className="collectionTopbar">
          <h3>Collections</h3>
          <Link to="/collections/create">Create collection</Link>
        </div>
        <div className="collectionsDisplay">
          <div className="row">
            <div className="col-sm-3"></div>
            <div className="col-sm-3">
              <h6>Title</h6>
            </div>
            <div className="col-sm-3">
              <h6>Products</h6>
            </div>
            <div className="col-sm-3">
              <h6>Products condition</h6>
            </div>
          </div>
          {collectionData.map((eachCollection, id) => (
            <div className="collectionsCont">
              <Link
                className="link"
                key={eachCollection.azst_collection_id}
                to={`/collection/update/${eachCollection.azst_collection_id}`}
              >
                <div className="row">
                  <div className="d-flex align-items-center">
                    <div className="col-sm-3">
                      <div className="collectionsImgCont">
                        {eachCollection.azst_collection_img ? (
                          <img
                            className="CollectionsThumbnail"
                            src={eachCollection.azst_collection_img}
                            width={40}
                            height={40}
                            alt=""
                          />
                        ) : (
                          <div className="imgThumbnail">
                            <FaRegFileImage />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="col-sm-3">
                      <h6 className="collectionTitle">
                        {eachCollection.azst_collection_name}
                      </h6>
                    </div>
                    <div className="col-sm-3">
                      <span className="collectionCount">9</span>
                    </div>
                    <div className="col-sm-3">
                      <p className="productCondition">Testing</p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Collections;
