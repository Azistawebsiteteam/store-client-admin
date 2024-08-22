import React from "react";
import { v4 } from "uuid";

import { AddIcon, RemoveIcon } from "./Icons";
import { FaRegFileImage } from "react-icons/fa";
import "./compont.css";

const Features = (props) => {
  const {
    features,
    setFeatures,
    deleteFeatures,
    setDeletedFeatures,
    setIsChangesOccur,
  } = props;
  const addFeature = () => {
    setIsChangesOccur(true);
    setFeatures([
      ...features,
      {
        id: v4(),
        title: "",
        image: "",
      },
    ]);
  };

  const removeFeature = (id) => {
    setIsChangesOccur(true);
    if (typeof id === "number") {
      setDeletedFeatures([...deleteFeatures, id]);
    }
    const updateIngs = features.filter((feature) => feature.id !== id);
    setFeatures(updateIngs);
  };

  const handleFeatruesValues = (e, ingId) => {
    setIsChangesOccur(true);
    const { id, value, files } = e.target;
    const updatefeatures = features.map((feature) => {
      if (feature.id === ingId) {
        if (files) {
          return { ...feature, image: files[0] };
        } else {
          return { ...feature, [id]: value };
        }
      } else {
        return feature;
      }
    });
    setFeatures(updatefeatures);
  };
  //div className='faq-bgStyle'

  return (
    <>
      <div className="row">
        {features.map((feature) => (
          <div className="col-6 col-md-3" key={feature.id}>
            <div className="feature-container">
              <div className="cross-icon">
                <RemoveIcon onClick={(e) => removeFeature(feature.id)} />
              </div>
              <div className="file-contaner">
                <div className="img-icon">
                  {feature.image ? (
                    typeof feature.image === "string" ? (
                      <img
                        src={feature.image}
                        alt="Banner"
                        className="feature-img"
                      />
                    ) : (
                      <img
                        src={URL.createObjectURL(feature.image)}
                        alt="Banner"
                        className="feature-img"
                      />
                    )
                  ) : (
                    <FaRegFileImage className="feature-img" />
                  )}
                </div>
                <div className="img-input">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFeatruesValues(e, feature.id)}
                    id="webBanner"
                  />
                </div>
              </div>
              <label className="fea-lable" htmlFor="title">
                Title
              </label>
              <input
                id="title"
                type="text"
                className="form-control"
                placeholder="Enter Title here"
                maxLength="50"
                value={feature.title}
                onChange={(e) => handleFeatruesValues(e, feature.id)}
              />
              <p className="infoTxt">
                {feature.title.length} of 50 characters used
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="col-6 text-end">
        <AddIcon onClick={addFeature} />
      </div>
    </>
  );
};

export default Features;
