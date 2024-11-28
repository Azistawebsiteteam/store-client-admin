/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import AdminSideBar from "./AdminSideBar";
import axios from "axios";
import Cookies from "js-cookie";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { ProductState } from "../Context/ProductContext";
import swalErr from "./ErrorHandler";
import Swal from "sweetalert2";
import BackBtn from "../Components/BackBtn";
import "./Admin.css";

const VariantDetails = () => {
  const [isPhysical, setIsPhysical] = useState(false);
  const [selectedVariantDetails, SetSelectedVariantDetails] = useState({});
  const [shippingDetails, setShippingDetails] = useState({
    weight: "0",
    weightUnit: "kg",
  });
  const [inventory, setInventory] = useState({
    sku: "",
    barcode: "",
    hscode: "",
  });
  const [variantImg, setVariantImg] = useState([]);

  const [prices, setPrices] = useState({
    price: "",
    costperitem: "",
    comparePrice: "",
    isTaxable: false,
  });
  const baseUrl = process.env.REACT_APP_API_URL;
  const jwtToken = process.env.REACT_APP_ADMIN_JWT_TOKEN;
  const token = Cookies.get(jwtToken);
  const params = useParams();
  const { id } = params;
  const navigate = useNavigate();

  const { productDetails, variantsData, variantDetails, setVariantDetails } =
    ProductState();

  useEffect(() => {
    const apiCallback = async () => {
      try {
        // Define API endpoint and headers
        const variantDetailsUrl = `${baseUrl}/product/variants/`;
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        // Show loading
        Swal.fire({ title: "Loading...", allowOutsideClick: false });
        Swal.showLoading();

        // Make the API request
        const response = await axios.post(
          variantDetailsUrl,
          { variantId: id },
          { headers }
        );

        // Handle successful response
        if (response.status === 200) {
          Swal.close();
          const selectedVariantDetails = response.data.variant;

          // Set variant image
          const variantImg = selectedVariantDetails.variant_image[1];
          setVariantImg(variantImg);

          // Set variant details
          SetSelectedVariantDetails(selectedVariantDetails);

          // Set prices
          setPrices({
            price: selectedVariantDetails.offer_price ?? "0",
            costperitem: selectedVariantDetails.cost_per_item ?? "0",
            comparePrice: selectedVariantDetails.compare_at_price ?? "0",
            isTaxable: selectedVariantDetails.variant_taxable === "true",
          });

          // Set inventory details
          setInventory({
            sku: selectedVariantDetails.variant_sku || "",
            barcode: selectedVariantDetails.variant_barcode || "",
            hscode: selectedVariantDetails.variant_HS_code || "",
          });

          // Set shipping details
          setShippingDetails({
            weight: selectedVariantDetails.variant_weight || "0",
            weightUnit: selectedVariantDetails.variant_weight_unit || "kg",
          });

          // Determine if the item is physical
          setIsPhysical(selectedVariantDetails.variant_weight !== null);
        }
      } catch (error) {
        Swal.close();
        swalErr.onError(error);
      }
    };

    // Call the API
    apiCallback();
  }, [id, baseUrl, token]);

  const updateVariantImg = (e) => {
    setVariantImg(e.target.files[0]);
    const url = URL.createObjectURL(e.target.files[0]);

    const update = variantDetails.map((v) => {
      if (v.id === parseInt(id)) {
        return { ...v, variant_image: [v.variant_image[0], url] };
      } else {
        return v;
      }
    });
    setVariantDetails(update);
  };

  const updatePrice = (e) => {
    const { id, checked, value } = e.target;

    if (id === "isTaxable") {
      setPrices({ ...prices, [id]: checked });
    } else if (/^[0-9]*$/.test(value)) {
      setPrices({ ...prices, [id]: value });
    }
  };

  const handleInventory = (e) => {
    const { id, value } = e.target;
    if (id === "hscode" && /^[0-9]*$/.test(value)) {
      setInventory({ ...inventory, [id]: value });
    } else if (id !== "hscode") {
      setInventory({ ...inventory, [id]: value });
    }
  };

  const handleShippingQty = (e) => {
    const { id, value } = e.target;

    if (id === "weight" && /^[0-9]*$/.test(value)) {
      setShippingDetails({ ...shippingDetails, [id]: value });
    } else if (id !== "weight") {
      setShippingDetails({ ...shippingDetails, [id]: value });
    }
  };

  const onUpdateVariants = async () => {
    try {
      const url = `${baseUrl}/product/update/variant`;
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      // Show loading indicator
      Swal.fire({ title: "Updating...", allowOutsideClick: false });
      Swal.showLoading();

      // Initialize FormData
      const formData = new FormData();

      // Append necessary form data
      formData.append("variantImage", variantImg);
      formData.append("offer_price", prices.price);
      formData.append("comparePrice", prices.comparePrice);
      formData.append("Costperitem", prices.costperitem);
      formData.append("isTaxable", prices.isTaxable ? true : false); // Convert to boolean
      formData.append("value", "[]"); // Placeholder for value field
      formData.append("barcode", inventory.barcode);
      formData.append("hsCode", inventory.hscode);
      formData.append("skuCode", inventory.sku);
      formData.append("variantWeight", shippingDetails.weight); // Add fallback for null/undefined
      formData.append("variantWeightUnit", shippingDetails.weightUnit); // Add fallback
      formData.append("variantId", id);
      formData.append("inventoryPolicy", "na");
      formData.append("variantService", "na");
      formData.append("shippingRequired", isPhysical);

      // Send the API request
      const response = await axios.put(url, formData, { headers });

      // Handle success
      if (response.status === 200) {
        Swal.close();
        swalErr.onSuccess();
        // navigate(-1); // Navigate back
      }
    } catch (error) {
      Swal.close();
      swalErr.onError(error);
    }
  };

  const deleteVariant = async () => {
    try {
      const url = `${baseUrl}/product/delete/variant`;
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      swalErr.onLoading();
      axios.delete(url, {
        headers,
        data: {
          variantId: id,
        },
      });

      Swal.close();
    } catch (error) {
      Swal.close();
      swalErr.onError(error);
    }
  };
  const getVariantImgurl = (imges) => {
    const [productImg, variantImg] = imges;
    let imgurl = "";
    if (variantImg) {
      imgurl = variantImg;
    } else {
      imgurl = productImg;
    }
    return imgurl;
  };

  return (
    <div className="adminSec">
      <AdminSideBar />
      <div className="commonSec">
        <div className="container">
          <div className="row">
            <div className="col-sm-12">
              <div className="d-flex align-items-center mb-3">
                <BackBtn onClick={() => navigate(-1)} />
                <h5 style={{ cursor: "pointer" }}>
                  {selectedVariantDetails.option1 && (
                    <span>{selectedVariantDetails.option1}</span>
                  )}{" "}
                  {selectedVariantDetails.option2 && (
                    <span>/ {selectedVariantDetails.option2}</span>
                  )}{" "}
                  {selectedVariantDetails.option3 && (
                    <span>/ {selectedVariantDetails.option3}</span>
                  )}
                </h5>
              </div>
            </div>
            <div className="col-sm-4">
              <div className="bgStyle">
                <div className="d-flex align-items-center">
                  <img
                    className="vImg mVImg"
                    src={productDetails.image_src}
                    alt="variant"
                  />
                  <div className="" style={{ marginLeft: "6px" }}>
                    <p className="variantHeading">
                      {productDetails.product_title}
                    </p>
                    <label
                      className={
                        productDetails.status === 1
                          ? "activeVariant"
                          : "inActiveVariant"
                      }
                    >
                      {productDetails.status === 1 ? "Active" : "Inactive"}
                    </label>
                    <label className="d-block">
                      {variantDetails.length} variants
                    </label>
                  </div>
                </div>
              </div>
              <div className="bgStyle">
                <h6>Variants</h6>
                <hr />
                {variantDetails.map((variant) => (
                  <Link to={`/variant-details/${variant.id}`}>
                    <div className="d-flex align-items-center">
                      <img
                        className="vImg"
                        src={getVariantImgurl(variant.variant_image)}
                        alt="Variant"
                      />
                      <p className="variantEditor">
                        {variant.option1 && <label>{variant.option1}</label>}
                        {variant.option2 && <label>/ {variant.option2}</label>}
                        {variant.option3 && <label>/ {variant.option3}</label>}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            <div className="col-sm-8">
              <div className="bgStyle">
                <h6>Options</h6>
                {variantsData.map((v, i) => (
                  <div className="mb-3">
                    <label htmlFor="optionName" className="formLabel">
                      {v.UOM}
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="optionValue"
                      value={`${selectedVariantDetails["option" + (i + 1)]}`}
                      disabled
                    />
                  </div>
                ))}
                <div className="variantImgCont d-flex flex-column">
                  {typeof variantImg !== "string" ? (
                    variantImg instanceof Blob ? (
                      <img
                        src={URL.createObjectURL(variantImg)}
                        className="vImg"
                        alt=""
                      />
                    ) : null
                  ) : (
                    <img className="vImg" src={variantImg} alt="yu" />
                  )}
                  <div className="singleVariantImg">
                    <label htmlFor="chooseImg" style={{ cursor: "pointer" }}>
                      Upload
                    </label>
                    <input
                      type="file"
                      id="chooseImg"
                      onChange={updateVariantImg}
                      className="variantImgInput2"
                    />
                  </div>
                </div>
              </div>
              <div className="bgStyle">
                <h6>Pricing</h6>
                <div className="row">
                  <div className="col form-group">
                    <label htmlFor="price" className="formLabel">
                      Price
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="price"
                      value={prices.price ?? 0}
                      onChange={updatePrice}
                      minLength={1}
                      maxLength={5}
                    />
                  </div>
                  <div className="col form-group">
                    <label htmlFor="costperitem" className="formLabel">
                      Compare-at-price
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="comparePrice"
                      value={prices.comparePrice}
                      onChange={updatePrice}
                      minLength={1}
                      maxLength={5}
                    />
                  </div>
                </div>
                <div className="inputGroup">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={prices.isTaxable}
                    id="isTaxable"
                    onChange={updatePrice}
                  />
                  <label className="formLabel" htmlFor="isTaxable">
                    Charge tax on this variant
                  </label>
                </div>
                <div className="row">
                  <div className="col form-group">
                    <label htmlFor="price" className="formLabel">
                      Cost per item
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="costperitem"
                      value={prices.costperitem}
                      onChange={updatePrice}
                      minLength={1}
                      maxLength={5}
                    />
                  </div>
                </div>
              </div>
              <div className="bgStyle">
                <h6>Inventory</h6>
                <div className="row">
                  <div className="col-sm-6 form-group">
                    <label htmlFor="sku" className="formLabel">
                      SKU (Stock Keeping Unit)
                    </label>
                    <input
                      type="text"
                      value={inventory.sku}
                      className="form-control"
                      id="sku"
                      placeholder=""
                      onChange={handleInventory}
                      minLength={1}
                      maxLength={15}
                    />
                  </div>
                  <div className="col-sm-6 form-group">
                    <label htmlFor="barcode" className="formLabel">
                      Barcode (ISBN, UPC, GTIN, etc.)
                    </label>
                    <input
                      type="text"
                      value={inventory.barcode}
                      className="form-control"
                      id="barcode"
                      placeholder=""
                      onChange={handleInventory}
                      minLength={1}
                      maxLength={25}
                    />
                  </div>
                  <div className="col-sm-6 form-group">
                    <label htmlFor="hsCode" className="formLabel">
                      Harmonized System (HS) code
                    </label>
                    <input
                      type="text"
                      value={inventory.hscode}
                      className="form-control"
                      id="hscode"
                      placeholder=""
                      onChange={handleInventory}
                      minLength={1}
                      maxLength={8}
                    />
                  </div>
                </div>
              </div>
              <div className="bgStyle">
                <h6>Shipping</h6>
                <div className="inputGroup">
                  <input
                    className="form-check-input"
                    checked={isPhysical}
                    onChange={(e) => setIsPhysical(e.target.checked)}
                    type="checkbox"
                    id="physicalProduct"
                  />
                  <label className="formLabel me-2" htmlFor="physicalProduct">
                    This is a physical product
                  </label>
                  <div className="shippingCont">
                    {isPhysical && (
                      <div className="col-md-6">
                        <div className="d-flex">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="0.0"
                            value={shippingDetails.weight}
                            onChange={handleShippingQty}
                            id="weight"
                            minLength={1}
                            maxLength={5}
                          />
                          <select
                            style={{
                              border: "1px solid rgb(142, 142, 142)",
                              borderRadius: "0.8rem",
                              marginLeft: "0.2rem",
                              fontSize: "1.2rem",
                            }}
                            aria-label="Default select example"
                            value={shippingDetails.weightUnit}
                            id="weightUnit"
                            onChange={handleShippingQty}
                          >
                            <option value="kg">Kg</option>
                            <option value="lb">lb</option>
                            <option value="oz">oz</option>
                            <option value="g">g</option>
                          </select>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="d-flex justify-content-end mt-5 mb-4">
                  <button
                    className="deleteBtn deleteBtn1"
                    onClick={deleteVariant}
                    style={{ marginRight: "10px" }}
                  >
                    Delete variant
                  </button>
                  <button className="adminBtn" onClick={onUpdateVariants}>
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

export default VariantDetails;
