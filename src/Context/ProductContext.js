import { createContext, React, useState } from "react";
export const productContext = createContext();

const ProductContext = (props) => {
    const { children } = props

    const [productDetails, setProductDetails] = useState({})
    const [variantsData, setVariantsData] = useState([])
    const [variantDetails, setVariantDetails] = useState([])
    const [activeTab, setActiveTab] = useState('tab1')


    return (
        <productContext.Provider
            value={{
                productDetails, setProductDetails, variantsData, setVariantsData, variantDetails, setVariantDetails, activeTab, setActiveTab
            }}
        >
            {children}
        </productContext.Provider>
    )
}

export default ProductContext