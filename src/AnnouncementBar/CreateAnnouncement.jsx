import React from "react";
import Cookies from "js-cookie";
import AnnouncementForm from "./AnnouncementForm";
import { useState } from "react";
import axios from "axios";
import ErrorHandler from "../Pages/ErrorHandler";
import { useNavigate } from "react-router-dom";
import AdminSideBar from "../Pages/AdminSideBar";
import BackBtn from "../Components/BackBtn";
import { handleValidationError } from "./Validation";

const CreateAnnouncement = () => {
  const [txtColor, setTxtColor] = useState("");
  const [bgColor, setBgColor] = useState("");
  // const [displaySettings, setDisplaySettings] = useState({
  //   homePage: false,
  // });
  const [announcementBarContent, setAnnouncementBarContent] = useState({
    annoncementBarTxt: "",
    annoncementBarMobTxt: "",
    bgLink: "",
  });
  const [validationErrors, setValidationErrors] = useState({});

  const baseUrl = process.env.REACT_APP_API_URL;
  const token = Cookies.get(process.env.REACT_APP_ADMIN_JWT_TOKEN);

  const navigate = useNavigate();

  const onSubmitDetails = async () => {
    const validationErrorMsg = handleValidationError(announcementBarContent);
    if (Object.keys(validationErrorMsg).length > 0) {
      window.scrollTo(0, 0);
      setValidationErrors(validationErrorMsg);
      return;
    }
    try {
      const url = `${baseUrl}/announcement/add`;
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const body = {
        webText: announcementBarContent.annoncementBarTxt,
        mobileText: announcementBarContent.annoncementBarMobTxt,
        webLink: announcementBarContent.bgLink,
        textCrl: txtColor,
        backgroundCrl: bgColor,
        // showHomePageOnly: displaySettings.homePage,
      };
      ErrorHandler.onLoading();
      const response = await axios.post(url, body, { headers });
      if (response.status === 201) {
        ErrorHandler.onSuccess("Announcement created successfully!");
        navigate(-1);
      }
      ErrorHandler.onLoadingClose();
    } catch (error) {
      ErrorHandler.onLoadingClose();
      ErrorHandler.onError(error);
    }
  };

  return (
    <div className="adminSec">
      <AdminSideBar />
      <div className="commonSec">
        <div className="container">
          <div className="row">
            <div className="col-sm-12">
              <div className="d-flex align-items-center mb-3">
                <BackBtn />
                <h4>Announcement Bar</h4>
              </div>
              <AnnouncementForm
                txtColor={txtColor}
                setTxtColor={setTxtColor}
                bgColor={bgColor}
                setBgColor={setBgColor}
                // displaySettings={displaySettings}
                // setDisplaySettings={setDisplaySettings}
                announcementBarContent={announcementBarContent}
                setAnnouncementBarContent={setAnnouncementBarContent}
                validationErrors={validationErrors}
                setValidationErrors={setValidationErrors}
              />
              <div className="col-sm-12">
                <div className="btnCont">
                  <button className="adminBtn" onClick={onSubmitDetails}>
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAnnouncement;
