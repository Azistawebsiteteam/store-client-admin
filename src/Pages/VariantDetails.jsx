/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import AdminSideBar from "./AdminSideBar";
import { TiArrowLeft } from "react-icons/ti";
import axios from "axios";
import Cookies from "js-cookie";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { ProductState } from "../Context/ProductContext";
import swalErr from "./ErrorHandler";
import Swal from "sweetalert2";

const VariantDetails = () => {
  const [isPhysical, setIsPhysical] = useState(false);
  const [selectedVariantDetails, SetSelectedVariantDetails] = useState({});
  const [shippingDetails, setShippingDetails] = useState({
    weight: "",
    weightUnit: "",
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

  const { productDetails, variantsData, variantDetails } = ProductState();

  useEffect(() => {
    const apiCallback = async () => {
      try {
        const variantDetailsUrl = `${baseUrl}/product/variants/`;
        const headers = {
          Authorization: `Bearer ${token}`,
        };
        swalErr.onLoading();
        const response = await axios.post(
          variantDetailsUrl,
          { variantId: id },
          { headers }
        );
        if (response.status === 200) {
          Swal.close();
          const selectedVariantDetails = response.data.variant;
          setVariantImg(selectedVariantDetails.variant_image[1]);
          SetSelectedVariantDetails(selectedVariantDetails);
          setPrices({
            price: selectedVariantDetails.offer_price,
            costperitem: selectedVariantDetails.actual_price,
            comparePrice: selectedVariantDetails.actual_price,
            isTaxable: selectedVariantDetails.variant_taxable,
          });
          setInventory({
            sku: selectedVariantDetails.variant_sku,
            barcode: selectedVariantDetails.variant_barcode,
            hscode: selectedVariantDetails.variant_HS_code,
          });
          setShippingDetails({
            weight: selectedVariantDetails.variant_weight,
            weightUnit: selectedVariantDetails.variant_weight_unit,
          });

          setIsPhysical(selectedVariantDetails.variant_weight !== null);
        }
      } catch (error) {
        Swal.close();
      }
    };
    apiCallback();
  }, [id, baseUrl, token]);

  const isPhysicalProduct = () => {
    setIsPhysical(!isPhysical);
  };

  const updateVariantImg = (e) => {
    setVariantImg(e.target.files[0]);
  };

  const updatePrice = (e) => {
    setPrices({ ...prices, [e.target.id]: e.target.value });
  };

  const handleInventory = (e) => {
    setInventory({ ...inventory, [e.target.id]: e.target.value });
  };

  const handleShippingQty = (e) => {
    setShippingDetails({ ...shippingDetails, [e.target.id]: e.target.value });
  };

  const onUpdateVariants = async () => {
    try {
      const url = `http://192.168.212.37:5018/api/v1/product/update/variant`;
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      swalErr.onLoading();
      const formdata = new FormData();
      formdata.append("variantImage", JSON.stringify([variantImg]));
      formdata.append("offer_price", prices.price);
      formdata.append("comparePrice", prices.comparePrice);
      formdata.append("isTaxable", prices.isTaxable === "on" ? true : false);
      formdata.append("value", "[]");
      formdata.append("barcode", inventory.barcode);
      formdata.append("hsCode", inventory.hscode);
      formdata.append("skuCode", inventory.sku);
      formdata.append("variantWeight", shippingDetails.weight);
      formdata.append("variantWeightUnit", shippingDetails.weightUnit);
      formdata.append("variantId", id);
      formdata.append("quantity", 100);
      formdata.append("inventoryId", 10);
      formdata.append("inventoryPolicy", "na");
      formdata.append("variantService", "na");
      formdata.append("shippingRequired", isPhysical);

      const response = await axios.put(url, formdata, { headers });
      if (response.status === 200) {
        navigate(-1);
      }
      Swal.close();
    } catch (e) {
      Swal.close();
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
      // navigate(-1)
      Swal.close();
    } catch (error) {
      Swal.close();
    }
  };

  return (
    <div className="adminSec">
      <AdminSideBar />
      <div className="commonSec">
        <div className="container">
          <div className="row">
            <div className="col-sm-12">
              <h3 style={{ cursor: "pointer" }}>
                <TiArrowLeft onClick={() => navigate(-1)} />
                {selectedVariantDetails.option1 && (
                  <span>{selectedVariantDetails.option1}</span>
                )}{" "}
                {selectedVariantDetails.option2 && (
                  <span>/ {selectedVariantDetails.option2}</span>
                )}{" "}
                {selectedVariantDetails.option3 && (
                  <span>/ {selectedVariantDetails.option3}</span>
                )}
              </h3>
            </div>
            <div className="col-sm-4">
              <div className="bgStyle">
                <div className="d-flex align-items-center">
                  <img className="vImg" src={productDetails.image_src} alt="" />
                  <div className="" style={{ marginLeft: "6px" }}>
                    <h5>{productDetails.product_title}</h5>
                    <span className="d-block">
                      {productDetails.status === 1 ? "Active" : "Inactive"}
                    </span>
                    <span>{variantDetails.length} variants</span>
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
                        src={variant.variant_image[0]}
                        alt="ghg"
                      />
                      <p style={{ marginBottom: "0", marginLeft: "6px" }}>
                        {variant.option1 && <span>{variant.option1}</span>}{" "}
                        {variant.option2 && <span>/ {variant.option2}</span>}{" "}
                        {variant.option3 && <span>/ {variant.option3}</span>}
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
                    <label htmlFor="optionName" className="col-form-label">
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
                    <label htmlFor="chooseImg">Change</label>
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
                  <div className="col">
                    <label htmlFor="price" className="col-form-label">
                      Price
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="price"
                      value={prices.price ?? 0}
                      onChange={updatePrice}
                    />
                  </div>
                  <div className="col">
                    <label htmlFor="costperitem" className="col-form-label">
                      Compare-at-price
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="comparePrice"
                      value={prices.comparePrice}
                      onChange={updatePrice}
                    />
                  </div>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={prices.isTaxable}
                    id="isTaxable"
                    onChange={updatePrice}
                  />
                  <label className="form-check-label" htmlFor="isTaxable">
                    Charge tax on this variant
                  </label>
                </div>
                <div className="row">
                  <div className="col">
                    <label htmlFor="price" className="col-form-label">
                      Cost per item
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="costperitem"
                      value={prices.costperitem}
                      onChange={updatePrice}
                    />
                  </div>
                </div>
              </div>
              <div className="bgStyle">
                <h6>Inventory</h6>
                <div className="row">
                  <div className="col-sm-6">
                    <label htmlFor="sku" className="col-form-label">
                      SKU (Stock Keeping Unit)
                    </label>
                    <input
                      type="text"
                      value={inventory.sku}
                      className="form-control"
                      id="sku"
                      placeholder=""
                      onChange={handleInventory}
                    />
                  </div>
                  <div className="col-sm-6">
                    <label htmlFor="barcode" className="col-form-label">
                      Barcode (ISBN, UPC, GTIN, etc.)
                    </label>
                    <input
                      type="text"
                      value={inventory.barcode}
                      className="form-control"
                      id="barcode"
                      placeholder=""
                      onChange={handleInventory}
                    />
                  </div>
                  <div className="col-sm-6">
                    <label htmlFor="hsCode" className="col-form-label">
                      Harmonized System (HS) code
                    </label>
                    <input
                      type="text"
                      value={inventory.hscode}
                      className="form-control"
                      id="hsCode"
                      placeholder=""
                      onChange={handleInventory}
                    />
                  </div>
                </div>
              </div>
              <div className="bgStyle">
                <h6>Shipping</h6>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    checked={isPhysical}
                    onClick={isPhysicalProduct}
                    type="checkbox"
                    id="physicalProduct"
                  />
                  <label className="form-check-label" htmlFor="physicalProduct">
                    This is a physical product
                  </label>
                  <div className="shippingCont">
                    {isPhysical && (
                      <div className="d-flex">
                        <input
                          type="text"
                          placeholder="0.0"
                          value={shippingDetails.weight}
                          onChange={handleShippingQty}
                        />
                        <select
                          className=""
                          aria-label="Default select example"
                          value={shippingDetails.weightUnit}
                          onChange={handleShippingQty}
                        >
                          <option value="kg">Kg</option>
                          <option value="lb">lb</option>
                          <option value="oz">oz</option>
                          <option value="g">g</option>
                        </select>
                      </div>
                    )}
                    {/* <div className='countriesList'>
                                            <label htmlFor='countrySelect'>Country/Region of origin</label>
                                            <select id="countrySelect" value={originCountry} onChange={(e) => setOriginCountry(e.target.value)} className="form-select" aria-label="Default select example">
                                                <option value="">Select</option>
                                                {countriesList ? countriesList.data.map(eachObj => (
                                                    <option value={eachObj.iso2} key={eachObj.iso3}>
                                                        {eachObj.name}
                                                    </option>
                                                )) : ''}
                                            </select>
                                        </div> */}
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="d-flex justify-content-end mt-4">
                  <button
                    className="dltBtn"
                    onClick={deleteVariant}
                    style={{ marginRight: "10px" }}
                  >
                    Delete variant
                  </button>
                  <button className="saveBtn" onClick={onUpdateVariants}>
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
