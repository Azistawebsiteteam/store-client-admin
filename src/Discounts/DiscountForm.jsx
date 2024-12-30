/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback } from 'react';
import { useState } from 'react';
import { FaRegCopy } from 'react-icons/fa';
import { LiaPercentSolid } from 'react-icons/lia';
import { MdCurrencyRupee } from 'react-icons/md';
import Multiselect from 'multiselect-react-dropdown';
import { useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import ErrorHandler from './../Pages/ErrorHandler';
import '../Pages/Admin.css';

const DiscountForm = (props) => {
  const {
    selectedDiscount,
    discountProps,
    validationErrors,
    setValidationErrors,
  } = props;
  const [customersList, setCustomersList] = useState([]);
  const [updatedProductsList, setUpdatedProductsList] = useState([]);
  const [collectionsList, setCollectionsList] = useState([]);

  const [salesChannels, setSalesChannels] = useState({
    facebookAndInsta: '',
    googleAndYoutube: '',
    azistaStore: '',
  });

  const baseUrl = process.env.REACT_APP_API_URL;
  const jwtToken = process.env.REACT_APP_ADMIN_JWT_TOKEN;
  const token = Cookies.get(jwtToken);

  const {
    discountStatus,
    disCode,
    setDisCode,
    disTitle,
    setDisTitle,
    method,
    setMethodTab,
    amtOfPrdctsDscntVal,
    setAmtOfPrdctsDscntVal,
    discountedValues,
    setDiscountedValues,
    discountVal,
    setDiscountVal,
    startTimings,
    setStartTimings,
    endTimings,
    setEndTimings,
    maxDisUses,
    setMaxDisUses,
    usageLimit,
    setUsageLimit,
    custEligibility,
    setCustEligibility,
    selectedCustomers,
    setSelectedCustomers,
    minCartVal,
    setMinCartVal,
    customerBuyType,
    setCustomerBuyType,
    custOrderQuant,
    setCustOrderQuant,
    customerGetType,
    setCustomerGetType,
    endDate,
    setEndDate,
    // maxUses,
    // setMaxUses,
    productDisTypeValue,
    setProductDisTypeValue,
    customerBuyProducts,
    setCustomerBuyProducts,
    customerBuyCollections,
    setCustomerBuyCollections,
    customerGetProducts,
    setCustomerGetProducts,
    customerGetCollections,
    setCustomerGetCollections,
  } = discountProps;

  const generateRandomCode = useCallback(() => {
    let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZ';
    let randomcode = '';
    for (var i = 0; i < 10; i++) {
      let index = Math.ceil(Math.random() * (chars.length - 1));
      randomcode += chars[index];
    }
    setDisCode(randomcode);
  }, [setDisCode]);

  useEffect(() => {
    if (method === 'Automatic') {
      generateRandomCode();
    }
  }, [method]);

  useEffect(() => {
    const productDetails = async () => {
      try {
        const productsUrl = `${baseUrl}/product/all-products/variants`;
        const collectionsUrl = `${baseUrl}/collections/data`;
        const customersUrl = `${baseUrl}/users/get/all`;

        const headers = {
          Authorization: `Bearer ${token} `,
        };
        const [productsData, collectionsData, customersData] =
          await Promise.all([
            axios.get(productsUrl, { headers }),
            axios.get(collectionsUrl, { headers }),
            axios.post(customersUrl, { isActive: true }, { headers }),
          ]);

        const updatedProductList = productsData.data.products.map((each) => ({
          productTitle: `${each.product_title} ${
            each.option1 !== null ? `- ${each.option1}` : ''
          } ${each.option2 !== null ? `- ${each.option2}` : ''} ${
            each.option3 !== null ? `- ${each.option3}` : ''
          }`,
          product_mainTitle: each.product_main_title,
          productId: each.product_id,
          variantId: each.variant_id,
        }));

        setUpdatedProductsList(updatedProductList);
        setCollectionsList(collectionsData.data);
        setCustomersList(customersData.data);
      } catch (error) {
        ErrorHandler.onError(error);
      }
    };
    productDetails();
  }, [token, baseUrl]);

  // Function to process selected items

  const getBuySelectedListItem = (selectedType, selectedItems) => {
    if (!selectedType || !selectedItems.length) {
      return [];
    }

    const selectedCategoryProducts = [];
    if (selectedType === 'product') {
      selectedItems.forEach((item) => {
        const selectedP = updatedProductsList.find(
          (p) =>
            p.productId === item.productId && p.variantId === item.variantId
        );
        if (selectedP) {
          selectedCategoryProducts.push(selectedP);
        }
      });
    } else {
      selectedItems.forEach((item) => {
        const collection = collectionsList.find((c) => {
          if (item.azst_collection_id) {
            return c.azst_collection_id === item.azst_collection_id;
          } else {
            return c.azst_collection_id === item;
          }
        });
        if (collection) {
          selectedCategoryProducts.push(collection);
        }
      });
    }

    return selectedCategoryProducts;
  };

  const getCustomersDetails = (custEligibility, customers) => {
    if (custEligibility === 'all') {
      return [];
    } else if (custEligibility === 'specificCustomer') {
      const selectedCustomersList = [];
      customers.forEach((item) => {
        const customer = customersList.find((c) => {
          if (item.azst_customer_id) {
            return c.azst_customer_id === item.azst_customer_id;
          } else {
            return c.azst_customer_id === item;
          }
        });
        if (customer) {
          selectedCustomersList.push(customer);
        }
      });
      return selectedCustomersList;
    } else {
      return [];
    }
  };

  useEffect(() => {
    const customers = getCustomersDetails(custEligibility, selectedCustomers);
    setSelectedCustomers(customers);
  }, [custEligibility]);

  // Effect to update selected items for "Gets" list
  useEffect(() => {
   // console.log('calling XITMES effect');
    if (customerBuyType === 'product') {
      const getXitems = getBuySelectedListItem(
        customerBuyType,
        customerBuyProducts
      );
      setCustomerBuyProducts(getXitems);
    } else {
      const getXitems = getBuySelectedListItem(
        customerBuyType,
        customerBuyCollections
      );
      setCustomerBuyCollections(getXitems);
    }
  }, [customerBuyType]);

  useEffect(() => {
 //   console.log('calling YITMES effect');
    if (customerGetType === 'product') {
      const getYitems = getBuySelectedListItem(
        customerGetType,
        customerGetProducts
      );
      setCustomerGetProducts(getYitems);
    } else {
      const getYitems = getBuySelectedListItem(
        customerGetType,
        customerGetCollections
      );
      setCustomerGetCollections(getYitems);
    }
  }, [customerGetType]);

  const handleMethodTab = (tab) => {
    setMethodTab(tab);
    setDisCode('');
  };
  const handleDisCode = (e) => {
    setDisCode(e.target.value.toUpperCase());
    setValidationErrors({ ...validationErrors, disCode: '' });
  };
  const copyTxt = () => {
    navigator.clipboard.writeText(disCode);
  };
  const handleAmountOfProductsDiscounts = (e) => {
    setAmtOfPrdctsDscntVal(e.target.value);
    setDiscountVal(0);
    setValidationErrors({
      ...validationErrors,
      discountVal: '',
    });
  };

  const handleDiscountedValues = (e) => {
    setDiscountedValues(e.target.value);
    if (e.target.value === 'free') {
      setDiscountVal('100');
    } else {
      setDiscountVal(0);
    }

    setValidationErrors({
      ...validationErrors,
      discountVal: '',
    });
  };
  const handleProductDisTypeValues = (e) => {
    setProductDisTypeValue(e.target.value);
  };

  const handleDiscountBlock = (e) => {
    const { name, value: rawValue } = e.target;
    const sanitizedValue = rawValue.replace(/[^0-9]/g, '');

    let checkValue;
    switch (name) {
      case 'amtOfPrdctsDscntVal':
        checkValue = amtOfPrdctsDscntVal;
        break;
      case 'productDisTypeValue':
        checkValue = productDisTypeValue;
        break;
      default:
        checkValue = discountedValues;
    }

    if (checkValue === 'free') {
      setDiscountVal(100);
    } else if (checkValue === 'percentage') {
      const numericValue = parseInt(sanitizedValue, 10);
      if (numericValue > 100) {
        setValidationErrors({
          ...validationErrors,
          discountVal: 'Percentage value must be between 0 and 100',
        });
        return;
      }
    }

    setDiscountVal(sanitizedValue);

    // Clear validation errors if the value is valid
    setValidationErrors({
      ...validationErrors,
      discountVal:
        isNaN(sanitizedValue) || sanitizedValue === '' ? 'Invalid value' : '',
    });
  };

  const onSelectedCustomer = (selectedItem) => {
    setSelectedCustomers(selectedItem);
    setValidationErrors({ ...validationErrors, selectedCustomers: '' });
  };

  const onSelectedCustomerSpendsValue = (selectedItem) => {
    if (customerBuyType === 'product') {
      setCustomerBuyProducts(selectedItem);
    } else {
      setCustomerBuyCollections(selectedItem);
    }

    setValidationErrors({
      ...validationErrors,
      customerBuyError: '',
    });
  };
  const onSelectedCustomerGetsValue = (selectedItem) => {
    if (customerGetType === 'product') {
      setCustomerGetProducts(selectedItem);
    } else {
      setCustomerGetCollections(selectedItem);
    }
    setValidationErrors({
      ...validationErrors,
      customerGetError: '',
    });
  };

  const handleDiscountTitle = (e) => {
    setDisTitle(e.target.value);
    setValidationErrors({ ...validationErrors, disTitle: '' });
  };

  const handleCustomerEligibility = (e) => {
    const value = e.target.value === 'allCustomers' ? 'all' : e.target.value;
    setCustEligibility(value);
    setValidationErrors({ ...validationErrors, selectedCustomers: '' });
  };

  const handleMaxDisUses = (e) => {
    setMaxDisUses(e.target.id);
    setValidationErrors({ ...validationErrors, usageLimit: '' });
  };

  const handleUsageLimit = (e) => {
    let { value } = e.target;
    value = value.replace(/[^0-9]/g, '');
    setUsageLimit(value);
    if (!isNaN(usageLimit) && usageLimit !== '') {
      setValidationErrors({ ...validationErrors, usageLimit: '' });
    }
  };

  // const handleCustUsageLimit = (e) => {
  //   let { value } = e.target;
  //   value = value.replace(/[^0-9]/g, "");
  //   setCustUsageLimit(value);
  //   if (!isNaN(value) && custUsageLimit !== "") {
  //     setValidationErrors({ ...validationErrors, custUsageLimit: "" });
  //   }
  // };

  const handleEndDate = (e) => {
    setEndDate(e.target.checked);
  };

  const handleStartTimings = (e) => {
    setStartTimings({ ...startTimings, [e.target.id]: e.target.value });
  };

  const handleEndTimings = (e) => {
    setEndTimings({ ...endTimings, [e.target.id]: e.target.value });
  };

  const handleSalesChannels = (e) => {
    setSalesChannels({ ...salesChannels, [e.target.id]: e.target.checked });
  };
  const handleSpecificItems = (e) => {
    setCustomerBuyType(e.target.value);
  };

  const handleCustomerGetsItems = (e) => {
    setCustomerGetType(e.target.value);
  };
  const handleCustGetsQuant = (e) => {
    let { id, value } = e.target;
    value = value.replace(/[^0-9]/g, ''); // Allow only numbers
    setCustOrderQuant({ ...custOrderQuant, [id]: value });

    if (!isNaN(value) && value !== '') {
      setValidationErrors({
        ...validationErrors,
        [id]: '', // Dynamically clear errors based on `id`
      });
    }
  };
  const handleMinCartValue = (e) => {
    let { value } = e.target;
    value = value.replace(/[^0-9]/g, '');
    setMinCartVal(value);
    setValidationErrors({ ...validationErrors, minCartVal: '' });
  };

  const today = new Date().toISOString().slice(0, 10);
  const minEndDate = new Date(new Date().setDate(new Date().getDate() + 1))
    .toISOString()
    .slice(0, 10);

  const HandleXitmesDropDown = () => (
    <div className='col-md-8'>
      <label className='form-check-label' htmlFor='CustomerBuysAnyItems'>
        Any items from
      </label>
      <select
        id='CustomerBuysAnyItems'
        className='form-select'
        value={customerBuyType}
        onChange={handleSpecificItems}
        aria-label='Default select example'>
        <option value='collection'>Specific collections</option>
        <option value='product'>Specific products</option>
      </select>
    </div>
  );

  const HandleXitmesMultiSelect = () => (
    <div className='mt-3 mb-3'>
      {customerBuyType === 'product' ? (
        <Multiselect
          displayValue={'productTitle'}
          onRemove={onSelectedCustomerSpendsValue}
          selectedValues={customerBuyProducts}
          onSelect={onSelectedCustomerSpendsValue}
          options={updatedProductsList}
          placeholder={'Search products'}
        />
      ) : (
        <Multiselect
          displayValue={'azst_collection_name'}
          onRemove={onSelectedCustomerSpendsValue}
          selectedValues={customerBuyCollections}
          onSelect={onSelectedCustomerSpendsValue}
          options={collectionsList}
          placeholder={'Search collections'}
        />
      )}
      {validationErrors.customerBuyError && (
        <span className='errorValue'>{validationErrors.customerBuyError}</span>
      )}
    </div>
  );

  const HandleYitmesDropDown = () => (
    <div className='col-md-8'>
      <label className='form-check-label' htmlFor='CustomerGetItems'>
        Any items from
      </label>
      <select
        id='CustomerGetItems'
        value={customerGetType}
        onChange={handleCustomerGetsItems}
        className='form-select'
        aria-label='Default select example'>
        <option value='collection'>Specific collections</option>
        <option value='product'>Specific products</option>
      </select>
    </div>
  );

  const HandleYitmesMultiSelect = () => (
    <div className='mt-3 mb-3'>
      {customerGetType === 'product' ? (
        <Multiselect
          displayValue={'productTitle'}
          onRemove={onSelectedCustomerGetsValue}
          selectedValues={customerGetProducts}
          onSelect={onSelectedCustomerGetsValue}
          options={updatedProductsList}
          placeholder={'Search products'}
        />
      ) : (
        <Multiselect
          displayValue={'azst_collection_name'}
          onRemove={onSelectedCustomerGetsValue}
          selectedValues={customerGetCollections}
          onSelect={onSelectedCustomerGetsValue}
          options={collectionsList}
          placeholder={'Search collections'}
        />
      )}
      {validationErrors.customerGetError && (
        <span className='errorValue'>{validationErrors.customerGetError}</span>
      )}
    </div>
  );

  return (
    <div>
      <div className='col-sm-12'>
        <div className='d-flex justify-content-between mt-4 mb-2'>
          <h5>Selected Discount</h5>
        </div>
      </div>
      <div className='col-sm-12'>
        <div className='row'>
          <div className='col-md-8'>
            <div className='bgStyle'>
              <div className='form-group'>
                <h6 className=''>Discount Title</h6>
                <input
                  type='text'
                  onChange={handleDiscountTitle}
                  value={disTitle}
                  className='form-control'
                  maxLength={50}
                />
                {validationErrors.disTitle && (
                  <span className='errorValue'>
                    {validationErrors.disTitle}
                  </span>
                )}
              </div>
              <div className='d-flex justify-content-between'>
                <h6>{selectedDiscount}</h6>
                <h6>Product discount</h6>
              </div>

              {(selectedDiscount === 'Discount on Products' ||
                selectedDiscount === 'Order value') && (
                <>
                  <div className='form-group'>
                    <label htmlFor='' className='form-label'>
                      Method
                    </label>
                    <div className='methodBtnCont'>
                      <button
                        className={`methodBtn ${
                          method === 'Manual' && 'active'
                        }`}
                        onClick={() => handleMethodTab('Manual')}>
                        Discount code
                      </button>
                      <button
                        className={`methodBtn ${
                          method === 'Automatic' && 'active'
                        }`}
                        onClick={() => handleMethodTab('Automatic')}>
                        Automatic discount
                      </button>
                    </div>
                  </div>
                  {method === 'Automatic' && (
                    <div className=''>
                      <label style={{ whiteSpace: 'normal' }}>
                        Customers will see this in their cart and at checkout.
                      </label>
                    </div>
                  )}
                  {method === 'Manual' && (
                    <div className=''>
                      <div className='d-flex justify-content-between'>
                        <label htmlFor='' className='form-label'>
                          Discount code
                        </label>
                        <button
                          className='generateCodeBtn'
                          onClick={generateRandomCode}>
                          Generate random code
                        </button>
                      </div>
                      <input
                        type='text'
                        value={disCode}
                        onChange={handleDisCode}
                        className='form-control'
                        maxLength={30}
                      />
                      {validationErrors.disCode && (
                        <span className='errorValue'>
                          {validationErrors.disCode}
                        </span>
                      )}
                      <label className='d-block'>
                        Customers must enter this code at checkout.
                      </label>
                    </div>
                  )}{' '}
                </>
              )}

              {selectedDiscount !== 'Discount on Products' &&
                selectedDiscount !== 'Order value' && (
                  <>
                    <label className='form-label'>Method - Automatic</label>
                    {/* <label htmlFor="disDode" className="form-label">
                        Discount code
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="disDode"
                        value={disCode}
                        onChange={handleDisCode}
                      /> */}
                    <label className='d-block'>
                      Customers will see this in their cart and at checkout.
                    </label>
                  </>
                )}
            </div>

            {selectedDiscount === 'Buy X get Y' ? (
              <div className='bgStyle'>
                <div className=''>
                  <h6>Customer spends</h6>
                  <p>Minimum quantity of items</p>
                  <div className='row'>
                    <div className='col-md-4'>
                      <label
                        className='form-check-label'
                        htmlFor='CustomerBuysQuantity'>
                        Min Quantity
                      </label>
                      <input
                        type='text'
                        className='form-control'
                        id='minBuyQty'
                        placeholder='Min Quantity'
                        value={custOrderQuant.minBuyQty}
                        onChange={handleCustGetsQuant}
                        maxLength={5}
                      />
                      {validationErrors.minBuyQty && (
                        <span className='errorValue'>
                          {validationErrors.minBuyQty}
                        </span>
                      )}
                    </div>

                    {/* 'X ITEMS Buy Type' */}
                    {HandleXitmesDropDown()}
                  </div>
                  {/* 'X Multiselect Buy Type' */}
                  {HandleXitmesMultiSelect()}
                </div>
                <hr />
                <div className=''>
                  <h6>Customer gets</h6>
                  <p>
                    Customers must add the quantity of items specified below to
                    their cart.
                  </p>
                  <div className='row'>
                    <div className='col-md-4'>
                      <label
                        className='form-check-label'
                        htmlFor='CustomerBuysQuantity'>
                        Max Quantity
                      </label>
                      <input
                        type='text'
                        value={custOrderQuant.maxGetYQty}
                        onChange={handleCustGetsQuant}
                        className='form-control'
                        id='maxGetYQty'
                        placeholder='Max Quantity'
                        maxLength={5}
                      />
                      {validationErrors.maxGetYQty && (
                        <span className='errorValue'>
                          {validationErrors.maxGetYQty}
                        </span>
                      )}
                    </div>
                    {/* 'Y ITEMS Type' */}
                    {HandleYitmesDropDown()}
                  </div>
                  {/* 'Y ITEMS MULTISELECT' */}
                  {HandleYitmesMultiSelect()}
                </div>
                <hr />
                <div className='mt-2 mb-2'>
                  <h6>At a discounted value</h6>
                  <div className='inputGroup'>
                    <input
                      className='form-check-input me-2'
                      onChange={handleDiscountedValues}
                      type='radio'
                      name='discountedValues'
                      checked={discountedValues === 'percentage'}
                      value='percentage'
                      id='atDiscountPercentage'
                    />
                    <label
                      className='form-check-label me-2'
                      htmlFor='atDiscountPercentage'>
                      Percentage
                    </label>
                    {discountedValues === 'percentage' && (
                      <div>
                        <div className='discountBlock'>
                          <input
                            type='text'
                            value={discountVal}
                            onChange={handleDiscountBlock}
                            className='form-control'
                            id=''
                            maxLength={3}
                            name='discountedValues'
                          />
                          <LiaPercentSolid className='percentageSign' />
                        </div>
                        {validationErrors.discountVal && (
                          <span className='errorValue'>
                            {validationErrors.discountVal}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <div className='d-flex'>
                    <input
                      className='form-check-input me-2'
                      onChange={handleDiscountedValues}
                      checked={discountedValues === 'flat'}
                      value='flat'
                      type='radio'
                      name='atDiscount'
                      id='atDiscountAmount'
                    />
                    <div className='d-flex flex-column'>
                      <div className='d-flex align-items-start'>
                        <label
                          className='form-check-label me-2'
                          htmlFor='atDiscountAmount'>
                          Amount off each
                        </label>
                        <div className=''>
                          {discountedValues === 'flat' && (
                            <div className='d-flex flex-column'>
                              <div className='discountBlock'>
                                <input
                                  value={discountVal}
                                  type='text'
                                  className='form-control discount-amount-input'
                                  onChange={handleDiscountBlock}
                                  placeholder='0.00'
                                  name='discountedValues'
                                  style={{ paddingLeft: '1rem' }}
                                  maxLength={5}
                                />
                                <MdCurrencyRupee className='rupeeSign' />
                              </div>
                              {validationErrors.discountVal && (
                                <span className='errorValue'>
                                  {validationErrors.discountVal}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      <label className='form-check-label'>
                        For multiple quantities, the discount amount will be
                        taken off each Y item.
                      </label>
                    </div>
                  </div>
                  <div className='inputGroup'>
                    <input
                      className='form-check-input'
                      onChange={handleDiscountedValues}
                      checked={discountedValues === 'free'}
                      value='free'
                      type='radio'
                      name='discountedValues'
                      id='fullDiscount'
                    />
                    <label
                      className='form-check-label me-2'
                      htmlFor='fullDiscount'>
                      Free
                    </label>
                  </div>
                </div>
                <hr />
                {/* <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value={maxUses}
                    checked={maxUses}
                    onChange={handleMaxUses}
                    id="setMaximumUses"
                  />
                  <label className="form-check-label" htmlFor="setMaximumUses">
                    Set a maximum number of uses.
                  </label>
                  {maxUses && (
                    <>
                      <input
                        className="form-control amtInpt d-block"
                        type="text"
                        id="custUsageLimit"
                        value={custUsageLimit}
                        onChange={handleCustUsageLimit}
                        maxLength={3}
                      />
                      {validationErrors.custUsageLimit && (
                        <span className="errorValue">
                          {validationErrors.custUsageLimit}
                        </span>
                      )}
                    </>
                  )}
                </div> */}
              </div>
            ) : (
              ''
            )}
            {selectedDiscount === 'Discount on Products' ? (
              <div className='bgStyle'>
                <h6>Discount Value</h6>
                <div className='row g-3'>
                  <div className='col-md-8'>
                    <select
                      className='form-select'
                      value={amtOfPrdctsDscntVal}
                      onChange={handleAmountOfProductsDiscounts}
                      aria-label='Default select example'>
                      <option value='flat'>Fixed Amount</option>
                      <option value='percentage'>Percentage</option>
                    </select>
                  </div>
                  <div className='col-md-4'>
                    {amtOfPrdctsDscntVal === 'percentage' ? (
                      <>
                        <div className='discountBlock'>
                          <input
                            type='text'
                            value={discountVal}
                            onChange={handleDiscountBlock}
                            className='form-control discount-amount-input'
                            maxLength={3}
                            name='amtOfPrdctsDscntVal'
                          />
                          <LiaPercentSolid className='percentageSign' />
                        </div>
                        {validationErrors.discountVal && (
                          <span className='errorValue'>
                            {validationErrors.discountVal}
                          </span>
                        )}
                      </>
                    ) : (
                      <>
                        <div className='discountBlock'>
                          <input
                            value={discountVal}
                            type='text'
                            style={{ paddingLeft: '1.6rem' }}
                            className='form-control discount-amount-input'
                            onChange={handleDiscountBlock}
                            maxLength={5}
                            placeholder=' 0.00'
                            name='amtOfPrdctsDscntVal'
                          />
                          <MdCurrencyRupee className='rupeeSign' />
                        </div>
                        {validationErrors.discountVal && (
                          <span className='errorValue'>
                            {validationErrors.discountVal}
                          </span>
                        )}
                      </>
                    )}
                  </div>
                </div>
                <h6 className='mt-2'>Applies to</h6>
                <div className='row g-3'>
                  <div className='col-md-3'>
                    <input
                      type='text'
                      value={custOrderQuant.minBuyQty}
                      onChange={handleCustGetsQuant}
                      maxLength={3}
                      placeholder='Min Quantity'
                      className='form-control'
                      id='minBuyQty'
                    />
                    {validationErrors.minBuyQty && (
                      <span className='errorValue'>
                        {validationErrors.minBuyQty}
                      </span>
                    )}
                  </div>
                  <div className='col-md-3'>
                    <input
                      type='text'
                      value={custOrderQuant.maxGetYQty}
                      onChange={handleCustGetsQuant}
                      placeholder='Max Quantity'
                      maxLength={3}
                      className='form-control'
                      id='maxGetYQty'
                    />
                    {validationErrors.maxGetYQty && (
                      <span className='errorValue'>
                        {validationErrors.maxGetYQty}
                      </span>
                    )}
                  </div>
                  {/* X Itemes Multiselectable */}
                  {HandleXitmesDropDown()}
                </div>
                {HandleXitmesMultiSelect()}
              </div>
            ) : (
              ''
            )}

            {selectedDiscount === 'Order value' ? (
              <div className='bgStyle'>
                <h6>Discount Value</h6>
                <div className='row'>
                  <div className='col-md-4'>
                    <input
                      type='text'
                      value={minCartVal}
                      onChange={handleMinCartValue}
                      className='form-control'
                      id='minimumCartValue'
                      placeholder='Min Cart Value'
                      maxLength={7}
                    />
                    {validationErrors.minCartVal && (
                      <span className='errorValue'>
                        {validationErrors.minCartVal}
                      </span>
                    )}
                  </div>
                  <div className='col-md-4'>
                    <select
                      className='form-select'
                      value={amtOfPrdctsDscntVal}
                      onChange={handleAmountOfProductsDiscounts}
                      aria-label='Default select example'>
                      <option value='percentage'>Percentage</option>
                      <option value='flat'>Fixed Amount</option>
                      <option value='product'>Product</option>
                    </select>
                  </div>
                  {amtOfPrdctsDscntVal !== 'product' ? (
                    <div className='col-md-4'>
                      {amtOfPrdctsDscntVal === 'percentage' ? (
                        <>
                          <div className='discountBlock'>
                            <input
                              type='text'
                              value={discountVal}
                              onChange={handleDiscountBlock}
                              className='form-control'
                              name='amtOfPrdctsDscntVal'
                              max={3}
                            />
                            <LiaPercentSolid className='percentageSign' />
                          </div>
                          {validationErrors.discountVal && (
                            <span className='errorValue'>
                              {validationErrors.discountVal}
                            </span>
                          )}
                        </>
                      ) : (
                        <>
                          <div className='discountBlock'>
                            <input
                              value={discountVal}
                              type='text'
                              className='form-control discount-amount-input'
                              onChange={handleDiscountBlock}
                              placeholder='0.00'
                              name='amtOfPrdctsDscntVal'
                              maxLength={5}
                            />
                            <MdCurrencyRupee className='rupeeSign' />
                          </div>
                          {validationErrors.discountVal && (
                            <span className='errorValue'>
                              {validationErrors.discountVal}
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  ) : (
                    <div className='col-md-12'>
                      <div className='mt-3 mb-3'>
                        <div className=''>
                          <h6>Customer gets</h6>
                          <p>
                            Customers must add the quantity of items specified
                            below to their cart.
                          </p>
                          <div className='row'>
                            <div className='col-md-4'>
                              <label
                                className='form-check-label'
                                htmlFor='CustomerBuysQuantity'>
                                Max Quantity
                              </label>
                              <input
                                type='text'
                                value={custOrderQuant.maxGetYQty}
                                onChange={handleCustGetsQuant}
                                className='form-control'
                                id='maxGetYQty'
                                placeholder='Max Quantity'
                                maxLength={5}
                              />
                              {validationErrors.maxGetYQty && (
                                <span className='errorValue'>
                                  {validationErrors.maxGetYQty}
                                </span>
                              )}
                            </div>
                            {/* Y ITMES dropdown */}
                            {HandleYitmesDropDown()}
                          </div>
                          {/* Y ITMES Multiselect Select */}
                          {HandleYitmesMultiSelect()}
                        </div>
                        <hr />
                        <div className='mt-2 mb-2'>
                          <h6>At a discounted value</h6>
                          <div className='d-flex align-items-start'>
                            <input
                              className='form-check-input me-2'
                              onChange={handleProductDisTypeValues}
                              type='radio'
                              name='productDisType'
                              checked={productDisTypeValue === 'percentage'}
                              value='percentage'
                              id='atDiscountPercentage'
                            />
                            <label
                              className='form-check-label me-2'
                              htmlFor='atDiscountPercentage'>
                              Percentage
                            </label>
                            {productDisTypeValue === 'percentage' && (
                              <div>
                                <div className='discountBlock'>
                                  <input
                                    type='text'
                                    value={discountVal}
                                    onChange={handleDiscountBlock}
                                    className='form-control'
                                    maxLength={3}
                                    name='productDisTypeValue'
                                  />
                                  <LiaPercentSolid className='percentageSign' />
                                </div>
                                {validationErrors.discountVal && (
                                  <span className='errorValue'>
                                    {validationErrors.discountVal}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                          <div className='inputGroup d-flex align-items-start'>
                            <input
                              className='form-check-input me-2'
                              onChange={handleProductDisTypeValues}
                              checked={productDisTypeValue === 'flat'}
                              value='flat'
                              type='radio'
                              name='productDisType'
                              id='atDiscountAmount'
                            />
                            <div className='d-flex flex-column'>
                              <div className='d-flex align-items-start'>
                                <label
                                  className='form-check-label me-2'
                                  htmlFor='atDiscountAmount'>
                                  Amount off each
                                </label>
                                {productDisTypeValue === 'flat' && (
                                  <div>
                                    <div className='discountBlock'>
                                      <input
                                        value={discountVal}
                                        type='text'
                                        className='form-control discount-amount-input'
                                        onChange={handleDiscountBlock}
                                        placeholder=' 0.00'
                                        name='productDisTypeValue'
                                        maxLength={5}
                                      />
                                      <MdCurrencyRupee className='rupeeSign' />
                                    </div>
                                    {validationErrors.discountVal && (
                                      <span className='errorValue'>
                                        {validationErrors.discountVal}
                                      </span>
                                    )}
                                  </div>
                                )}
                              </div>
                              <label className='form-check-label'>
                                For multiple quantities, the discount amount
                                will be taken off each Y item.
                              </label>
                            </div>
                          </div>
                          <div className='inputGroup'>
                            <input
                              className='form-check-input me-2'
                              onChange={handleProductDisTypeValues}
                              type='radio'
                              checked={productDisTypeValue === 'free'}
                              value='free'
                              id='fullDiscount'
                              name='productDisTypeValue'
                            />
                            <label
                              className='form-check-label'
                              htmlFor='fullDiscount'>
                              Free
                            </label>
                          </div>
                        </div>
                        <hr />
                        {/* <div className="inputGroup">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            value={maxUses}
                            checked={maxUses}
                            onChange={handleMaxUses}
                            id="setMaximumUses"
                          />
                          <label
                            className="form-check-label"
                            htmlFor="setMaximumUses"
                          >
                            Set a maximum number of uses.
                          </label>
                          {maxUses && (
                            <>
                              <input
                                className="form-control amtInpt d-block"
                                type="text"
                                id="custUsageLimit"
                                value={custUsageLimit}
                                onChange={handleCustUsageLimit}
                                maxLength={3}
                              />
                              {validationErrors.custUsageLimit && (
                                <span className="errorValue">
                                  {validationErrors.custUsageLimit}
                                </span>
                              )}
                            </>
                          )}
                        </div> */}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : null}

            <div className='bgStyle'>
              <div className=''>
                <h6>Customer eligibility</h6>
                <div className='inputGroup'>
                  <input
                    className='form-check-input'
                    onChange={handleCustomerEligibility}
                    type='radio'
                    name='customerEligibility'
                    checked={custEligibility === 'all'}
                    id='allCustomers'
                    value='allCustomers'
                  />
                  <label className='form-check-label' htmlFor='allCustomers'>
                    All customers
                  </label>
                </div>
                <div className='inputGroup'>
                  <input
                    className='form-check-input'
                    onChange={handleCustomerEligibility}
                    type='radio'
                    name='customerEligibility'
                    id='specificCustomer'
                    checked={custEligibility === 'specificCustomer'}
                    value='specificCustomer'
                  />
                  <label
                    className='form-check-label'
                    htmlFor='specificCustomer'>
                    Specific customers
                  </label>
                  {custEligibility === 'specificCustomer' && (
                    <div className='ms-2' style={{ width: '100%' }}>
                      <Multiselect
                        displayValue={'azst_customer_name'}
                        onRemove={onSelectedCustomer}
                        selectedValues={selectedCustomers}
                        onSelect={onSelectedCustomer}
                        options={customersList}
                        placeholder='Search customers'
                      />
                    </div>
                  )}
                </div>
                {validationErrors.selectedCustomers && (
                  <span className='errorValue'>
                    {validationErrors.selectedCustomers}
                  </span>
                )}
              </div>
            </div>
            <div className='bgStyle'>
              <div className=''>
                <h6>Maximum discount uses</h6>
              </div>
              <div className='inputGroup'>
                <input
                  className='form-check-input'
                  type='radio'
                  value='1'
                  id='oneTimeUser'
                  checked={maxDisUses === 'oneTimeUser'}
                  onChange={handleMaxDisUses}
                  name='discountUses'
                />
                <label className='form-check-label' htmlFor='oneTimeUser'>
                  Limit to one use per customer
                </label>
              </div>
              <div className='inputGroup'>
                <input
                  className='form-check-input'
                  type='radio'
                  checked={maxDisUses === 'mutipleTimeDiscntUses'}
                  onChange={handleMaxDisUses}
                  id='mutipleTimeDiscntUses'
                  name='discountUses'
                />
                <label
                  className='form-check-label'
                  htmlFor='mutipleTimeDiscntUses'>
                  Limit number of times this discount can be used in total
                </label>
                {maxDisUses === 'mutipleTimeDiscntUses' && (
                  <input
                    className='form-control amtInpt d-block ms-2'
                    type='text'
                    maxLength={3}
                    id='usageLimit'
                    value={usageLimit}
                    onChange={handleUsageLimit}
                  />
                )}
              </div>
              {validationErrors.usageLimit && (
                <span className='errorValue'>
                  {validationErrors.usageLimit}
                </span>
              )}
            </div>

            <div className='bgStyle'>
              <h6>Active dates</h6>
              <form className='row g-3'>
                <div className='col-md-6'>
                  <label htmlFor='startDate' className='form-label'>
                    Start date
                  </label>
                  <input
                    type='date'
                    className='form-control'
                    id='startDate'
                    min={today}
                    value={startTimings.startDate}
                    onChange={handleStartTimings}
                  />
                </div>
                <div className='col-md-6'>
                  <label htmlFor='startTime' className='form-label'>
                    Start time (IST)
                  </label>
                  <input
                    type='time'
                    className='form-control'
                    id='startTime'
                    value={startTimings.startTime}
                    onChange={handleStartTimings}
                  />
                </div>
              </form>
              <div className='inputGroup'>
                <input
                  className='form-check-input'
                  type='checkbox'
                  checked={endDate}
                  onChange={handleEndDate}
                  id='setEndDate'
                />
                <label
                  className='formLabel'
                  style={{ paddingBottom: '0' }}
                  htmlFor='setEndDate'>
                  Set end date{' '}
                  <span>
                    ( Note: The time difference will default to 10 days. )
                  </span>
                </label>
              </div>
              {endDate && (
                <form className='row g-3'>
                  <div className='col-md-6'>
                    <label htmlFor='endDate' className='form-label'>
                      End date
                    </label>
                    <input
                      type='date'
                      min={minEndDate}
                      className='form-control'
                      id='endDate'
                      value={endTimings.endDate}
                      onChange={handleEndTimings}
                    />
                  </div>
                  <div className='col-md-6'>
                    <label htmlFor='endTime' className='form-label'>
                      End time (IST)
                    </label>
                    <input
                      type='time'
                      className='form-control'
                      id='endTime'
                      value={endTimings.endTime}
                      onChange={handleEndTimings}
                    />
                  </div>
                </form>
              )}
            </div>
          </div>
          <div className='col-md-4'>
            <div className='bgStyle'>
              <h6 className='mb-3'>Summary</h6>
              {method === 'Manual' ? (
                disCode.length === 0 ? (
                  <label className='summaryTxt'>No discount code yet</label>
                ) : (
                  <label className='summaryTxt'>
                    {disCode}
                    <FaRegCopy className='copyIcon' onClick={copyTxt} />
                  </label>
                )
              ) : disCode.length === 0 ? (
                <label className='summaryTxt'>No title yet</label>
              ) : (
                <label className='summaryTxt'>{disCode}</label>
              )}
              <h6>Type and method</h6>
              <ul>
                <li className='listPoint'>{selectedDiscount}</li>
                <li className='listPoint'>
                  {selectedDiscount === 'Buy X get Y'
                    ? 'Manual'
                    : 'Automatic & Manual'}
                </li>
              </ul>
              <h6>Details</h6>
              {disCode.length === 0 ? (
                <label className='mb-2'>
                  Can’t combine with other discounts
                </label>
              ) : (
                ''
              )}
              {disCode.length !== 0 ? (
                <ul className='mb-2'>
                  <li className='listPoint'>For Online Store</li>
                  <li className='listPoint'>All customers</li>
                  <li className='listPoint'>No usage limits</li>
                  <li className='listPoint'>
                    Can’t combine with other discounts
                  </li>
                  <li className='listPoint'>Active from today</li>
                </ul>
              ) : (
                ''
              )}
              {(disCode.length === 0) & (disCode.length !== 0) ? (
                <ul>
                  <li>For Online Store</li>
                  <li>Can’t combine with other discounts</li>
                  <li>Active from today</li>
                </ul>
              ) : (
                ''
              )}
              <h6>Performance</h6>
              <label>
                {discountStatus
                  ? 'Discount is active.'
                  : 'Discount is not active yet'}
              </label>
            </div>
            {method === 'Manual' && (
              <div className='bgStyle'>
                <h6>Sales channels</h6>
                <div className='form-check'>
                  <input
                    className='form-check-input'
                    type='checkbox'
                    checked={salesChannels.facebookAndInsta}
                    onChange={handleSalesChannels}
                    id='facebookAndInsta'
                  />
                  <label
                    className='form-check-label'
                    htmlFor='facebookAndInsta'>
                    Facebook & Instagram
                  </label>
                </div>
                <div className='form-check'>
                  <input
                    className='form-check-input'
                    type='checkbox'
                    checked={salesChannels.googleAndYoutube}
                    onChange={handleSalesChannels}
                    id='googleAndYoutube'
                  />
                  <label
                    className='form-check-label'
                    htmlFor='googleAndYoutube'>
                    Google & YouTube
                  </label>
                </div>
                <div className='form-check'>
                  <input
                    className='form-check-input'
                    type='checkbox'
                    checked={salesChannels.azistaStore}
                    onChange={handleSalesChannels}
                    id='azistaStore'
                  />
                  <label className='form-check-label' htmlFor='azistaStore'>
                    azistastore_mobile_app
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscountForm;
