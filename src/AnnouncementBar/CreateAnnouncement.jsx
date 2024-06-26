import React from "react";
import Cookies from "js-cookie";
import AnnouncementForm from "./AnnouncementForm";
import { useState } from "react";
import axios from "axios";

const CreateAnnouncement = () => {
  const [txtColor, setTxtColor] = useState("");
  const [bgColor, setBgColor] = useState("");
  const [displaySettings, setDisplaySettings] = useState({
    homePage: false,
  });
  const [announcementBarContent, setAnnouncementBarContent] = useState({
    annoncementBarTxt: "",
    annoncementBarMobTxt: "",
    bgLink: "",
  });

  const baseUrl = process.env.REACT_APP_API_URL;
  const token = Cookies.get(process.env.REACT_APP_ADMIN_JWT_TOKEN);

  const onSubmitDetails = async () => {
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
        showHomePageOnly: displaySettings.homePage,
      };
      const response = await axios.post(url, body, { headers });
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };
  console.log(txtColor, bgColor, "balu");

  return (
    <div>
      <AnnouncementForm
        txtColor={txtColor}
        setTxtColor={setTxtColor}
        bgColor={bgColor}
        setBgColor={setBgColor}
        displaySettings={displaySettings}
        setDisplaySettings={setDisplaySettings}
        announcementBarContent={announcementBarContent}
        setAnnouncementBarContent={setAnnouncementBarContent}
      />
      <div className="col-sm-12">
        <div className="btnCont">
          <button className="adminBtn" onClick={onSubmitDetails}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateAnnouncement;
