import { useEffect } from "react";
import { useContext } from "react";
import { createContext, React, useState } from "react";
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

  useEffect(() => {
    setActiveTab(location.pathname);
  }, [location.pathname]);

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
