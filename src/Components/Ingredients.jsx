import React from "react";
import { v4 } from "uuid";

import { FaRegFileImage } from "react-icons/fa";
import { AddIcon, RemoveIcon } from "./Icons";

const Ingredients = (props) => {
  const {
    ingredients,
    setIngredients,
    deleteIngredient,
    setDeletedIngredient,
    setIsChangesOccur,
  } = props;

  const addIngredient = () => {
    setIsChangesOccur(true);
    setIngredients([
      ...ingredients,
      { id: v4(), title: "", description: "", image: "" },
    ]);
  };

  const removeIngredient = (id) => {
    setIsChangesOccur(true);
    if (typeof id === "number") {
      setDeletedIngredient([...deleteIngredient, id]);
    }
    const updateIngs = ingredients.filter((ing) => ing.id !== id);
    setIngredients(updateIngs);
  };

  const handleIngrediantValues = (e, ingId) => {
    setIsChangesOccur(true);
    const { id, value, files } = e.target;
    const updateIngs = ingredients.map((ing) => {
      if (ing.id === ingId) {
        if (files) {
          return { ...ing, image: files[0] };
        } else {
          return { ...ing, [id]: value };
        }
      } else {
        return ing;
      }
    });
    setIngredients(updateIngs);
  };
  //div className='faq-bgStyle '
  return (
    <>
      <div className="row">
        {ingredients.map((ing) => (
          <div className="col-6 col-md-4" key={ing.id}>
            <div className="ingrident-containers">
              <div className="cross-icon">
                <RemoveIcon onClick={(e) => removeIngredient(ing.id)} />
              </div>
              <div className="file-contaner ing-img-container">
                <div className="img-icon">
                  {ing.image ? (
                    typeof ing.image === "string" ? (
                      <img
                        src={ing.image}
                        alt="Banner"
                        className="feature-img"
                      />
                    ) : (
                      <img
                        src={URL.createObjectURL(ing.image)}
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
                    onChange={(e) => handleIngrediantValues(e, ing.id)}
                    className="FileUpload"
                    id="webBanner"
                  />
                </div>
              </div>
              <div className="d-flex align-items-center">
                <label className="heading" htmlFor="title">
                  Title :
                </label>
                <input
                  id="title"
                  type="text"
                  className="form-control"
                  placeholder="Enter Title here"
                  maxLength="50"
                  value={ing.title}
                  onChange={(e) => handleIngrediantValues(e, ing.id)}
                />
              </div>
              <>
                <p className="infoTxt">
                  {ing.title.length} of 50 characters used
                </p>
              </>
              <div className="form-group">
                <label className="heading" htmlFor="description">
                  Description
                </label>
                <textarea
                  id="description"
                  className="form-control"
                  cols="50"
                  rows="4"
                  maxLength="200"
                  onChange={(e) => handleIngrediantValues(e, ing.id)}
                  value={ing.description}
                ></textarea>
                <p className="infoTxt">
                  {ing.description.length} of 200 characters used
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="col-6 text-end">
        <AddIcon onClick={addIngredient} />
      </div>
    </>
  );
};

export default Ingredients;
