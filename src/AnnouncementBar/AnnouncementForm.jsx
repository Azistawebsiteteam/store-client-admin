import React from "react";
import "../Pages/Admin.css";

const AnnouncementFrom = (props) => {
  const {
    txtColor,
    setTxtColor,
    bgColor,
    setBgColor,
    // displaySettings,
    // setDisplaySettings,
    announcementBarContent,
    setAnnouncementBarContent,
    validationErrors,
    setValidationErrors,
  } = props;

  const handleTxtColor = (e) => {
    setTxtColor(e.target.value);
    setValidationErrors({ ...validationErrors, [e.target.id]: "" });
  };

  const handleBgColor = (e) => {
    setBgColor(e.target.value);
  };

  // const handleDisplaySettings = (e) => {
  //   setDisplaySettings({ ...displaySettings, [e.target.id]: e.target.checked });
  // };

  const handleAnnoncementBarCont = (e) => {
    setAnnouncementBarContent({
      ...announcementBarContent,
      [e.target.id]: e.target.value,
    });
    setValidationErrors({ ...validationErrors, [e.target.id]: "" });
  };

  return (
    <div className="announcementBarSec">
      {/* <div className="form-check spacing">
        <input
          className="checkboxInput"
          type="checkbox"
          value=""
          id="homePage"
          checked={displaySettings.homePage}
          onChange={handleDisplaySettings}
        />
        <label className="form-check-label" htmlFor="homePage">
          Show on home page only
        </label>
      </div> */}
      <div className="form-group spacing">
        <label htmlFor="annoncementBarTxt">Text</label>
        <textarea
          className="form-control"
          id="annoncementBarTxt"
          rows="3"
          value={announcementBarContent.annoncementBarTxt}
          onChange={handleAnnoncementBarCont}
          maxLength={120}
        ></textarea>
        {validationErrors.annoncementBarTxt && (
          <span className="errorValue">
            {validationErrors.annoncementBarTxt}
          </span>
        )}
        <label className="d-block">
          {announcementBarContent.annoncementBarTxt.length}/120
        </label>
      </div>

      <div className="form-group spacing">
        <label htmlFor="annoncementBarMobTxt">Text (Mobile)</label>
        <textarea
          className="form-control"
          id="annoncementBarMobTxt"
          rows="3"
          value={announcementBarContent.annoncementBarMobTxt}
          onChange={handleAnnoncementBarCont}
          maxLength={120}
        ></textarea>
        {validationErrors.annoncementBarMobTxt && (
          <span className="errorValue">
            {validationErrors.annoncementBarMobTxt}
          </span>
        )}
        <label className="d-block">
          {announcementBarContent.annoncementBarMobTxt.length}/120
        </label>
        <label style={{ whiteSpace: "normal" }}>
          Use this option to display alternate text on mobile. Recommended for
          shortening announcement text to make it suitable for mobile.
        </label>
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
        {validationErrors.bgLink && (
          <span className="errorValue">{validationErrors.bgLink}</span>
        )}
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
  );
};

export default AnnouncementFrom;
