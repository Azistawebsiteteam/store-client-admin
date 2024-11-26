import React from "react";
import Cookies from "js-cookie";
import AnnouncementForm from "./AnnouncementForm";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ErrorHandler from "../Pages/ErrorHandler";
import AdminSideBar from "../Pages/AdminSideBar";
import BackBtn from "../Components/BackBtn";
import { handleValidationError } from "./Validation";

const EditAnnouncement = () => {
  const [txtColor, setTxtColor] = useState("");
  const [bgColor, setBgColor] = useState("");
  // const [displaySettings, setDisplaySettings] = useState({
  //   homePage: false,
  //   displayBar: false,
  // });
  const [announcementBarContent, setAnnouncementBarContent] = useState({
    annoncementBarTxt: "",
    annoncementBarMobTxt: "",
    bgLink: "",
  });
  const [validationErrors, setValidationErrors] = useState({});

  const baseUrl = `${process.env.REACT_APP_API_URL}/announcement`;
  const token = Cookies.get(process.env.REACT_APP_ADMIN_JWT_TOKEN);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const getAnnouncements = async () => {
      const url = `${baseUrl}/getdetails`;
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.post(
        url,
        { announcementId: id },
        { headers }
      );
      if (response.status === 200) {
        const details = response.data;
        setTxtColor(details.announcement_text_color);
        setBgColor(details.announcement_background_color);
        // setDisplaySettings({
        //   homePage:
        //     details.announcement_show_homepage_only === 1 ? true : false,
        // });
        setAnnouncementBarContent({
          annoncementBarTxt: details.announcement_web_text,
          annoncementBarMobTxt: details.announcement_mobile_text,
          bgLink: details.announcement_web_link,
        });
      }
    };
    getAnnouncements();
  }, [baseUrl, id, token]);

  const onEditDetails = async () => {
    const validationErrorMsg = handleValidationError(announcementBarContent);
    if (Object.keys(validationErrorMsg).length > 0) {
      window.scrollTo(0, 0);
      setValidationErrors(validationErrorMsg);
      return;
    }
    try {
      const url = `${baseUrl}/update`;
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const body = {
        announcementId: id,
        webText: announcementBarContent.annoncementBarTxt,
        mobileText: announcementBarContent.annoncementBarMobTxt,
        webLink: announcementBarContent.bgLink,
        textCrl: txtColor,
        backgroundCrl: bgColor,
        // showHomePageOnly: displaySettings.homePage,
      };
      ErrorHandler.onLoading();
      const response = await axios.post(url, body, { headers });
      if (response.status === 200) {
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
                  <button className="adminBtn" onClick={onEditDetails}>
                    Update
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

export default EditAnnouncement;
