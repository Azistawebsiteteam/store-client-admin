import React from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import ErrorHandler from "../Pages/ErrorHandler";
import AdminSideBar from "../Pages/AdminSideBar";
import { v4 } from "uuid";
import "../Pages/Admin.css";
import { FaRegFileImage } from "react-icons/fa";
import { CiSquarePlus } from "react-icons/ci";
// import { RemoveIcon } from "../Components/Icons/RemoveIcon";
import "./Popup.css";

const PopupListing = () => {
  const [popups, setPopups] = useState([
    {
      popup_image: "",
      popup_name: "",
      popup_url: "",
    },
  ]);
  const baseUrl = process.env.REACT_APP_API_URL;
  const jwtToken = Cookies.get(process.env.REACT_APP_ADMIN_JWT_TOKEN);

  useEffect(() => {
    const displayPopups = async () => {
      try {
        const url = `${baseUrl}/popups/data`;
        const headers = {
          Authorization: `Bearer ${jwtToken}`,
        };
        ErrorHandler.onLoading();
        const response = await axios.get(url, { headers });
        if (response.data.length >= 1) {
          setPopups(response.data);
        }
        ErrorHandler.onLoadingClose();
      } catch (error) {
        ErrorHandler.onLoadingClose();
        ErrorHandler.onError(error);
      }
    };
    displayPopups();
  }, [baseUrl, jwtToken]);

  const onCreatePopup = async (i) => {
    try {
      const url = `${baseUrl}/popups/create`;
      const headers = {
        Authorization: `Bearer ${jwtToken}`,
      };

      const popup = popups[i];
      const formdata = new FormData();
      formdata.append("Name", popup.popup_name);
      formdata.append("popupImage", popup.popup_image);
      formdata.append("Url", popup.popup_url);
      ErrorHandler.onLoading();
      // eslint-disable-next-line no-unused-vars
      const response = await axios.post(url, formdata, { headers });
      ErrorHandler.onLoadingClose();
      ErrorHandler.onSuccess();
    } catch (error) {
      ErrorHandler.onLoadingClose();
      ErrorHandler.onError(error);
    }
  };

  const handlePopupDetails = (e, popupId) => {
    const { id, value, files } = e.target;
    const updatedPopupDetails = popups.map((each) => {
      if (each.id === popupId) {
        if (files) {
          return { ...each, popup_image: files[0] };
        } else if (id === "popup_name") {
          return { ...each, [id]: value };
        } else {
          return { ...each, [id]: value };
        }
      } else {
        return each;
      }
    });
    setPopups(updatedPopupDetails);
  };

  const addPopup = () => {
    const newPopup = {
      id: v4(),
      popup_image: "",
      popup_name: "",
      popup_url: "",
    };
    setPopups([...popups, newPopup]);
  };

  return (
    <div className="adminSec">
      <div>
        <AdminSideBar />
      </div>
      <div className="commonSec">
        <div className="collectionTopbar">
          <h3>Popup</h3>
        </div>
        <div className="popups">
          <div className="row">
            {popups.map((each, i) => (
              <div className="popupCard col-sm-3" key={i}>
                <div class="card">
                  <div className="card-image">
                    {each.popup_image ? (
                      typeof each.popup_image === "string" ? (
                        <img
                          src={each.popup_image}
                          class="card-img-top"
                          alt="popupImg"
                        />
                      ) : (
                        <img
                          src={URL.createObjectURL(each.popup_image)}
                          class="card-img-top"
                          alt="popupImg"
                        />
                      )
                    ) : (
                      <div className="cardImg">
                        <FaRegFileImage className="feature-img" />
                      </div>
                    )}
                  </div>
                  <div class="uploadNewPopup">
                    <input
                      type="file"
                      accept="image/*"
                      className="card-img-top popupImgSelect"
                      alt="popupImage"
                      onChange={(e) => handlePopupDetails(e, each.id)}
                      id="popup_image"
                    />
                  </div>

                  <div class="card-body">
                    <input
                      type="text"
                      onChange={(e) => handlePopupDetails(e, each.id)}
                      value={each.popup_name}
                      className="card-title"
                      placeholder="Title"
                      id="popup_name"
                    />
                    <input
                      type="text"
                      onChange={(e) => handlePopupDetails(e, each.id)}
                      value={each.popup_url}
                      className="card-title"
                      placeholder="URL"
                      id="popup_url"
                    />
                  </div>
                </div>
                <button
                  className="btn bg-secondary text-light"
                  onClick={() => onCreatePopup(i)}
                >
                  Save
                </button>
              </div>
            ))}
            <div className="col-sm-3">
              <div
                className="popupAddBtn d-flex align-items-center justify-content-center"
                style={{ height: "100%" }}
              >
                <CiSquarePlus
                  style={{
                    fontSize: "40px",
                    cursor: "pointer",
                    margin: "10px",
                  }}
                  onClick={addPopup}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopupListing;
