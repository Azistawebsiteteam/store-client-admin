import React from "react";
import AdminSideBar from "../Pages/AdminSideBar";
import "../Pages/Admin.css";

const AnnouncementFrom = (props) => {
  const {
    txtColor,
    setTxtColor,
    bgColor,
    setBgColor,
    displaySettings,
    setDisplaySettings,
    announcementBarContent,
    setAnnouncementBarContent,
  } = props;

  const handleTxtColor = (e) => {
    setTxtColor(e.target.value);
  };

  const handleBgColor = (e) => {
    setBgColor(e.target.value);
  };

  const handleDisplaySettings = (e) => {
    setDisplaySettings({ ...displaySettings, [e.target.id]: e.target.checked });
  };

  const handleAnnoncementBarCont = (e) => {
    setAnnouncementBarContent({
      ...announcementBarContent,
      [e.target.id]: e.target.value,
    });
  };

  return (
    <div className="adminSec">
      <AdminSideBar />
      <div className="commonSec">
        <div className="container">
          <div className="row">
            <div className="col-sm-12">
              <h3>Announcement Bar</h3>
              <div className="announcementBarSec">
                <div className="form-check spacing">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value=""
                    id="homePage"
                    checked={displaySettings.homePage}
                    onChange={handleDisplaySettings}
                  />
                  <label className="form-check-label" htmlFor="homePage">
                    Show on home page only
                  </label>
                </div>
                <div className="form-group spacing">
                  <label htmlFor="annoncementBarTxt">Text</label>
                  <textarea
                    className="form-control"
                    id="annoncementBarTxt"
                    rows="3"
                    value={announcementBarContent.annoncementBarTxt}
                    onChange={handleAnnoncementBarCont}
                  ></textarea>
                </div>
                <div className="form-group spacing">
                  <label htmlFor="annoncementBarMobTxt">Text (Mobile)</label>
                  <textarea
                    className="form-control"
                    id="annoncementBarMobTxt"
                    rows="3"
                    value={announcementBarContent.annoncementBarMobTxt}
                    onChange={handleAnnoncementBarCont}
                  ></textarea>
                  <small>
                    Use this option if you want to display alternate text in
                    mobile. Recommended htmlFor shortening announcement text to
                    make suitable htmlFor mobile.
                  </small>
                </div>
                <div className="form-group spacing">
                  <label htmlFor="bgLink">Link</label>
                  <input
                    type="text"
                    className="form-control"
                    id="bgLink"
                    placeholder="Background Link"
                    value={announcementBarContent.bgLink}
                    onChange={handleAnnoncementBarCont}
                  />
                </div>
                <div className="row spacing">
                  <div className="col-sm-2">
                    <label htmlFor="txtColor">Color</label>
                    <input
                      type="color"
                      className="form-control"
                      id="txtColor"
                      placeholder="Text Color"
                      onChange={handleTxtColor}
                      value={txtColor}
                    />
                  </div>
                  <div className="col-sm-2">
                    <label htmlFor="txtColor">Background Color</label>
                    <input
                      type="color"
                      className="form-control"
                      id="txtColor"
                      placeholder="Text Color"
                      onChange={handleBgColor}
                      value={bgColor}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementFrom;
