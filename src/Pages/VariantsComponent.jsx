import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";

const VariantsComponent = () => {
  const [variants, setVariants] = useState([]);

  const addVariant = () => {
    if (variants.length < 3) {
      setVariants((prev) => [
        ...prev,
        {
          id: uuidv4(),
          optionName: "size",
          optionVal: [""],
          isDone: false,
        },
      ]);
    }
  };

  const handleOptionName = (e, variantId) => {
    const { value } = e.target;
    setVariants((prevVariants) =>
      prevVariants.map((variant) => {
        if (variant.id === variantId) {
          return { ...variant, optionName: value };
        }
        return variant;
      })
    );
  };

  const handleOptionVal = (e, i, id) => {
    const { value } = e.target;
    const shadowCopy = [...variants];
    const reqVarInd = shadowCopy.findIndex((eachVar) => eachVar.id === id);
    shadowCopy[reqVarInd].optionVal[i] = value;
    if (value.length === 1) {
      shadowCopy[reqVarInd].optionVal.push("");
      setVariants(shadowCopy);
    }
    setVariants(shadowCopy);
  };

  const onSubmitVariant = (e, id) => {
    // const varVal = variants.find(variant => variant.id === id);
    // if (varVal.optionVal === '') {
    //     alert('Please enter a value');
    //     return; // Prevent further execution if optionVal is empty
    // }

    setVariants((prevVal) =>
      prevVal.map((eachVar) => {
        return eachVar.id === id ? { ...eachVar, isDone: true } : eachVar;
      })
    );
  };
  const editVariant = (e, id) => {
    setVariants((prevVal) =>
      prevVal.map((eachVar) =>
        eachVar.id === id ? { ...eachVar, isDone: false } : eachVar
      )
    );
  };
  return (
    <div className="newVariant">
      {variants.map((variant, id) => (
        <div key={id} className="">
          <div className="">
            {variant.isDone ? (
              <span key={id}>{variant.optionName}</span>
            ) : (
              <div key={variant.id}>
                <label htmlFor={variant.id}>Option name</label>
                <select
                  id={variant.id}
                  value={variant.optionName}
                  onChange={(e) => handleOptionName(e, variant.id)}
                >
                  <option value="size">Size</option>
                  <option value="color">Color</option>
                  <option value="material">Material</option>
                  <option value="flavour">Flavour</option>
                </select>
              </div>
            )}
          </div>
          <div>
            {variant.isDone ? (
              variant.optionVal.map(
                (eachVal, i) =>
                  eachVal !== "" && (
                    <div key={i}>
                      <span key={i}>{eachVal}</span>
                    </div>
                  )
              )
            ) : (
              <div>
                {variant.optionVal.map((eachVal, i) => (
                  <div key={i}>
                    <label htmlFor={i}>Option Value</label>
                    <input
                      id={i}
                      type="text"
                      onChange={(e) => handleOptionVal(e, i, variant.id)}
                      value={eachVal}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {variant.isDone ? (
            <button onClick={(e) => editVariant(e, variant.id)}>Edit</button>
          ) : (
            <button onClick={(e) => onSubmitVariant(e, variant.id)}>
              Done
            </button>
          )}
        </div>
      ))}
      {variants.length < 3 && (
        <button onClick={addVariant}>+ Add another option</button>
      )}
    </div>
  );
};

export default VariantsComponent;
