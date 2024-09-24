import React, { createContext, useState, useEffect, useContext } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { useLocation } from "react-router-dom";

const ProductContext = createContext();

const ProductContextProvider = (props) => {
  const { children } = props;
  const location = useLocation();
  const [productDetails, setProductDetails] = useState({});
  const [variantsData, setVariantsData] = useState([]);
  const [variantDetails, setVariantDetails] = useState([]);
  const [dropdownItems, setDropdownItems] = useState(false);
  const [activeTab, setActiveTab] = useState(location.pathname);
  const [allProducts, setAllProducts] = useState([]);

  useEffect(() => {
    setActiveTab(location.pathname);
  }, [location.pathname]);

  const baseUrl = process.env.REACT_APP_API_URL;
  const jwtToken = process.env.REACT_APP_ADMIN_JWT_TOKEN;
  const token = Cookies.get(jwtToken);

  useEffect(() => {
    const productDetails = async () => {
      try {
        const productsUrl = `${baseUrl}/product/all-products`;
        const headers = {
          Authorization: `Bearer ${token} `,
        };
        const response = await axios.post(productsUrl, {}, { headers });
        setAllProducts(response.data.products);
      } catch (error) {}
    };
    productDetails();
  }, [token, baseUrl]);

  return (
    <ProductContext.Provider
      value={{
        productDetails,
        setProductDetails,
        variantsData,
        setVariantsData,
        variantDetails,
        setVariantDetails,
        activeTab,
        setActiveTab,
        dropdownItems,
        setDropdownItems,
        allProducts,
        setAllProducts,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export default ProductContextProvider;

export const ProductState = () => {
  return useContext(ProductContext);
};
