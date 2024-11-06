/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import { v4 } from 'uuid';
import AddProductForm from './AddProductForm';
import AdminSideBar from './AdminSideBar';
import { useParams } from 'react-router-dom';
import swalErr from './ErrorHandler';
import { ProductState } from '../Context/ProductContext';
import BackBtn from '../Components/BackBtn';

const UpdateProduct = () => {
  const [productData, setProductData] = useState({
    title: '',
    mainTitle: '',
    content: '',
    locInputs: [],
    modal1Show: false,
    modal2Show: false,
    tracker: false,
    locValues: false,
    isShipping: false,
    isSKU: false,
    error: false,
    handleLoc: { cwos: false },
    productPrices: {
      price: 0,
      comparePrice: 0,
      isTaxable: false,
      costPerItem: 0,
    },
    images: [],
    categoryItems: [],
    variantsDetails: [],
    skuInput: { SKU: '', barcode: '' },
    weight: '0',
    weightUnit: 'kg',
    originCountry: '',
    productStatus: '0',
    productCategory: {
      category: '',
      productType: '',
      vendor: '',
      brand: '',
      minCartQty: 0,
      maxCartQty: 0,
    },
    tagValue: [],
    collectionValue: [],
    metaDetails: {
      metaTitle: '',
      metaDescription: '',
      urlHandle: `${window.location.origin}/productItem`,
    },
    modal3Show: false,
  });
  const [variants, setVariant] = useState([]);
  const [variantGroup, setVariantsGroup] = useState('');
  const [inventoryIdInfo, setInventoryId] = useState([]);
  const [subVariantsVisibility, setSubVariantsVisibility] = useState({});
  const [variantsThere, setVariants] = useState(false);
  const baseUrl = process.env.REACT_APP_API_URL;
  // const localUrl = process.env.REACT_APP_LOCAL_URL;
  const jwtToken = process.env.REACT_APP_ADMIN_JWT_TOKEN;
  const token = Cookies.get(jwtToken);
  const { id } = useParams();
  const { setProductDetails, setVariantsData, setVariantDetails } =
    ProductState();

  const [returnAccept, setReturnAccept] = useState('No');
  const [returnDays, setReturnDays] = useState(0);

  const navigate = useNavigate();

  const setProductUpdateDetails = (productDetails) => {
    const {
      collections,
      compare_at_price,
      cost_per_item,
      origin_country,
      is_taxable,
      out_of_stock_sale,
      price,
      product_category,
      product_images,
      product_info,
      product_title,
      product_main_title,
      product_weight,
      seo_description,
      seo_title,
      url_handle,
      sku_bar_code,
      sku_code,
      status,
      tags,
      type,
      variant_store_order,
      vendor_id,
      brand_id,
      product_qtys,
      min_cart_quantity,
      max_cart_quantity,
      product_return_accept,
      product_return_days,
    } = productDetails;

    setProductData((prevData) => ({
      ...prevData,

      images: product_images,
      originCountry: origin_country,
      title: product_title,
      mainTitle: product_main_title,
      content: product_info,
      locInputs: product_qtys.map((inv) => ({
        inventoryId: inv.inventory_id,
        qty: inv.product_qty,
      })),
      productCategory: {
        category: product_category,
        productType: type,
        vendor: vendor_id,
        brand: brand_id,
        minCartQty: min_cart_quantity,
        maxCartQty: max_cart_quantity,
      },
      productPrices: {
        price,
        comparePrice: compare_at_price,
        isTaxable: is_taxable,
        costPerItem: cost_per_item,
      },
      metaDetails: {
        metaTitle: seo_title,
        metaDescription: seo_description,
        urlHandle: url_handle,
      },
      tagValue: JSON.parse(tags),
      collectionValue: JSON.parse(collections),
      productStatus: status,
      weight: product_weight ? product_weight.split('-')[0] : '0',
      weightUnit: product_weight ? product_weight.split('-')[1] : 'kg',
      isShipping: product_weight?.split('-').length > 0,
      isSKU: !!(sku_code || sku_bar_code),
      skuInput: { SKU: sku_code, barcode: sku_bar_code },
      handleLoc: { cwos: out_of_stock_sale },

      tracker: !JSON.parse(variant_store_order)?.length > 0,
    }));
    setReturnAccept(product_return_accept);
    setReturnDays(product_return_days);
    setVariants(JSON.parse(variant_store_order)?.length > 0);
  };

  const setVariantsUpdateDetails = (v) => {
    setVariantsGroup(v[0].UOM);
    const newVariants = v.map((each) => ({
      id: v4(),
      optionName: each.UOM,
      optionValue: [...each.values, ''],
      isDone: true,
    }));

    // Set the variants state once after the array has been constructed
    setVariant(newVariants);
  };
  const getDetails = async () => {
    try {
      const url = `${baseUrl}/product/get/details`;
      const headers = { Authorization: `Bearer ${token}` };
      swalErr.onLoading();
      const body = { productId: id, inventoryIds: inventoryIdInfo };

      const response = await axios.post(url, body, { headers });

      const { productDetails, variants, availableVariants } = response.data;

      swalErr.onLoadingClose();
      setProductUpdateDetails(productDetails);
      if (availableVariants.length > 0) {
        setVariantsUpdateDetails(variants);
      }

      setProductDetails(productDetails);
      setVariantsData(variants);
      setVariantDetails(availableVariants);
    } catch (error) {
      swalErr.onLoadingClose();
      swalErr.onError(error);
    }
  };

  useEffect(() => {
    getDetails();
  }, [id, baseUrl, token, inventoryIdInfo]);

  const onSubmitProductDetails = async () => {
    try {
      if (!productData.title) {
        setProductData((prevData) => ({
          ...prevData,
          error: 'Title can’t be blank',
        }));
        return;
      } else {
        setProductData((prevData) => ({ ...prevData, error: '' }));
      }

      const url = `${baseUrl}/product/update-store`;
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-type': 'multipart/form-data',
      };
      swalErr.onLoading();

      const formdata = new FormData();
      const proVariants = [
        ...new Set(variants.map((variant) => variant.optionName)),
      ];
      const oldImages = productData.images.filter((e) => typeof e === 'string');

      productData.images.forEach((file) => {
        if (oldImages.length === 1 && typeof file === 'string') {
          formdata.append('productImages', JSON.stringify([file]));
        } else {
          formdata.append('productImages', file);
        }
      });
      formdata.append('productId', id);
      formdata.append('productTitle', productData.title);
      formdata.append('productMainTitle', productData.mainTitle);
      formdata.append('productInfo', productData.content);
      formdata.append('variantsThere', variantsThere);
      formdata.append('metaTitle', productData.metaDetails.metaTitle);
      formdata.append(
        'metaDescription',
        productData.metaDetails.metaDescription
      );
      formdata.append('urlHandle', productData.metaDetails.urlHandle);
      formdata.append('productActiveStatus', productData.productStatus);
      formdata.append('category', productData.productCategory.category);
      formdata.append('productType', productData.productCategory.productType);
      formdata.append('vendor', productData.productCategory.vendor);
      formdata.append('brand', productData.productCategory.brand);
      formdata.append('minCartQty', productData.productCategory.minCartQty);
      formdata.append('maxCartQty', productData.productCategory.maxCartQty);
      formdata.append('returnAccept', returnAccept);
      formdata.append('returnDays', returnDays);
      if (productData.collectionValue.length > 1) {
        productData.collectionValue.forEach((id) => {
          formdata.append('collections', JSON.stringify(id));
        });
      } else {
        productData.collectionValue.push(0);
        productData.collectionValue.forEach((id) => {
          formdata.append('collections', JSON.stringify(id));
        });
      }

      formdata.append('tags', JSON.stringify(productData.tagValue));
      const inventory = productData.locInputs.filter(
        (i) => i.inventoryId !== null
      );
      if (variantsThere) {
        productData.variantsDetails.forEach((variant) => {
          formdata.append('variantImage', variant.main.variantImage);
          variant.sub.forEach((subVariant) =>
            formdata.append('variantImage', subVariant.variantImage)
          );
        });
        formdata.append('variantsOrder', JSON.stringify(proVariants));
        formdata.append(
          'variants',
          JSON.stringify(productData.variantsDetails)
        );

        formdata.append('vInventoryInfo', JSON.stringify(inventoryIdInfo));
      } else {
        formdata.append('productPrice', productData.productPrices.price);
        formdata.append(
          'productComparePrice',
          productData.productPrices.comparePrice
        );
        formdata.append(
          'productIsTaxable',
          productData.productPrices.isTaxable
        );
        formdata.append(
          'productCostPerItem',
          productData.productPrices.costPerItem
        );
        formdata.append('inventoryInfo', JSON.stringify(inventory));
        formdata.append('cwos', productData.handleLoc.cwos);
        formdata.append('skuCode', productData.skuInput.SKU);
        formdata.append('skuBarcode', productData.skuInput.barcode);
        formdata.append(
          'productWeight',
          productData.weight !== ''
            ? productData.weight + '-' + productData.weightUnit
            : ''
        );
        formdata.append('originCountry', productData.originCountry);
      }

      await axios.post(url, formdata, { headers });
      swalErr.onLoadingClose();
      swalErr.onSuccess();
    } catch (error) {
      swalErr.onLoadingClose();
      swalErr.onError(error);
    }
  };

  const deleteImg = async (imgFile, setFun) => {
    try {
      const url = `${baseUrl}/product/delete/images`;
      const headers = { Authorization: `Bearer ${token}` };
      const body = { productId: id, deleteImgs: imgFile };
      const response = await axios.patch(url, body, { headers });
      setProductData((prevData) => ({
        ...prevData,
        images: response.data.updatedImgs,
      }));
      setFun([]);
    } catch (error) {}
  };

  const productProps = {
    proid: id,
    returnAccept,
    setReturnAccept,
    returnDays,
    setReturnDays,
    categoryItems: productData.categoryItems,
    setCategoryItems: (items) =>
      setProductData((prevData) => ({ ...prevData, categoryItems: items })),
    title: productData.title,
    mainTitle: productData.mainTitle,
    error: productData.error,
    mainError: productData.mainError,
    setError: (error) => setProductData((prevData) => ({ ...prevData, error })),
    setMainError: (mainError) =>
      setProductData((prevData) => ({ ...prevData, mainError })),
    setTitle: (title) => setProductData((prevData) => ({ ...prevData, title })),
    setMainTitle: (mainTitle) =>
      setProductData((prevData) => ({ ...prevData, mainTitle })),
    setMetaDetails: (metaDetails) =>
      setProductData((prevData) => ({ ...prevData, metaDetails })),
    metaDetails: productData.metaDetails,

    setVariantsDetials: (details) =>
      setProductData((prevData) => ({ ...prevData, variantsDetails: details })),
    variantsDetails: productData.variantsDetails,

    subVariantsVisibility,
    setSubVariantsVisibility,
    content: productData.content,
    setContent: (content) =>
      setProductData((prevData) => ({ ...prevData, content })),
    images: productData.images,
    // setVariants: (variants) =>
    //   setProductData((prevData) => ({ ...prevData, variants })),
    variantsThere,
    tracker: productData.tracker,
    setTracker: (tracker) =>
      setProductData((prevData) => ({ ...prevData, tracker })),
    setCollectionValue: (value) =>
      setProductData((prevData) => ({ ...prevData, collectionValue: value })),
    collectionValue: productData.collectionValue,
    setHandleLoc: (loc) =>
      setProductData((prevData) => ({ ...prevData, handleLoc: loc })),
    handleLoc: productData.handleLoc,
    setChintalLoc: (loc) =>
      setProductData((prevData) => ({ ...prevData, chintalLoc: loc })),
    setLocValues: (values) =>
      setProductData((prevData) => ({ ...prevData, locValues: values })),
    locValues: productData.locValues,
    setLocInputs: (inputs) =>
      setProductData((prevData) => ({ ...prevData, locInputs: inputs })),
    locInputs: productData.locInputs,
    setCorporateLoc: (loc) =>
      setProductData((prevData) => ({ ...prevData, corporateLoc: loc })),
    setIsShipping: (isShipping) =>
      setProductData((prevData) => ({ ...prevData, isShipping })),
    isShipping: productData.isShipping,

    setVariant,
    setProductPrices: (prices) =>
      setProductData((prevData) => ({ ...prevData, productPrices: prices })),
    productPrices: productData.productPrices,
    setSkuInput: (input) =>
      setProductData((prevData) => ({ ...prevData, skuInput: input })),
    skuInput: productData.skuInput,
    setWeight: (weight) =>
      setProductData((prevData) => ({ ...prevData, weight })),
    setProductCategory: (category) =>
      setProductData((prevData) => ({
        ...prevData,
        productCategory: category,
      })),
    productCategory: productData.productCategory,
    setTagValue: (tags) =>
      setProductData((prevData) => ({ ...prevData, tagValue: tags })),
    tagValue: productData.tagValue,
    setImages: (images) =>
      setProductData((prevData) => ({ ...prevData, images })),

    setSiteShow: (show) =>
      setProductData((prevData) => ({ ...prevData, modal2Show: show })),
    modal2Show: productData.modal2Show,
    modal1Show: productData.modal1Show,
    setStoreShow: (show) =>
      setProductData((prevData) => ({ ...prevData, modal1Show: show })),
    productStatus: productData.productStatus,
    setProductStatus: (status) =>
      setProductData((prevData) => ({ ...prevData, productStatus: status })),
    originCountry: productData.originCountry,
    setOriginCountry: (country) =>
      setProductData((prevData) => ({ ...prevData, originCountry: country })),
    weight: productData.weight,
    weightUnit: productData.weightUnit,
    setWeightUnit: (unit) =>
      setProductData((prevData) => ({ ...prevData, weightUnit: unit })),
    setIsSKU: (isSKU) => setProductData((prevData) => ({ ...prevData, isSKU })),
    isSKU: productData.isSKU,
    chintalLoc: productData.chintalLoc,
    corporateLoc: productData.corporateLoc,
    deleteImg,
    setVariantShow: (show) =>
      setProductData((prevData) => ({ ...prevData, modal3Show: show })),
    inventoryIdInfo,
    setInventoryId,
    variants,
    variantGroup,
    setVariantsGroup,
    setVariants,
  };

  return (
    <div className='adminSec'>
      <AdminSideBar />
      <div className='commonSec'>
        <div className='addProductSection'>
          <div className='container'>
            <div className='row'>
              <div className='col-12'>
                <div className='d-flex align-items-center'>
                  <BackBtn onClick={() => navigate(-1)} />
                  <h3>{productData.title}</h3>
                </div>
              </div>
              <AddProductForm productProps={productProps} />
              <div className='col-12'>
                <div className='btnCont'>
                  <button onClick={onSubmitProductDetails} className='adminBtn'>
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

export default UpdateProduct;
