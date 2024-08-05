import React, { useEffect, useState } from "react";
import AdminSideBar from "../Pages/AdminSideBar";
import { Link } from "react-router-dom";
import { FaRegFileImage } from "react-icons/fa";
import Cookies from "js-cookie";
import axios from "axios";
import swalErr from "../Pages/ErrorHandler";
import { ProductState } from "../Context/ProductContext";
import { MdDelete } from "react-icons/md";
import { MdModeEditOutline } from "react-icons/md";
import "../Pages/Admin.css";
import { useCallback } from "react";

const Collections = () => {
  const [collectionData, setCollectionData] = useState([]);
  const baseUrl = process.env.REACT_APP_API_URL;
  const tokenKey = process.env.REACT_APP_ADMIN_JWT_TOKEN;
  const token = Cookies.get(tokenKey);

  const { setDropdownItems } = ProductState();

  const collectionsApi = useCallback(async () => {
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
      swalErr.onLoadingClose();
      swalErr.onError(error);
      console.error(error);
    }
  }, [baseUrl, token]);

  useEffect(() => {
    setDropdownItems(true);
    collectionsApi();
  }, [setDropdownItems, collectionsApi]);

  const deleteCollection = async (id) => {
    console.log(id, "ididid");
    try {
      const url = `${baseUrl}/collections`;
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const body = { collectionId: id };
      const response = await axios.patch(url, body, { headers });
      if (response.status === 200) {
        console.log(response);
        swalErr.onSuccess();
        swalErr.onLoadingClose();
      }
      collectionsApi();
    } catch (error) {
      swalErr.onLoadingClose();
      swalErr.onError(error);
    }
  };

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
            <table className="table" style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th scope="col">Collection Image</th>
                  <th scope="col">Title</th>
                  <th scope="col">Products</th>
                  <th scope="col">Products condition</th>
                  <th scope="col">State</th>
                </tr>
              </thead>
              <tbody>
                {collectionData.map((eachCollection, id) => (
                  <tr key={id} className="item">
                    <td>
                      {eachCollection.azst_collection_img ? (
                        <img
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
                    </td>
                    <td>{eachCollection.azst_collection_name}</td>
                    <td>{eachCollection.no_products}</td>
                    <td>Testing</td>
                    <td>
                      <MdDelete
                        className="icons"
                        onClick={() =>
                          deleteCollection(eachCollection.azst_collection_id)
                        }
                      />{" "}
                      <Link
                        to={`/collection/update/${eachCollection.azst_collection_id}`}
                      >
                        <MdModeEditOutline className="icons" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Collections;
