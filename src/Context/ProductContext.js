import { createContext, React, useState } from "react";
export const productContext = createContext();

const ProductContext = (props) => {
    const { children } = props

    const [productDetails, setProductDetails] = useState({})
    const [variantsData, setVariantsData] = useState([])
    const [variantDetails, setVariantDetails] = useState([])

    return (
        <productContext.Provider
            value={{
                productDetails, setProductDetails, variantsData, setVariantsData, variantDetails, setVariantDetails
            }}
        >
            {children}
        </productContext.Provider>
    )
}

export default ProductContext