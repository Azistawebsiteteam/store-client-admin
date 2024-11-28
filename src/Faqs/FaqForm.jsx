import React from "react";
import { ProductState } from "../Context/ProductContext";

const FaqForm = (props) => {
  const { inputValues, setInputValues, validationErrors, setValidationErrors } =
    props;
  const { allProducts } = ProductState();
  const faqTypes = [
    "General",
    "Order",
    "Tracking",
    "Payment",
    "Return",
    "Product",
  ];

  const handleinputVlaues = (e) => {
    const { id, value } = e.target;

    setInputValues({ ...inputValues, [id]: value });
    setValidationErrors({ ...validationErrors, [id]: "" });
  };

  return (
    <div className="row faq-bgStyle">
      <div className="form-group col-sm-12 col-md-6">
        <label className="heading" htmlFor="type">
          Faq Type
        </label>
        <select
          id="type"
          className="form-select"
          aria-label="Default select example"
          value={inputValues.type}
          onChange={handleinputVlaues}
        >
          <option value="">Select Faq type</option>
          {faqTypes.map((faqType, i) => (
            <option key={i} value={faqType}>
              {faqType}
            </option>
          ))}
        </select>
        {validationErrors.type && (
          <span className="errorValue">{validationErrors.type}</span>
        )}
      </div>
      {inputValues.type === "Product" && (
        <div className="form-group col-sm-12 col-md-6">
          <label className="heading" htmlFor="productId">
            Select Product
          </label>
          <select
            id="productId"
            className="form-select"
            aria-label="Default select example"
            value={inputValues.productId}
            onChange={handleinputVlaues}
          >
            <option value={0}>Select Product</option>
            {allProducts.map((p) => (
              <option key={p.product_id} value={p.product_id}>
                {p.product_title}
              </option>
            ))}
          </select>
          {validationErrors.productId && (
            <span className="errorValue">{validationErrors.productId}</span>
          )}
        </div>
      )}
      <div className="form-group col-sm-12 form-group">
        <label className="heading" htmlFor="question">
          Question
        </label>
        <input
          type="text"
          className="form-control"
          id="question"
          maxLength="100"
          value={inputValues.question}
          onChange={handleinputVlaues}
        />
        {validationErrors.question && (
          <span className="errorValue">{validationErrors.question}</span>
        )}
        <p className="infoTxt">
          {inputValues.question.length} of 100 characters used
        </p>
      </div>
      <div className="col-sm-12 form-group">
        <label className="heading" htmlFor="answer">
          Answer
        </label>
        <textarea
          id="answer"
          className="form-control"
          cols="60"
          rows="8"
          maxLength="1000"
          onChange={handleinputVlaues}
          value={inputValues.answer}
        ></textarea>
        {validationErrors.answer && (
          <span className="errorValue">{validationErrors.answer}</span>
        )}
        <p className="infoTxt">
          {inputValues.answer.length} of 1000 characters used
        </p>
      </div>
    </div>
  );
};

export default FaqForm;
