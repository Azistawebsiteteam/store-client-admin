import React from 'react';
import { ProductState } from '../Context/ProductContext';

const FaqForm = (props) => {
  const { inputVlaues, setInputValues } = props;
  console.log(inputVlaues);
  const { allProducts } = ProductState();
  const faqTypes = [
    'General',
    'Order',
    'Tracking',
    'Payment',
    'Return',
    'Product',
  ];

  const handleinputVlaues = (e) => {
    const { id, value } = e.target;

    setInputValues({ ...inputVlaues, [id]: value });
  };

  return (
    <div className='row faq-bgStyle'>
      <div className='col-sm-12 col-md-6'>
        <label className='heading' htmlFor='type'>
          Faq Type
        </label>
        <select
          id='type'
          className='form-select'
          aria-label='Default select example'
          value={inputVlaues.type}
          onChange={handleinputVlaues}>
          <option value=''>Select Faq type</option>
          {faqTypes.map((faqType, i) => (
            <option key={i} value={faqType}>
              {faqType}
            </option>
          ))}
        </select>
      </div>
      {inputVlaues.type === 'Product' && (
        <div className='col-sm-12 col-md-6'>
          <label className='heading' htmlFor='productId'>
            Select Product
          </label>
          <select
            id='productId'
            className='form-select'
            aria-label='Default select example'
            value={inputVlaues.productId}
            onChange={handleinputVlaues}>
            <option value={0}>Select Product</option>
            {allProducts.map((p) => (
              <option key={p.product_id} value={p.product_id}>
                {p.product_title}
              </option>
            ))}
          </select>
        </div>
      )}
      <div className='col-sm-12 form-group'>
        <label className='heading' htmlFor='question'>
          Question
        </label>
        <input
          type='text'
          className='form-control'
          id='question'
          maxLength='100'
          value={inputVlaues.question}
          onChange={handleinputVlaues}
        />
        <p className='infoTxt'>
          {inputVlaues.question.length} of 100 characters used
        </p>
      </div>
      <div className='col-sm-12 form-group'>
        <label className='heading' htmlFor='answer'>
          Answer
        </label>
        <textarea
          id='answer'
          className='form-control'
          cols='60'
          rows='8'
          maxLength='1000'
          onChange={handleinputVlaues}
          value={inputVlaues.answer}></textarea>
        <p className='infoTxt'>
          {inputVlaues.answer.length} of 1000 characters used
        </p>
      </div>
    </div>
  );
};

export default FaqForm;
