import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';


import App from './App';
import 'bootstrap/dist/css/bootstrap.css';
import ProductContext from './Context/ProductContext';



const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <BrowserRouter>
    <ProductContext>
      <App />
    </ProductContext>
  </BrowserRouter>
);


