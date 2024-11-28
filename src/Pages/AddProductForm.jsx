/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useCallback } from "react";

import { Link, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import { v4 } from "uuid";
import { useMemo } from "react";
import TextEditor from "./TextEditor";
import { FaPlus } from "react-icons/fa6";
// import PopupModal from "./PopupModal";
// import Button from "react-bootstrap/Button";
import Multiselect from "multiselect-react-dropdown";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaRegFileImage } from "react-icons/fa";
import { IoMdArrowDropup } from "react-icons/io";
import { ProductState } from "../Context/ProductContext";
import { MdDelete } from "react-icons/md";
import ErrorHandler, { showToast } from "./ErrorHandler";
import VariantEdit from "./VariantEdit";
import { FiPlusCircle } from "react-icons/fi";
import "./Admin.css";

const AddProductForm = ({
  productProps,
  validationErrors,
  setValidationErrors,
}) => {
  const location = useLocation();
  const {
    categoryItems,
    setCategoryItems,
    title,
    mainTitle,
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
    collectionValue,
    setHandleLoc,
    handleLoc,
    setLocInputs,
    locInputs,
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
    returnAccept,
    setReturnAccept,
    returnDays,
    setReturnDays,
    setTagValue,
    tagValue,
    setImages,
    variantGroup,
    // setSiteShow,
    // modal2Show,
    // modal1Show,
    // setStoreShow,
    productStatus,
    setProductStatus,
    weight,
    weightUnit,
    setWeightUnit,
    setIsSKU,
    isSKU,
    deleteImg,
    inventoryIdInfo,
    setInventoryId,
  } = productProps;

  const [imgFile, setImgFile] = useState([]);

  const [subCategories, setSubCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [modalVariantId, setModalVariantId] = useState(null);
  const [brands, setBrands] = useState([]);
  const [vendors, setVendors] = useState();
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedColletions] = useState([]);
  const [selectedTag, setSelectedTag] = useState([]);
  const [inventoryLocs, setInventoryLocs] = useState([]);

  const baseUrl = process.env.REACT_APP_API_URL;
  const jwtToken = process.env.REACT_APP_ADMIN_JWT_TOKEN;
  const token = Cookies.get(jwtToken);

  // const handleVariantClick = (variantId) => {
  //   setModalVariantId(variantId);
  // };
  const handleModalClose = () => {
    setModalVariantId(null);
  };

  useEffect(() => {
    const apiCallback = async () => {
      const categoryUrl = `${baseUrl}/category/data`;
      const tagsUrl = `${baseUrl}/tags/data`;
      const vendorUrl = `${baseUrl}/vendors/details`;
      const collectionsUrl = `${baseUrl}/collections/data`;
      const brandsUrl = `${baseUrl}/brands/data`;
      const locationsUrl = `${baseUrl}/inventory`;
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      // const countriesUrl = `https://countriesnow.space/api/v0.1/countries/capital`;
      try {
        const [
          categoryList,
          tagsList,
          vendorsList,
          locationsResponse,
          collectionsList,
          brandsList,
        ] = await Promise.all([
          axios.get(categoryUrl),
          axios.get(tagsUrl),
          axios.get(vendorUrl, { headers }),
          axios.get(locationsUrl),
          axios.get(collectionsUrl),
          axios.get(brandsUrl),
        ]);

        if (locationsResponse.status === 200) {
          setInventoryLocs(locationsResponse.data);
          setInventoryId(locationsResponse.data.map((inv) => inv.inventory_id));
        }

        if (categoryList.status === 200) {
          setCategoryItems(categoryList.data);
        }
        if (tagsList.status === 200) {
          setTags(tagsList.data);
        }

        if (vendorsList.status === 200) {
          setVendors(vendorsList.data);
        }
        if (collectionsList.status === 200) {
          setCollections(collectionsList.data);
        }
        if (brandsList.status === 200) {
          setBrands(brandsList.data);
        }
      } catch (error) {
        ErrorHandler.onError(error);
      }
    };
    apiCallback();
  }, [baseUrl, token]);

  useEffect(() => {
    const selectedCollections = collections.filter((collection) =>
      collectionValue.includes(collection.azst_collection_id)
    );
    setSelectedColletions(selectedCollections);
    const selectedTags = tags.filter((tag) =>
      tagValue.includes(tag.azst_tag_name)
    );
    setSelectedTag(selectedTags);
  }, [collectionValue, tagValue, collections, tags]);

  const { variantDetails } = ProductState();

  const generateOptions = useCallback(() => {
    const result = [];
    const mainOptionsObj = variants.find((v) => v.optionName === variantGroup);

    if (variants.length > 0 && mainOptionsObj && mainOptionsObj.isDone) {
      const mainOptions = mainOptionsObj.optionValue;
      const remainingVariants = variants.filter(
        (v) => v.optionName !== variantGroup
      );

      mainOptions.forEach((mainOption) => {
        if (mainOption !== "") {
          const subAvail = variantDetails.filter(
            (v) =>
              v.option1 === mainOption ||
              v.option2 === mainOption ||
              v.option3 === mainOption
          );

          let offer_price_array = [];
          subAvail.map((eachArr) =>
            offer_price_array.push(parseInt(eachArr.offer_price))
          );

          let main = {};
          if (subAvail.length > 1) {
            main = {
              id: v4(),
              variantId: 0,
              value: mainOption,
              variantImage: subAvail[0]?.variant_image[0] ?? "",
              offer_price: `${Math.min(...offer_price_array)} - ${Math.max(
                ...offer_price_array
              )}`,
              comparePrice: 0,
              quantity: subAvail.reduce(
                (acc, v) => acc + parseInt(v.variant_qty || 0),
                0
              ),

              hsCode: "",
              barcode: "",
              skuCode: "",
              isTaxable: false,
              shippingRequired: false,
              inventoryId: 0,
              inventoryPolicy: "",
              variantService: "",
            };
          } else {
            const mainV = subAvail[0];
            const { id, offer_price, comparePrice } = mainV ?? {};
            main = {
              id: v4(),
              variantId: id || 0,
              value: mainOption,
              variantImage: "",
              offer_price: offer_price || 0,
              comparePrice: comparePrice || 0,
              quantity: subAvail.reduce(
                (acc, v) => acc + parseInt(v.variant_qty || 0),
                0
              ),
              hsCode: "",
              barcode: "",
              skuCode: "",
              isTaxable: false,
              shippingRequired: false,
              inventoryId: 0,
              inventoryPolicy: "",
              variantService: "",
            };
          }
          const sub = [];

          const recursiveGenerateSubOptions = (currentIndex, subVariant) => {
            if (currentIndex === remainingVariants.length) {
              const subV = subAvail.find((v) => {
                // Check if subVariant includes all options of subV
                return (
                  (v.option1 && subVariant.includes(v.option1)) ||
                  (v.option2 && subVariant.includes(v.option2)) ||
                  (v.option3 && subVariant.includes(v.option3))
                );
              });
              // Alternatively, you can wrap it in a function
              function toBoolean(value) {
                return value !== 0 && value !== null && value !== undefined;
              }

              if (subV) {
                const variants = subVariant.join("-").replace(/^-*|-*$/g, "");
                sub.push({
                  id: v4(),
                  variantId: subV.id,
                  value: variants,
                  variantImage: subV.variant_image[1] || "",
                  offer_price: subV.offer_price,
                  comparePrice: subV.compare_at_price,
                  quantity: subV.variant_qty,
                  hsCode: subV.variant_HS_code,
                  barcode: subV.variant_barcode,
                  skuCode: subV.variant_sku,
                  isTaxable: toBoolean(subV.variant_taxable),
                  shippingRequired: toBoolean(subV.variant_requires_shipping),
                  inventoryId: subV.variant_inventory_tracker,
                  inventoryPolicy: subV.variant_fulfillment_service,
                  variantService: subV.variant_fulfillment_service,
                });
              } else {
                const variants = subVariant.join("-");

                sub.push({
                  id: v4(),
                  variantId: "0",
                  value: variants,
                  variantImage: "",
                  offer_price: 0,
                  comparePrice: 0,
                  quantity: 0,
                  hsCode: "",
                  barcode: "",
                  skuCode: "",
                  isTaxable: false,
                  shippingRequired: false,
                  inventoryId: 0,
                  inventoryPolicy: "",
                  variantService: "",
                });
              }

              return;
            }

            remainingVariants[currentIndex].optionValue.forEach((subValue) => {
              if (subValue === "") return;
              recursiveGenerateSubOptions(currentIndex + 1, [
                ...subVariant,
                subValue,
              ]);
            });
          };

          if (remainingVariants.length > 0) {
            recursiveGenerateSubOptions(0, []);
          }

          result.push({ id: v4(), main, sub });
        }
      });
    }
    return result;
  }, [variants, variantGroup]);

  useMemo(() => {
    const variantsData = generateOptions();
    setVariantsDetials(variantsData);

    if (variants.length <= 1) {
      setVariantsGroup(variants[0]?.optionName || "");
    }
  }, [generateOptions, variants, variantGroup]);

  useEffect(() => {
    const getProductType = async () => {
      const url = `${baseUrl}/category/sub-categories`;
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.post(
        url,
        { categoryId: productCategory.category },
        { headers }
      );
      if (response.status === 200) {
        setSubCategories(response.data);
      }
    };
    getProductType();
  }, [productCategory.category]);

  const onSelectCollection = (selectedItem) => {
    setSelectedColletions(selectedItem);
    setCollectionValue(selectedItem.map((each) => each.azst_collection_id));
    setValidationErrors({ ...validationErrors, collectionValue: "" });
  };

  const handleConditions = (e) => {
    setHandleLoc({ ...handleLoc, [e.target.id]: e.target.checked });
  };

  const handleCorporateLoc = (e) => {
    if (e.target.checked) {
      setLocInputs([...locInputs, { inventoryId: e.target.id, qty: 0 }]);
    } else {
      const updatedIds = locInputs.filter(
        (inv) => inv.inventoryId !== e.target.id
      );
      setLocInputs(updatedIds);
    }
  };

  const handleLocationInputs = (e) => {
    const { id, value } = e.target;
    const newValue = parseInt(value, 10);
    if (!isNaN(newValue) && newValue >= 0) {
      const updatedQuantities = locInputs.map((inv) => {
        if (inv.inventoryId === id) {
          return { ...inv, qty: parseInt(value) };
        } else {
          return inv;
        }
      });

      setLocInputs(updatedQuantities);
    }
  };

  const handleSku = (e) => {
    setIsSKU(e.target.checked);
  };

  const handleShipping = () => {
    setIsShipping(!isShipping);
  };

  const handleVariantChange = (e, id) => {
    const variantExist = variants.find((v) => v.optionName === e.target.value);
    if (variantExist) {
      showToast(`${e.target.value} already selected Please Edit`);
    }
    if (!variantExist) {
      const newVariants = [...variants];
      const variantIndex = newVariants.findIndex((v) => v.id === id);
      newVariants[variantIndex].optionName = e.target.value;
      setVariant(newVariants);
    }
  };

  const onChangeVariantValue = (e, id, i) => {
    e.preventDefault();
    const newVariants = [...variants];
    const variantIndex = newVariants.findIndex((v) => v.id === id);
    newVariants[variantIndex].optionValue[i] = e.target.value;
    if (
      e.target.value.length === 1 &&
      newVariants[variantIndex].optionValue.length - 1 === i
    ) {
      newVariants[variantIndex].optionValue.push("");
      setVariant(newVariants);
    }
    setVariant(newVariants);
  };

  const deleteInput = (e, id, i) => {
    e.preventDefault();
    const newVariants = [...variants];
    const variantIndex = newVariants.findIndex((v) => v.id === id);
    newVariants[variantIndex].optionValue.splice(i, 1);
    setVariant(newVariants);
  };

  const changeOptionMode = (e, id) => {
    e.preventDefault();
    setVariant((preVariants) =>
      preVariants.map((variant) => {
        if (variant.id === id) {
          return { ...variant, isDone: !variant.isDone };
        }
        return variant;
      })
    );
  };

  const addVarient = (e) => {
    e.preventDefault();
    const count = variants.length;
    if (count < 3) {
      setVariant((prevVariants) => [
        ...prevVariants,
        {
          id: v4(),
          optionName: "",
          optionValue: [""],
          isDone: false,
        },
      ]);
    }
  };

  const deleteVariant = async (e, id) => {
    e.preventDefault();
    const count = variants.length;
    if (count > 0) {
      const updatedVariants = variants.filter((variant) => variant.id !== id);
      setVariant(updatedVariants);
    }
  };

  const handleProductPrices = (e) => {
    const { value, id, checked } = e.target;
    if (id === "isTaxable") {
      setProductPrices({ ...productPrices, [id]: checked });
    } else {
      const numericValue = value.replace(/[^0-9]/g, "");
      setProductPrices({ ...productPrices, [id]: numericValue });
      setValidationErrors({ ...validationErrors, [e.target.id]: "" });
    }
  };

  const handleSkuInput = (e) => {
    if (e.target.value.length < 50) {
      setSkuInput({ ...skuInput, [e.target.id]: e.target.value });
    }
  };

  const handleWeight = (e) => {
    const { value } = e.target;
    const numericValue = value.replace(/[^0-9]/g, "");
    if (numericValue.length <= 3) {
      setWeight(numericValue);
    }
  };
  const handleWeightUnit = (e) => {
    setWeightUnit(e.target.value);
  };

  const handleProductCategorization = (e) => {
    const { id, value } = e.target;
    if (id === "minCartQty" || id === "maxCartQty") {
      const numericValue = value.replace(/[^0-9]/g, "");
      setProductCategory({ ...productCategory, [id]: numericValue });
    } else {
      setProductCategory({ ...productCategory, [id]: value });
      setValidationErrors({ ...validationErrors, [e.target.id]: "" });
    }
  };

  const onSelectTag = (selectedItem) => {
    setSelectedTag(selectedItem);
    setTagValue(selectedItem.map((each) => each.azst_tag_name));
  };

  const onChangeImages = (e) => {
    const newFiles = Array.from(e.target.files);
    setImages([...newFiles, ...images]);
    setValidationErrors({ ...validationErrors, images: "" });
  };

  const handleVariantsImage = (e, vid, type, subId) => {
    setVariantsDetials(
      variantsDetails.map((eachVariant) => {
        if (eachVariant.id === vid) {
          if (type === "main") {
            return {
              ...eachVariant,
              main: { ...eachVariant.main, variantImage: e.target.files[0] },
            };
          } else {
            // Use map to return the updated sub-variants
            const updatedSubVariants = eachVariant.sub.map((subV) => {
              if (subV.id === subId) {
                return {
                  ...subV,
                  variantImage: e.target.files[0],
                };
              }
              return subV;
            });

            // Return the updated eachVariant with the updated sub-variants
            return {
              ...eachVariant,
              sub: updatedSubVariants,
            };
          }
        }
        return eachVariant;
      })
    );
  };

  const onChangeMainTitle = (e) => {
    setMainTitle(e.target.value);
    setMetaDetails({
      ...metaDetails,
      urlHandle: `http://20.235.149.149:5019/product/${e.target.value.replace(
        / /g,
        "-"
      )}`,
    });
    setValidationErrors({ ...validationErrors, mainTitle: "" });
  };

  const onChangeTitle = (e) => {
    setTitle(e.target.value);
    setValidationErrors({ ...validationErrors, title: "" });
  };

  const onchangeVariantGroupBy = (e) => {
    setVariantsGroup(e.target.value);
    setVariantsDetials(generateOptions());
  };

  const handleMetaDetails = (e) => {
    const { id, value } = e.target;

    if (id === "urlHandle" && value.length >= 35) {
      setMetaDetails({
        ...metaDetails,
        [id]: value.replace(/ /g, "-"),
      });
    } else if (id !== "urlHandle") {
      setMetaDetails({ ...metaDetails, [id]: value });
    }
  };

  const handleVariantsOutput = (e, vid, type, subId) => {
    const { value, id } = e.target;
    const numericVal = value.replace(/[^0-9]/g, "");
    setVariantsDetials(
      variantsDetails.map((eachVariant) => {
        if (eachVariant.id === vid) {
          if (type === "main") {
            return {
              ...eachVariant,
              main: { ...eachVariant.main, [id]: numericVal },
            };
          } else {
            // Use map to return the updated sub-variants
            const updatedSubVariants = eachVariant.sub.map((subV) => {
              if (subV.id === subId) {
                return {
                  ...subV,
                  [id]: numericVal,
                };
              }
              return subV;
            });
            const variantAmounts = updatedSubVariants.map((vari) =>
              !vari ? 0 : parseInt(vari.offer_price)
            );
            const mainQuantity = updatedSubVariants
              .map((vari) => parseInt(vari.quantity))
              .reduce(
                (accumulator, currentValue) => accumulator + currentValue,
                0
              );

            let updatedMainAmount;
            if (variantAmounts.length > 1) {
              updatedMainAmount = `${Math.min(...variantAmounts)} - ${Math.max(
                ...variantAmounts
              )}`;
            } else {
              updatedMainAmount = variantAmounts[0];
            }
            // Return the updated eachVariant with the updated sub-variants
            return {
              ...eachVariant,
              main: {
                ...eachVariant.main,
                offer_price: updatedMainAmount,
                quantity: mainQuantity,
              },
              sub: updatedSubVariants,
            };
          }
        }
        return eachVariant;
      })
    );
  };

  const handleVariantsvalues = (values, maniId, subId) => {
    setVariantsDetials(
      variantsDetails.map((eachVariant) => {
        if (eachVariant.id === maniId) {
          // Use map to return the updated sub-variants
          const updatedSubVariants = eachVariant.sub.map((subV) => {
            if (subV.id === subId) {
              return {
                ...subV,
                ...values,
              };
            }
            return subV;
          });
          // Return the updated eachVariant with the updated sub-variants
          return {
            ...eachVariant,
            sub: updatedSubVariants,
          };
        }
        return eachVariant;
      })
    );
  };

  const toggleSubVariantsVisibility = (variantId) => {
    setSubVariantsVisibility((prevState) => ({
      ...prevState,
      [variantId]: !prevState[variantId],
    }));
  };

  const selectImg = (e, id) => {
    if (e.target.checked) {
      setImgFile((prev) => [...prev, id]);
    } else {
      let selected = imgFile.filter((each) => each !== id);
      setImgFile(selected);
    }
  };
  const onDeleteImgs = (e) => {
    e.preventDefault();
    deleteImg(imgFile, setImgFile);
  };
  const renderVariantImage = (variantImage) => {
    if (variantImage) {
      if (typeof variantImage === "string") {
        return <img src={variantImage} className="vImg" alt="variantImage" />;
      } else if (variantImage instanceof Blob) {
        return (
          <img
            src={URL.createObjectURL(variantImage)}
            className="vImg"
            alt=""
          />
        );
      }
    }
    return <FaRegFileImage className="variantImgFile" />;
  };

  const renderVariantButton = (va) => (
    // onClick={() => setVariantShow(true)}
    // onClick={() => handleVariantClick(va.id)}
    // <Button variant="light">
    <label className="ms-1 text-dark">{va.value}</label>
    // </Button>
  );

  const renderVariantLink = (va) => (
    <Link to={`/variant-details/${va.variantId}`}>
      <label className="variantEditor text-dark" style={{ cursor: "pointer" }}>
        {va.value}
      </label>
    </Link>
  );

  const onChangeInventory = (e) => {
    const values = e.target.value;

    // If the value contains a comma, split it into an array of inventory IDs
    if (values.includes(",")) {
      // Remove any extra spaces from the individual IDs after the split
      const inventoryIds = values
        .split(",")
        .map((id) => id.trim())
        .filter((id) => id !== "");
      return setInventoryId(inventoryIds);
    }

    setInventoryId([values.trim()]);
  };

  const onChangeReturnAccept = (e) => {
    const { value } = e.target;
    setReturnAccept(value);
    if (value === "No") {
      setReturnDays(0);
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-sm-12 col-md-8">
          <div className="row">
            <div className="col-12">
              <div className="bgStyle">
                <form className="editorForm">
                  <div className="form-group" style={{ marginTop: "0" }}>
                    <label htmlFor="productMainTitle" className="formLabel">
                      Title
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      maxLength="200"
                      value={mainTitle}
                      onChange={onChangeMainTitle}
                      id="productMainTitle"
                      required
                    />
                    <span className="errorValue">
                      {validationErrors?.title}
                    </span>
                  </div>
                  <div className="form-group">
                    <label htmlFor="title" className="formLabel">
                      Short Title
                    </label>
                    <input
                      type="text"
                      maxLength="200"
                      className="form-control"
                      value={title}
                      onChange={onChangeTitle}
                      id="title"
                    />
                    <span className="errorValue">
                      {validationErrors.mainTitle}
                    </span>
                  </div>
                  <div className="form-group">
                    <label htmlFor="description" className="formLabel">
                      Description
                    </label>
                    <TextEditor
                      content={content}
                      setContent={setContent}
                      id="description"
                    />
                    <span className="errorValue">
                      {validationErrors.content}
                    </span>
                  </div>
                </form>
              </div>
              <div className="bgStyle">
                <form className="imagesForm">
                  <div className="col-md-12">
                    <div className="d-flex justify-content-between">
                      <label htmlFor="productImages" className="formLabel">
                        Media
                      </label>
                      {imgFile.length > 0 && (
                        <MdDelete
                          className="dltImgBtn"
                          onClick={onDeleteImgs}
                        />
                      )}
                    </div>
                    <div className="imagesCont">
                      <div className="imgController">
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={onChangeImages}
                          className="imageFileInput"
                        />
                        <div className="imgUploadIcon">
                          <FaPlus size={20} />
                        </div>
                      </div>
                      {Array.from(images).map((item, i) => (
                        <div className="imgCont" key={i}>
                          <input
                            className={
                              imgFile.length > 0 ? "enableall" : "selectImg"
                            }
                            type="checkbox"
                            checked={imgFile.includes(i)}
                            onChange={(e) => selectImg(e, i)}
                          />
                          {typeof item === "string" ? (
                            <img src={item} width={120} height={120} alt="" />
                          ) : (
                            <img
                              src={item ? URL.createObjectURL(item) : null}
                              width={120}
                              height={120}
                              alt=""
                            />
                          )}
                        </div>
                      ))}
                    </div>
                    <span className="errorValue">
                      {validationErrors.images}
                    </span>
                  </div>
                </form>
              </div>
              <div className="bgStyle">
                <form className="areVariantsForm">
                  <div className="d-flex align-items-center">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="isVariants"
                      checked={Boolean(variantsThere)}
                      onChange={() => setVariants(!variantsThere)}
                    />
                    <label
                      className="form-check-label"
                      style={{ marginBottom: "0" }}
                      htmlFor="isVariants"
                    >
                      Product has variants
                    </label>
                  </div>
                </form>
              </div>
              {variantsThere ? (
                <div className="bgStyle">
                  <form className="variantsForm">
                    <label className="formLabel h6 d-block">Variants</label>
                    {variants.map((varient, index) => (
                      <div className="child-div" key={index}>
                        <div className="d-flex justify-content-between">
                          <div className="col-md-11 mb-2">
                            <div>
                              {varient.isDone ? (
                                <label className="variantName">
                                  {varient.optionName}
                                </label>
                              ) : (
                                <div className="d-flex flex-column form-group">
                                  <label htmlFor="optionName">
                                    Option Name
                                  </label>
                                  <select
                                    id="optionName"
                                    className="form-control"
                                    aria-label="Default select example"
                                    value={varient.optionName}
                                    onChange={(e) =>
                                      handleVariantChange(e, varient.id)
                                    }
                                  >
                                    <option value="select">Select</option>
                                    <option value="size">Size</option>
                                    <option value="color">Color</option>
                                    <option value="material">Material</option>
                                    <option value="flavour">Flavour</option>
                                    <option value="quantity">Quantity</option>
                                  </select>
                                </div>
                              )}
                            </div>
                            <div>
                              {varient.isDone ? (
                                varient.optionValue.map((value, i) =>
                                  value !== "" ? (
                                    <label key={i} className="valueCont">
                                      {value}
                                    </label>
                                  ) : null
                                )
                              ) : (
                                <div className="d-flex flex-column form-group">
                                  <label htmlFor="optionValue">
                                    Option Value
                                  </label>
                                  {varient.optionValue.map((value, i) => (
                                    <div
                                      key={i}
                                      style={{ position: "relative" }}
                                    >
                                      <input
                                        id="optionValue"
                                        className="form-control mb-2"
                                        type="text"
                                        maxLength="100"
                                        value={value}
                                        autoComplete="off"
                                        placeholder="Add Another Option"
                                        onChange={(e) =>
                                          onChangeVariantValue(e, varient.id, i)
                                        }
                                      />
                                      {varient.optionValue.length - 1 !== i && (
                                        <button
                                          className="variantDltBtn"
                                          onClick={(e) =>
                                            deleteInput(e, varient.id, i)
                                          }
                                        >
                                          <RiDeleteBin6Line
                                            size={16}
                                            fill="grey"
                                          />
                                        </button>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="d-flex justify-content-between">
                          <div>
                            {varient.isDone ? (
                              <button
                                className="deleteBtn text-dark"
                                onClick={(e) => changeOptionMode(e, varient.id)}
                              >
                                Edit
                              </button>
                            ) : (
                              <button
                                className="deleteBtn"
                                onClick={(e) => deleteVariant(e, varient.id)}
                              >
                                Delete
                              </button>
                            )}
                          </div>
                          {!varient.isDone &&
                            varient?.optionValue.length > 1 && (
                              <button
                                className="adminBtn"
                                style={{ padding: "0.2rem 1rem" }}
                                onClick={(e) => changeOptionMode(e, varient.id)}
                              >
                                Done
                              </button>
                            )}
                        </div>
                      </div>
                    ))}
                    {variants.length < 3 && (
                      <button className="addVariant" onClick={addVarient}>
                        <FiPlusCircle size={14} /> Add options like size or
                        color...
                      </button>
                    )}
                  </form>
                  {variantsDetails.length > 0 && (
                    <>
                      <div className="variantsOutput">
                        {variants.length > 0 && (
                          <div className="d-flex align-items-center">
                            <label style={{}}>Group By</label>
                            <select
                              value={variantGroup}
                              onChange={onchangeVariantGroupBy}
                              className="form-select custom-form-select ms-2"
                            >
                              {variants.map((variant) => (
                                <option
                                  key={variant.id}
                                  value={variant.optionName}
                                >
                                  {variant.optionName}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}
                        <div>
                          <select
                            className="form-select custom-form-select"
                            aria-label="Default select example"
                            onChange={onChangeInventory}
                            value={inventoryIdInfo}
                          >
                            <option
                              value={inventoryLocs.map(
                                (inv) => `${inv.inventory_id}`
                              )}
                            >
                              All Locations
                            </option>
                            {inventoryLocs.map((inv) => (
                              <option
                                key={inv.inventory_id}
                                value={inv.inventory_id}
                              >
                                {inv.inventory_name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="variantsOutputTopbar">
                        <label>Variant</label>
                        <label>Price</label>
                        <label>Available</label>
                      </div>
                      {variantsDetails.map((variant) => (
                        <div key={variant.id}>
                          <div className="variantsOutputValbar">
                            <div className="variantImgCont">
                              {variant.main.variantImage ? (
                                typeof variant.main.variantImage ===
                                "string" ? (
                                  <img
                                    src={variant.main.variantImage}
                                    className="vImg"
                                    alt="varaintImage"
                                  />
                                ) : variant.main.variantImage instanceof
                                  Blob ? (
                                  <img
                                    src={URL.createObjectURL(
                                      variant.main.variantImage
                                    )}
                                    alt=""
                                    className="vImg"
                                  />
                                ) : (
                                  <FaRegFileImage className="variantImgFile" />
                                )
                              ) : (
                                <FaRegFileImage className="variantImgFile" />
                              )}
                              <input
                                type="file"
                                accept="image/*"
                                id="variantImage"
                                className="variantImgInput"
                                onChange={(e) =>
                                  handleVariantsImage(e, variant.id, "main", 0)
                                }
                              />
                              <div className="d-flex flex-column">
                                {variant.sub.length > 0 ? (
                                  <label>{variant.main.value}</label>
                                ) : (
                                  <label>
                                    {location.pathname === "/product/create"
                                      ? renderVariantButton(variant.main)
                                      : variant.main.variantId !== 0
                                      ? renderVariantLink(variant.main)
                                      : renderVariantButton(variant.main)}
                                  </label>
                                )}
                                {modalVariantId === variant.main.id && (
                                  <VariantEdit
                                    mainId={variant.id}
                                    subId={variant.main.id}
                                    handlevariantsvalues={handleVariantsvalues}
                                    show={modalVariantId === variant.main.id}
                                    onHide={handleModalClose}
                                  />
                                )}
                                {variant.sub.length > 0 && (
                                  <div>
                                    <label>{variant.sub.length} Variants</label>
                                    <IoMdArrowDropup
                                      onClick={() =>
                                        toggleSubVariantsVisibility(variant.id)
                                      }
                                    />
                                  </div>
                                )}
                              </div>
                            </div>
                            <div>
                              <input
                                id="offer_price"
                                className="form-control"
                                onChange={(e) =>
                                  handleVariantsOutput(e, variant.id, "main", 0)
                                }
                                value={variant.main.offer_price}
                                type="text"
                                placeholder="₹ 0.0"
                                maxLength={5}
                              />
                            </div>
                            <div>
                              <input
                                id="quantity"
                                className="form-control"
                                onChange={(e) =>
                                  handleVariantsOutput(e, variant.id, "main", 0)
                                }
                                value={variant.main.quantity}
                                type="text"
                                maxLength={5}
                                disabled={
                                  variant.sub.length === 0 ? false : true
                                }
                              />
                            </div>
                          </div>
                          {subVariantsVisibility[variant.id] &&
                            variant.sub.map((va, subIndex) => (
                              <div
                                className="subVariantsOutputValbar"
                                key={va.id}
                              >
                                <div className="variantImgCont">
                                  {renderVariantImage(
                                    va.variantImage || variant.main.variantImage
                                  )}
                                  {location.pathname === "/product/create"
                                    ? renderVariantButton(va)
                                    : va.variantId !== 0
                                    ? renderVariantLink(va)
                                    : renderVariantButton(va)}

                                  {modalVariantId === va.id && (
                                    <VariantEdit
                                      mainId={variant.id}
                                      subId={va.id}
                                      handlevariantsvalues={
                                        handleVariantsvalues
                                      }
                                      show={modalVariantId === va.id}
                                      onHide={handleModalClose}
                                    />
                                  )}

                                  <input
                                    type="file"
                                    id="variantImage"
                                    className="variantImgInput"
                                    accept="image/*"
                                    onChange={(e) =>
                                      handleVariantsImage(
                                        e,
                                        variant.id,
                                        "",
                                        va.id
                                      )
                                    }
                                  />
                                </div>
                                <div>
                                  <input
                                    className="form-control"
                                    type="text"
                                    id="offer_price"
                                    placeholder="₹ 0.0"
                                    onChange={(e) =>
                                      handleVariantsOutput(
                                        e,
                                        variant.id,
                                        "",
                                        va.id
                                      )
                                    }
                                    maxLength={5}
                                    value={va.offer_price}
                                  />
                                </div>
                                <div>
                                  <input
                                    className="form-control"
                                    type="text"
                                    id="quantity"
                                    onChange={(e) =>
                                      handleVariantsOutput(
                                        e,
                                        variant.id,
                                        "",
                                        va.id
                                      )
                                    }
                                    maxLength={5}
                                    value={va.quantity}
                                  />
                                </div>
                              </div>
                            ))}
                        </div>
                      ))}
                    </>
                  )}
                </div>
              ) : (
                <>
                  <div className="bgStyle">
                    <form className="priceForm">
                      <div className="row">
                        <div className="col-md-12">
                          <label className="formLabel h6">Pricing</label>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <label htmlFor="price">Price</label>
                            <input
                              type="text"
                              className="form-control"
                              id="price"
                              value={productPrices.price}
                              onChange={handleProductPrices}
                              placeholder="0.00"
                              maxLength={5}
                            />
                            <span className="errorValue">
                              {validationErrors.price}
                            </span>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <label htmlFor="comparePrice">
                              Compare-at-price
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="comparePrice"
                              value={productPrices.comparePrice}
                              onChange={handleProductPrices}
                              placeholder="0.00"
                              maxLength={5}
                            />
                            <span className="errorValue">
                              {validationErrors.comparePrice}
                            </span>
                          </div>
                        </div>
                        <div className="col-md-12">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={Boolean(productPrices.isTaxable)}
                            onChange={handleProductPrices}
                            id="isTaxable"
                            placeholder="0.00"
                          />
                          <label
                            className="form-check-label"
                            htmlFor="isTaxable"
                          >
                            Charge tax on this product
                          </label>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <label htmlFor="costPerItem">Cost per item</label>
                            <input
                              type="text"
                              className="form-control"
                              value={productPrices.costPerItem}
                              onChange={handleProductPrices}
                              id="costPerItem"
                              placeholder="0.00"
                              maxLength={5}
                            />
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                  <div className="bgStyle">
                    <form className="inventoryForm mt-3">
                      <label className="formLabel h6">Inventory</label>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          onClick={(e) => setTracker(e.target.checked)}
                          checked={tracker}
                          id="trackQty"
                        />
                        <label className="form-check-label" htmlFor="trackQty">
                          Track quantity
                        </label>
                      </div>
                      {tracker ? (
                        <div className="trackerInputs">
                          <div className="form-check">
                            {inventoryLocs.map((inve) => (
                              <div
                                className="d-flex align-items-center mb-2"
                                key={inve.inventory_id}
                              >
                                <label>
                                  <input
                                    id={inve.inventory_id}
                                    className="form-check-input"
                                    type="checkbox"
                                    checked={locInputs.find(
                                      (loc) =>
                                        loc.inventoryId === inve.inventory_id
                                    )}
                                    onChange={handleCorporateLoc} // Handle onChange to prevent warning
                                  />
                                  {`  ${inve.inventory_name}`}
                                </label>
                                {locInputs.find(
                                  (loc) => loc.inventoryId === inve.inventory_id
                                ) && (
                                  <div className="col-2 ms-2">
                                    <input
                                      className="form-control"
                                      type="text"
                                      id={inve.inventory_id}
                                      value={
                                        locInputs.find(
                                          (loc) =>
                                            loc.inventoryId ===
                                            inve.inventory_id
                                        ).qty ?? 0
                                      }
                                      onChange={handleLocationInputs}
                                      maxLength="5"
                                    />
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        ""
                      )}
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={Boolean(handleLoc.cwos)}
                          id="cwos"
                          onChange={handleConditions}
                        />
                        <label className="form-check-label" htmlFor="cwos">
                          Continue selling when out of stock
                        </label>
                      </div>

                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={Boolean(isSKU)}
                          id="hasSKU"
                          onChange={handleSku}
                        />
                        <label className="form-check-label" htmlFor="hasSKU">
                          This product has a SKU or barcode
                        </label>
                      </div>
                      {isSKU ? (
                        <div className="row">
                          <div className="col-md-6">
                            <div className="mb-3">
                              <label htmlFor="SKU" className="formLabel">
                                SKU (Stock Keeping Unit)
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                id="SKU"
                                value={skuInput.SKU}
                                onChange={handleSkuInput}
                                placeholder=""
                                maxLength="15"
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="mb-3">
                              <label htmlFor="barcode" className="formLabel">
                                Barcode (ISBN, UPC, GTIN, etc.)
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                id="barcode"
                                value={skuInput.barcode}
                                onChange={handleSkuInput}
                                placeholder="barcode"
                                maxLength="50"
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        ""
                      )}
                    </form>
                  </div>
                  <div className="bgStyle">
                    <form className="shippingForm mt-3">
                      <div className="col-md-12 mb-2">
                        <label className="formLabel h6">Shipping</label>
                      </div>
                      <label className="d-flex align-items-center mt-2">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={Boolean(isShipping)}
                          value={isShipping}
                          onChange={handleShipping}
                        />
                        This is a physical product
                      </label>
                      {isShipping ? (
                        <div className="shippingCont col-md-6">
                          <div className="d-flex">
                            <input
                              className="form-control"
                              type="text"
                              placeholder="0.0"
                              value={weight}
                              onChange={handleWeight}
                              minLength={3}
                            />
                            <select
                              style={{
                                border: "1px solid #8e8e8e",
                                borderRadius: "0.8rem",
                                marginLeft: "0.2rem",
                                fontSize: "1.2rem",
                              }}
                              aria-label="Default select example"
                              value={weightUnit}
                              onChange={handleWeightUnit}
                            >
                              <option value="kg">Kg</option>
                              <option value="lb">lb</option>
                              <option value="oz">oz</option>
                              <option value="g">g</option>
                            </select>
                          </div>
                          {/* <label htmlFor="countrySelect">
                            Country/Region of origin
                          </label> */}
                          {/* <select
                            id="countrySelect"
                            value={originCountry}
                            onChange={(e) => setOriginCountry(e.target.value)}
                            className="form-select"
                            aria-label="Default select example"
                          >
                            <option value="">Select</option>
                            {countriesList.map((eachObj) => (
                              <option value={eachObj.iso2} key={eachObj.iso3}>
                                {eachObj.name}
                              </option>
                            ))}
                          </select> */}
                        </div>
                      ) : (
                        ""
                      )}
                    </form>
                  </div>
                </>
              )}
              <div className="bgStyle">
                <h6>Search engine listing</h6>
                <p>
                  Add a title and description to see how this product might
                  appear in a search engine listing
                </p>
                <div className="form-group">
                  <label className="heading" htmlFor="metaTitle">
                    Page title
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="metaTitle"
                    maxLength="70"
                    value={metaDetails.metaTitle}
                    onChange={handleMetaDetails}
                  />
                  <p className="infoTxt">
                    {metaDetails.metaTitle.length} of 70 characters used
                  </p>
                </div>
                <div className="form-group">
                  <label className="heading" htmlFor="metaDescription">
                    Meta description
                  </label>
                  <textarea
                    id="metaDescription"
                    className="form-control"
                    maxLength="160"
                    onChange={handleMetaDetails}
                    value={metaDetails.metaDescription}
                  ></textarea>
                  <p className="infoTxt">
                    {metaDetails.metaDescription.length} of 160 characters used
                  </p>
                </div>
                <div className="form-group">
                  <label className="heading" htmlFor="urlHandle">
                    URL handle
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="urlHandle"
                    value={metaDetails.urlHandle}
                    onChange={handleMetaDetails}
                    maxLength={150}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-sm-12 col-md-4">
          <div className="row">
            <div className="col-12">
              <div className="bgStyle">
                <form className="statusForm">
                  <label htmlFor="inputState" className="formLabel h6">
                    Status
                  </label>
                  <select
                    onChange={(e) => setProductStatus(e.target.value)}
                    value={productStatus}
                    id="inputState"
                    className="form-select"
                  >
                    <option value="0">InActive</option>
                    <option value="1">Active</option>
                  </select>
                  <span className="errorValue">
                    {validationErrors.productStatus}
                  </span>
                </form>
              </div>
              {/* <div className="bgStyle">
                <form className="publishingForm">
                  <div className="top_sec">
                    <h6>Publishing</h6>
                    <Dropdown>
                      <Dropdown.Toggle variant="light" id="dropdown-basic">
                        <BsThreeDotsVertical />
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                        <Dropdown.Item href="#/action-1">
                          Manage sales channel
                        </Dropdown.Item>
                        <Dropdown.Item href="#/action-2">
                          Manage markets
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                  <div className="bot_sec">
                    <p>Sales Channels</p>
                    <ul>
                      <li>
                        <span></span> Online Store{" "}
                        <Button
                          variant="light"
                          onClick={() => setStoreShow(true)}
                        >
                          <FaBusinessTime />
                        </Button>
                      </li>
                      <PopupModal
                        show={modal1Show}
                        value={"Schedule Online Store publishing"}
                        onHide={() => setStoreShow(false)}
                      />
                      <li>
                        <span></span> Google & Youtube
                        <Button
                          variant="light"
                          onClick={() => setSiteShow(true)}
                        >
                          <FaBusinessTime />
                        </Button>
                      </li>
                      <PopupModal
                        show={modal2Show}
                        value={"Schedule Google & YouTube publishing"}
                        onHide={() => setSiteShow(false)}
                      />
                      <li>
                        <span></span> Facebook & Instagram & <br />
                        Azistastore mobile app
                      </li>
                    </ul>
                    <p>Markets</p>
                    <ul>
                      <li>
                        <span></span> India and International
                      </li>
                    </ul>
                  </div>
                </form>
              </div> */}
              <div className="bgStyle">
                <form className="productOrganization">
                  <h6>Product organization</h6>
                  <div className="form-group">
                    <label htmlFor="category">Product category</label>
                    <select
                      className="form-control"
                      value={productCategory.category}
                      onChange={handleProductCategorization}
                      id="category"
                    >
                      <option value={0}>Search</option>
                      {categoryItems.map((item, i) => (
                        <option key={i} value={item.azst_category_id}>
                          {item.azst_category_name}
                        </option>
                      ))}
                    </select>
                    <span className="errorValue">
                      {validationErrors.category}
                    </span>
                  </div>
                  <div className="form-group">
                    <label htmlFor="productType">Product type</label>
                    <select
                      className="form-control"
                      id="productType"
                      value={productCategory.productType}
                      onChange={handleProductCategorization}
                    >
                      <option value="select">select</option>
                      {subCategories.map((item) => (
                        <option key={item.azst_sub_category_id}>
                          {item.azst_sub_category_name}
                        </option>
                      ))}
                    </select>
                    <span className="errorValue">
                      {validationErrors.productType}
                    </span>
                  </div>
                  <div className="form-group">
                    <label htmlFor="vendor">Vendor</label>
                    <select
                      className="form-control"
                      id="vendor"
                      value={productCategory.vendor}
                      onChange={handleProductCategorization}
                    >
                      <option>Search</option>
                      {vendors &&
                        vendors.map((vendor) => (
                          <option
                            key={vendor.azst_vendor_id}
                            value={vendor.azst_vendor_id}
                          >
                            {vendor.azst_vendor_name}
                          </option>
                        ))}
                    </select>
                    <span className="errorValue">
                      {validationErrors.vendor}
                    </span>
                  </div>
                  <div className="form-group">
                    <label htmlFor="">Collections</label>
                    <Multiselect
                      displayValue="azst_collection_name"
                      onRemove={onSelectCollection}
                      onSelect={onSelectCollection}
                      selectedValues={selectedCollection}
                      options={collections}
                    />
                    <span className="errorValue">
                      {validationErrors.collectionValue}
                    </span>
                  </div>
                  <div className="form-group">
                    <label htmlFor="">Tags</label>
                    <Multiselect
                      displayValue="azst_tag_name"
                      onRemove={onSelectTag}
                      selectedValues={selectedTag}
                      onSelect={onSelectTag}
                      options={tags}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="brand">Brand</label>
                    <select
                      className="form-control"
                      value={productCategory.brand}
                      onChange={handleProductCategorization}
                      id="brand"
                    >
                      <option value="0">Search</option>
                      {brands.map((item, i) => (
                        <option key={i} value={item.azst_brands_id}>
                          {item.azst_brand_name}
                        </option>
                      ))}
                    </select>
                    <span className="errorValue">{validationErrors.brand}</span>
                  </div>
                  <div className="form-group">
                    <label htmlFor="minCartQty">Min quantity</label>
                    <input
                      id="minCartQty"
                      className="form-control"
                      value={productCategory.minCartQty}
                      onChange={handleProductCategorization}
                      maxLength={4}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="maxCartQty">Max quantity</label>
                    <input
                      id="maxCartQty"
                      className="form-control"
                      value={productCategory.maxCartQty}
                      onChange={handleProductCategorization}
                      maxLength={4}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="returnAccept">Accept Return</label>
                    <select
                      className="form-control"
                      value={returnAccept}
                      onChange={onChangeReturnAccept}
                      id="returnAccept"
                    >
                      <option value="No">No</option>
                      <option value="Yes">Yes</option>
                    </select>
                  </div>
                  {returnAccept === "Yes" ? (
                    <div className="form-group">
                      <label htmlFor="returnDays">ReturnDays</label>
                      <input
                        id="returnDays"
                        className="form-control"
                        value={returnDays}
                        onChange={(e) => setReturnDays(e.target.value)}
                        maxLength={4}
                      />
                    </div>
                  ) : null}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProductForm;
