/* eslint-disable no-unused-vars */

import React, { useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import AddProductForm from "./AddProductForm";
import AdminSideBar from "./AdminSideBar";
import SwalErr from "./ErrorHandler";
import BackBtn from "../Components/BackBtn";

const AddProduct = () => {
  const [title, setTitle] = useState("");
  const [mainTitle, setMainTitle] = useState("");
  const [content, setContent] = useState("");
  const [locInputs, setLocInputs] = useState([]);
  const [modal1Show, setStoreShow] = useState(false);
  const [modal2Show, setSiteShow] = useState(false);
  const [modal3Show, setVariantShow] = useState(false);
  const [tracker, setTracker] = useState(false);
  const [chintalLoc, setChintalLoc] = useState(true);
  const [corporateLoc, setCorporateLoc] = useState(true);
  const [locValues, setLocValues] = useState(false);
  const [isShipping, setIsShipping] = useState(false);
  const [variantsThere, setVariants] = useState(false);
  const [isSKU, setIsSKU] = useState(false);
  const [error, setError] = useState(false);
  const [mainError, setMainError] = useState(false);
  const [handleLoc, setHandleLoc] = useState({
    cwos: false,
  });
  const [productPrices, setProductPrices] = useState({
    price: 0,
    comparePrice: 0,
    isTaxable: false,
    costPerItem: 0,
  });
  const [countriesList, setCountries] = useState();
  const [categoryItems, setCategoryItems] = useState([]);
  const [tags, setTags] = useState([]);
  const [images, setImages] = useState([]);
  const [vendors, setVendors] = useState();
  const [collections, setCollections] = useState([]);
  const [variants, setVariant] = useState([]);
  // const [isArrowDown, setIsArrowDown] = useState(false);

  const [variantsDetails, setVariantsDetials] = useState([]);
  const [variantGroup, setVariantsGroup] = useState("");
  const [subVariantsVisibility, setSubVariantsVisibility] = useState({});
  const [skuInput, setSkuInput] = useState({
    SKU: "",
    barcode: "",
  });
  const [weight, setWeight] = useState("0");
  const [weightUnit, setWeightUnit] = useState("kg");
  const [originCountry, setOriginCountry] = useState("");
  const [productStatus, setProductStatus] = useState("0");
  const [productCategory, setProductCategory] = useState({
    category: "",
    productType: "",
    vendor: "",
    brand: "0",
    minCartQty: 1,
    maxCartQty: 100,
  });

  const [tagValue, setTagValue] = useState([]);
  const [collectionValue, setCollectionValue] = useState([]);
  const [metaDetails, setMetaDetails] = useState({
    metaTitle: "",
    metaDescription: "",
    urlHandle: `${window.location.origin}/productItem`,
  });
  const [inventoryIdInfo, setInventoryId] = useState([]);

  const baseUrl = process.env.REACT_APP_API_URL;
  const jwtToken = process.env.REACT_APP_ADMIN_JWT_TOKEN;
  const token = Cookies.get(jwtToken);
  const localUrl = process.env.REACT_APP_LOCAL_URL;

  const navigate = useNavigate();

  const onSubmitProductDetails = async () => {
    try {
      const url = `${baseUrl}/product/add-store`;
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-type": "multipart/form-data",
      };

      if (mainTitle === "") {
        window.scrollTo(0, 0);
        setMainError("Main Title can’t be blank");
        return;
      } else {
        setMainError("");
      }

      if (title === "") {
        setError("Title can’t be blank");

        return;
      } else {
        setError("");
      }

      SwalErr.onLoading();

      const formdata = new FormData();
      const proVariants = [];
      variants.forEach((variant) => {
        if (!proVariants.includes(variant.optionName)) {
          proVariants.push(variant.optionName);
        }
      });

      images.forEach((file, i) => {
        formdata.append(`productImages`, file);
      });
      formdata.append("productMainTitle", mainTitle);
      formdata.append("productTitle", title);
      formdata.append("productInfo", content);
      formdata.append("productActiveStatus", productStatus);
      formdata.append("category", productCategory.category);
      formdata.append("productType", productCategory.productType);
      formdata.append("vendor", productCategory.vendor);
      formdata.append("brand", productCategory.brand);
      if (collectionValue.length > 1) {
        collectionValue.forEach((id) => {
          formdata.append("collections", JSON.stringify(id));
        });
      } else {
        collectionValue.push(0);
        collectionValue.forEach((id) => {
          formdata.append("collections", JSON.stringify(id));
        });
      }

      formdata.append("tags", JSON.stringify(tagValue));
      formdata.append("metaTitle", metaDetails.metaTitle);
      formdata.append("metaDescription", metaDetails.metaDescription);
      formdata.append("urlHandle", metaDetails.urlHandle);
      formdata.append("variantsThere", variantsThere);
      formdata.append("minCartQty", productCategory.minCartQty);
      formdata.append("maxCartQty", productCategory.maxCartQty);

      if (variantsThere) {
        variantsDetails.forEach((variant) => {
          formdata.append("variantImage", variant.main.variantImage);
          variant.sub.forEach((subVariant) => {
            formdata.append("variantImage", subVariant.variantImage);
          });
        });
        formdata.append("variantsOrder", JSON.stringify(proVariants));
        formdata.append("variants", JSON.stringify(variantsDetails));
        formdata.append("vInventoryInfo", JSON.stringify(inventoryIdInfo));
      } else {
        formdata.append("productPrice", productPrices.price);
        formdata.append("productComparePrice", productPrices.comparePrice);
        formdata.append("productIsTaxable", productPrices.isTaxable);
        formdata.append("productCostPerItem", productPrices.costPerItem);
        formdata.append("inventoryInfo", JSON.stringify(locInputs));
        formdata.append("cwos", handleLoc.cwos);
        formdata.append("skuCode", skuInput.SKU);
        formdata.append("skuBarcode", skuInput.barcode);
        formdata.append("productWeight", weight + " " + weightUnit);
        formdata.append("originCountry", originCountry);
      }
      await axios.post(url, formdata, { headers });
      SwalErr.onLoadingClose();
      SwalErr.onSuccess();
      navigate("/products");
    } catch (error) {
      SwalErr.onLoadingClose();
      SwalErr.onError(error);
    }
  };

  const deleteImg = async (imgFile, setFun) => {
    const filteredImgs = images.filter((img, i) => !imgFile.includes(i));
    setImages(filteredImgs);
    setFun([]);
  };
  const productProps = {
    categoryItems,
    setCategoryItems,
    title,
    mainTitle,
    error,
    mainError,
    setError,
    setMainError,
    setTitle,
    setMainTitle,
    setMetaDetails,
    metaDetails,
    setVariantsGroup,
    setVariantsDetials,
    variantsDetails,
    variants,
    setSubVariantsVisibility,
    subVariantsVisibility,
    content,
    setContent,
    images,
    setVariants,
    variantsThere,
    tracker,
    setTracker,
    setCollectionValue,
    setHandleLoc,
    handleLoc,
    setChintalLoc,
    setLocValues,
    locValues,
    setLocInputs,
    locInputs,
    setCorporateLoc,
    setIsShipping,
    isShipping,
    setVariant,
    setProductPrices,
    productPrices,
    setSkuInput,
    skuInput,
    setWeight,
    setProductCategory,
    productCategory,
    setTagValue,
    setImages,
    variantGroup,
    setSiteShow,
    modal2Show,
    modal1Show,
    setStoreShow,
    setVariantShow,
    modal3Show,
    productStatus,
    setProductStatus,
    originCountry,
    setOriginCountry,
    weight,
    weightUnit,
    setWeightUnit,
    setIsSKU,
    isSKU,
    chintalLoc,
    corporateLoc,
    collectionValue,
    tagValue,
    deleteImg,
    inventoryIdInfo,
    setInventoryId,
  };

  return (
    <div className="adminSec">
      <AdminSideBar />
      <div className="commonSec">
        <div className="addProductSection">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="d-flex align-items-center">
                  <BackBtn onClick={() => navigate(-1)} />
                  <h3>Add Product</h3>
                </div>
              </div>
              <AddProductForm productProps={productProps} />
              <div className="col-12">
                <div className="btnCont">
                  <button onClick={onSubmitProductDetails} className="adminBtn">
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
