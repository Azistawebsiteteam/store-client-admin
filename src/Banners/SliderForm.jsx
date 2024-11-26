import React from "react";
import moment from "moment";
import { FaUpload } from "react-icons/fa";

const SliderForm = (props) => {
  const { setImgDetails, imgDetails, setimgValue, imgValue } = props;

  const handleImgDetails = (e) => {
    if (e.target.name === "publish") {
      if (e.target.value === "1") {
        setImgDetails({
          ...imgDetails,
          startTime: "",
          endTime: "",
          isDefault: 1,
        });
      } else {
        setImgDetails({ ...imgDetails, isDefault: 0 });
      }
    } else {
      setImgDetails({ ...imgDetails, [e.target.id]: e.target.value });
    }
  };

  const handleBannerImg = (e) => {
    const { id, files } = e.target;

    // Create a new FileReader to read the file as a Data URL
    const reader = new FileReader();
    reader.readAsDataURL(files[0]);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result; // Set the image src to the file's data URL

      // Once the image loads, get the dimensions
      img.onload = () => {
        const width = img.naturalWidth;
        const height = img.naturalHeight;

        if (id === "webBanner" && width !== 1350 && height !== 500) {
          alert("Image dimensions should be 1350x500px");
          return;
        }
        // Update state or do something with the file and its dimensions
        else if (id === "mobileBanner" && width !== 400 && height !== 500) {
          alert("Image dimensions should be 400x500px");
          return;
        }
        setimgValue({ ...imgValue, [id]: files[0] });
      };
    };
  };

  const currentDate = new Date();
  const formattedDate = currentDate.toISOString().split("T")[0]; // Extract date part
  const formattedTime = currentDate.toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
  }); // Format time
  const today = `${formattedDate}T${formattedTime}`;

  return (
    <>
      <div className="col-sm-8">
        <div className="row">
          <div className="col-sm-12">
            <div className="bgStyle">
              <label className="heading" htmlFor="bannerType">
                Banner Type
              </label>
              <select
                id="bannerType"
                className="form-select"
                aria-label="Default select example"
                value={imgDetails.bannerType}
                onChange={handleImgDetails}
              >
                <option>Select Banner type</option>
                <option value="slider">Slider Banner</option>
                <option value="product">Product Banner</option>
              </select>
              <div className="form-group">
                <label className="heading" htmlFor="title">
                  Title
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="title"
                  maxLength="70"
                  value={imgDetails.title}
                  onChange={handleImgDetails}
                />
                <p className="infoTxt">
                  {imgDetails.title.length} of 70 characters used
                </p>
              </div>
              <div className="form-group">
                <label className="heading" htmlFor="description">
                  Short write up
                </label>
                <textarea
                  id="description"
                  className="form-control"
                  maxLength="100"
                  onChange={handleImgDetails}
                  value={imgDetails.description}
                ></textarea>
                <p className="infoTxt">
                  {imgDetails.description.length} of 100 characters used
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="bgStyle">
          <h6>Featured Image</h6>
          <div className="row">
            <div className="col-sm-8">
              <div className="form-group">
                <label className="heading">Image</label>
                <div className="drop-zone">
                  {imgValue.webBanner ? (
                    typeof imgValue.webBanner === "string" ? (
                      <img
                        src={imgValue.webBanner}
                        alt="Banner"
                        className="wImg"
                      />
                    ) : (
                      <img
                        src={URL.createObjectURL(imgValue.webBanner)}
                        alt="Banner"
                        className="wImg"
                      />
                    )
                  ) : (
                    <label className="dropZoneOverlay">
                      <FaUpload /> Drop file here or click to upload
                    </label>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="FileUpload"
                    id="webBanner"
                    onChange={handleBannerImg}
                  />
                </div>
              </div>
            </div>

            <div className="col-sm-4">
              <div className="form-group">
                <div className="">
                  <label className="heading">Mobile image</label>
                </div>
                <div className="drop-zone">
                  {imgValue.mobileBanner ? (
                    typeof imgValue.mobileBanner === "string" ? (
                      <img
                        src={imgValue.mobileBanner}
                        alt="Banner"
                        className="mImg"
                      />
                    ) : (
                      <img
                        src={URL.createObjectURL(imgValue.mobileBanner)}
                        alt="Banner"
                        className="mImg"
                      />
                    )
                  ) : (
                    <label
                      className="dropZoneOverlay"
                      style={{ whiteSpace: "normal" }}
                    >
                      <FaUpload /> Drop file here or click to upload
                    </label>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="FileUpload"
                    id="mobileBanner"
                    onChange={handleBannerImg}
                  />
                </div>
              </div>
            </div>

            <div className="col-sm-12 mt-3 mb-3">
              <div className="image_size">
                <p className="infoTxt mb-0">
                  <strong>Image:</strong> We recommend using an image size of
                  1350px x 500px. This size is optimal htmlFor displaying the
                  slideshow on larger screens and ensuring high-quality visuals
                </p>
                <p className="infoTxt">
                  <strong>Mobile image:</strong> By default, the slideshow will
                  utilize the main slide image on mobile devices. We recommend
                  using an image size of 400px x 500px.
                </p>
              </div>
            </div>

            <div className="col-sm-12">
              <div className="form-group">
                <label className="heading" htmlFor="altText">
                  Alt text
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={imgDetails.altText}
                  onChange={handleImgDetails}
                  id="altText"
                  maxLength="70"
                />
                <p className="infoTxt">of 70 characters used</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-sm-4">
        <div className="bgStyle">
          <h6>Visibility</h6>
          <div className="d-flex align-items-center">
            <input
              type="radio"
              id="publishNow"
              name="publish"
              value={1}
              checked={imgDetails.isDefault === 1}
              onChange={handleImgDetails}
            />
            <label className="radioBtnStylings pb-0" htmlFor="publishNow">
              Publish Now
            </label>
          </div>
          <div className="d-flex align-items-center">
            <input
              type="radio"
              id="schedulePublish"
              name="publish"
              value={0}
              checked={imgDetails.isDefault === 0}
              onChange={handleImgDetails}
            />
            <label className="radioBtnStylings pb-0" htmlFor="schedulePublish">
              Schedule Publish
            </label>
          </div>
          <p className="infoTxt mb-3 mt-3">
            In summary, "Publish Now" ensures immediate availability, while
            "Schedule Publish" allows you to plan and release your content at a
            later, predetermined time.
          </p>
          {imgDetails.isDefault === 0 && (
            <div className="schedulevisbilty">
              <div className="form-group">
                <label className="heading" htmlFor="startTime">
                  Start Time
                </label>
                <input
                  id="startTime"
                  type="datetime-local"
                  className="form-control"
                  min={today}
                  max={moment(imgDetails.endTime).format("YYYY-MM-DDTHH:mm")}
                  value={moment(imgDetails.startTime).format(
                    "YYYY-MM-DDTHH:mm"
                  )}
                  onChange={handleImgDetails}
                />
              </div>
              <div className="form-group mt-3">
                <label className="heading" htmlFor="endTime">
                  End Time
                </label>
                <input
                  id="endTime"
                  type="datetime-local"
                  className="form-control"
                  min={moment(imgDetails.startTime).format("YYYY-MM-DDTHH:mm")}
                  value={moment(imgDetails.endTime).format("YYYY-MM-DDTHH:mm")}
                  onChange={handleImgDetails}
                />
              </div>
            </div>
          )}
        </div>

        <div className="bgStyle">
          <h6>Call to action</h6>
          <div className="">
            <label className="heading" htmlFor="backgroundUrl">
              Link
            </label>
            <input
              className="d-block form-control"
              type="text"
              value={imgDetails.backgroundUrl}
              onChange={handleImgDetails}
              id="backgroundUrl"
            />
          </div>
          <p className="infoTxt mt-3">
            In summary "Background Link" refers to url of background images in
            slider section, while "Buttons" refers to buttons which appear on
            slider.
          </p>
        </div>
      </div>
    </>
  );
};

export default SliderForm;
