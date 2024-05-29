import { useEffect } from "react";
import { createContext, React, useState } from "react";
import { useLocation } from "react-router-dom";
export const productContext = createContext();

const ProductContext = (props) => {
  const { children } = props;
  const location = useLocation();
  const [productDetails, setProductDetails] = useState({});
  const [variantsData, setVariantsData] = useState([]);
  const [variantDetails, setVariantDetails] = useState([]);
  const [activeTab, setActiveTab] = useState(location.pathname);

  useEffect(() => {
    setActiveTab(location.pathname);
  }, [location.pathname]);

  return (
    <productContext.Provider
      value={{
        productDetails,
        setProductDetails,
        variantsData,
        setVariantsData,
        variantDetails,
        setVariantDetails,
        activeTab,
        setActiveTab,
      }}
    >
      {children}
    </productContext.Provider>
  );
};

export default ProductContext;
