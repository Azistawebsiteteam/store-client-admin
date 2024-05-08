import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaRegCopy } from "react-icons/fa";
import { LiaPercentSolid } from "react-icons/lia";
import { MdCurrencyRupee } from "react-icons/md";
import Multiselect from 'multiselect-react-dropdown';
import { useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios'
import '../Pages/Admin.css'

const DiscountForm = (props) => {
    const { selectedDiscount } = props
    const [code, setRandomCode] = useState('')
    const [method, setMethodTab] = useState('discountCode')
    console.log(method, 'method')
    const [autoCode, setAutoCode] = useState('')
    const [amtOfPrdctsDscntVal, setAmtOfPrdctsDscntVal] = useState('percentage')
    const [amtOfOrdersDscntVal, setAmtOfOrderssDscntVal] = useState('percentage')
    const [discountVal, setDiscountVal] = useState()
    const [productsList, setProductsList] = useState([])
    const [selectedListItem, setSelectedListItem] = useState([])
    const [customerSpendsSelectedListItem, setCustomerSpendsSelectedListItem] = useState([])
    const [customerGetsSelectedListItem, setCustomerGetsSelectedListItem] = useState([])

    const [collectionsList, setCollectionsList] = useState([])
    const [discountAppliedValue, setDiscountAppliedValue] = useState('collections')
    const [applyDiscoun, setApplyDiscount] = useState(false)
    const [minPurReq, setMinPurReq] = useState('')
    const [custEligibility, setCustEligibility] = useState('')
    const [minPurInputVal, setMinPurInputVal] = useState({
        minAmountField: '',
        minQuantityField: ''
    })
    const [maxDisUses, setMaxDisUses] = useState({
        mutipleTimeDiscntUses: '',
        oneTimeUser: ''
    })
    const [usageLimit, setUsageLimit] = useState('')
    const [combinations, setCombinations] = useState({
        productDiscounts: '',
        orderDiscounts: '',
        shippingDiscounts: ''
    })
    const [endDate, setEndDate] = useState(false)
    const [startTimings, setStartTimings] = useState({
        startDate: '',
        startTime: ''
    })
    const [endTimings, setEndTimings] = useState({
        endDate: '',
        endTime: ''
    })
    const [salesChannels, setSalesChannels] = useState({
        facebookAndInsta: '',
        googleAndYoutube: '',
        azistaStore: ''
    })
    const [customerBuy, setCustomerBuy] = useState('')
    const [specificItems, setSpecificItems] = useState('')
    const [custGetsQuant, setCustGetsQuant] = useState('')
    const [customerBuysItems, setCustomerBuysItems] = useState('')
    const [discountedValues, setDiscountedValues] = useState('')
    const [discountInputs, setDiscountInputs] = useState({
        discountInAmount: "",
        discountInPercentage: ""
    })
    const [maxUses, setMaxUses] = useState()
    const [maxUsesInput, setMaxUsesInput] = useState('')
    const [shippingRatesForCountries, setShippingRatesForCountries] = useState('radios1')
    const [excludeShippingRate, setExcludeShippingRate] = useState(false)
    console.log(shippingRatesForCountries)
    const baseUrl = process.env.REACT_APP_API_URL
    const jwtToken = process.env.REACT_APP_ADMIN_JWT_TOKEN
    const token = Cookies.get(jwtToken)

    useEffect(() => {
        const productDetails = async () => {
            try {
                const productsUrl = `${baseUrl}/product/all-products`
                const collectionsUrl = `${baseUrl}/collections/data`
                const headers = {
                    Authorization: `Bearer ${token} `
                }
                const [productsData, collectionsData] = await Promise.all([
                    axios.post(productsUrl, {}, { headers }),
                    axios.get(collectionsUrl, { headers })
                ])
                setProductsList(productsData.data.products)
                setCollectionsList(collectionsData.data)
            } catch (error) {
                console.log(error)
            };
        }; productDetails();
    }, [token, baseUrl])

    const handleSubmitButton = () => {
        try {
            const url = `${baseUrl}/discounts`
            const headers = {
                Authorization: `Bearer ${token}`
            }
            const body = {
                'selectedDiscount': selectedDiscount,
                'method': method,
                'dicountCode': method === 'Automatic' ? autoCode : code,

                'dicountVal': discountVal,
                'appliesTo': selectedListItem,
                'applyDiscoun': applyDiscoun,

                'Combinations': combinations,
                'minPurReq': minPurReq + `${minPurReq === 'minAmount' ? minPurInputVal.minAmountField : minPurInputVal.minQuantityField}`,

            }

        } catch (error) {
            console.log(error)
        }
    }
    console.log(minPurReq, 'minPurReq')
    const generateRandomCode = () => {
        let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZ'
        let randomcode = ''
        for (var i = 0; i < 12; i++) {
            let index = Math.ceil(Math.random() * (chars.length - 1))
            randomcode += chars[index]
        }
        setRandomCode(randomcode)
    }

    const navigate = useNavigate()

    const handleMethodTab = (tab) => {
        setMethodTab(tab)
        if (tab === 'discountCode') {
            setAutoCode('')
        } else {
            setRandomCode('')
        }
    }
    const handleCodeInput = (e) => {
        setRandomCode(e.target.value)
    }
    const handleAutoCode = (e) => {
        setAutoCode(e.target.value)
    }
    const copyTxt = () => {
        navigator.clipboard.writeText(code);
    }
    const handleAmountOfProductsDiscounts = (e) => {
        setAmtOfPrdctsDscntVal(e.target.value)
    }
    const handleAmountOfOrdersDiscounts = (e) => {
        setAmtOfOrderssDscntVal(e.target.value)
    }

    const handleDiscountBlock = (e) => {
        setDiscountVal(e.target.value)
    }

    const onSelectedValue = (selectedItem) => {
        setSelectedListItem(selectedItem)
    }

    const onSelectedCustomerSpendsValue = (selectedItem) => {
        setCustomerSpendsSelectedListItem(selectedItem)
    }
    const onSelectedCustomerGetsValue = (selectedItem) => {
        setCustomerGetsSelectedListItem(selectedItem)
    }
    const handleDiscountAppliedTo = (e) => {
        setDiscountAppliedValue(e.target.value)
    }
    const handleApplyDiscount = (e) => {
        setApplyDiscount({ ...applyDiscoun, [e.target.id]: e.target.checked })
    }

    const handleMinPurReq = (e) => {
        setMinPurReq(e.target.value)
    }

    const handleMinPurReqInput = (e) => {
        setMinPurInputVal({ ...minPurInputVal, [e.target.id]: e.target.value })
    }

    const customerEligibility = (e) => {
        setCustEligibility(e.target.value)
    }

    const handleMaxDisUses = (e) => {
        setMaxDisUses({ ...maxDisUses, [e.target.id]: e.target.checked })
    }

    const handleUsageLimit = (e) => {
        setUsageLimit(e.target.value)
    }

    const handleCombination = (e) => {
        setCombinations({ ...combinations, [e.target.id]: e.target.checked })
    }

    const handleEndDate = (e) => {
        setEndDate(e.target.checked)
    }

    const handleStartTimings = (e) => {
        setStartTimings({ ...startTimings, [e.target.id]: e.target.value })
    }

    const handleEndTimings = (e) => {
        setEndTimings({ ...endTimings, [e.target.id]: e.target.value })
    }

    const handleSalesChannels = (e) => {
        setSalesChannels({ ...salesChannels, [e.target.id]: e.target.checked })
    }

    const handleCustomerBuy = (e) => {
        setCustomerBuy(e.target.value)
    }
    const handleSpecificItems = (e) => {
        setSpecificItems(e.target.value)
    }
    const handleCustGetsQuant = (e) => {
        setCustGetsQuant(e.target.value)
    }
    const handleCustomerBuysItems = (e) => {
        setCustomerBuysItems(e.target.value)
    }

    const handleDiscountedValues = (e) => {
        setDiscountedValues(e.target.id)
    }
    const handleDiscountInputs = (e) => {
        setDiscountInputs({ ...discountInputs, [e.target.id]: e.target.value })
    }

    const handleMaxUses = (e) => {
        setMaxUses(e.target.checked)
    }

    const handleMaxUsesCount = (e) => {
        setMaxUsesInput(e.target.value)
    }

    const handleShippingRatesForCountries = (e) => {
        setShippingRatesForCountries(e.target.id)
    }
    const handleExcludeShippingRate = (e) => {
        setExcludeShippingRate(e.target.checked)
    }
    return (
        <div>
            <div className='col-sm-12'>
                <div className='d-flex justify-content-between mb-4'>
                    <h3>Selected Discount</h3>
                </div>
            </div>
            <div className='col-sm-12'>
                <div className='row'>
                    <div className='col-md-8'>
                        <div className='bgStyle'>
                            <div className='d-flex justify-content-between'>
                                <h6>{selectedDiscount}</h6>
                                <h6>{(selectedDiscount === 'Amount of products' || selectedDiscount === 'Buy X get Y') && 'Product discount'}{selectedDiscount === 'Amount of Orders' && 'Order discount'}{selectedDiscount === 'Free shipping' && 'Shipping discount'}</h6>
                            </div>
                            <div className=''>
                                <label htmlFor="" className="form-label">Method</label>
                                <div className='methodBtnCont'>
                                    <button className={`methodBtn ${method === 'discountCode' && 'active'}`} onClick={() => handleMethodTab('discountCode')}>Discount code</button>
                                    <button className={`methodBtn ${method === 'Automatic' && 'active'}`} onClick={() => handleMethodTab('Automatic')}>Automatic discount</button>
                                </div>
                            </div>

                            {method === 'Automatic' && <div className="">
                                <label htmlFor="title" className="form-label">Title</label>
                                <input type="text" className="form-control" id="title" value={autoCode} onChange={handleAutoCode} />
                                <span>Customers will see this in their cart and at checkout.</span>
                            </div>}
                            {method === 'discountCode' && <div className="">
                                <div className='d-flex justify-content-between'>
                                    <label htmlFor="" className="form-label">Discount code</label>
                                    <button className="generateCodeBtn" onClick={generateRandomCode}>Generate random code</button>
                                </div>
                                <input type="text" value={code} onChange={handleCodeInput} className="form-control" id="" />
                                <span>Customers must enter this code at checkout.</span>
                            </div>}
                        </div>
                        {selectedDiscount === 'Buy X get Y' ? <div className='bgStyle'>
                            <div className=''>
                                <h6>Customer spends</h6>
                                <div className="form-check">
                                    <input className="form-check-input" type="radio" name="CustomerBuys" id="customerBuysMinItems" value='minimumQuantityOfItems' onChange={handleCustomerBuy} />
                                    <label className="form-check-label" htmlFor="customerBuysMinItems">
                                        Minimum quantity of items
                                    </label>
                                </div>
                                <div className="form-check">
                                    <input className="form-check-input" type="radio" name="CustomerBuys" id="customerMinimumPurchase" value='minimumPurchaseAmount' onChange={handleCustomerBuy} />
                                    <label className="form-check-label" htmlFor="customerMinimumPurchase">
                                        Minimum purchase amount
                                    </label>
                                </div>
                                <div className="row">
                                    <div className="col-md-4">
                                        <label className="form-check-label" htmlFor="CustomerBuysQuantity">{customerBuy === 'minimumQuantityOfItems' ? 'Quantity' : 'Amount'}</label>
                                        <input type="text" className="form-control" id="CustomerBuysQuantity" />
                                    </div>
                                    <div className="col-md-8">
                                        <label className="form-check-label" htmlFor="CustomerBuysAnyItems">Any items from</label>
                                        <select id="CustomerBuysAnyItems" className="form-select" value={specificItems} onChange={handleSpecificItems} aria-label="Default select example">
                                            <option value="specificCollections">Specific collections</option>
                                            <option value="specificProducts">Specific products</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="mt-3 mb-3">
                                    <Multiselect
                                        displayValue={specificItems === "specificProducts" ? 'product_title' : 'azst_collection_name'}
                                        onRemove={onSelectedCustomerSpendsValue}
                                        selectedValues={customerSpendsSelectedListItem}
                                        onSelect={onSelectedCustomerSpendsValue}
                                        options={specificItems === "specificProducts" ? productsList : collectionsList}
                                        placeholder={specificItems === "specificProducts" ? 'Select products' : 'Select collections'}
                                    />
                                </div>
                            </div>
                            <hr />
                            <div className=''>
                                <h6>Customer gets</h6>
                                <p>Customers must add the quantity of items specified below to their cart.</p>
                                <div className="row">
                                    <div className="col-md-4">
                                        <label className="form-check-label" htmlFor="CustomerBuysQuantity">Quantity</label>
                                        <input type="text" value={custGetsQuant} onChange={handleCustGetsQuant} className="form-control" id="CustomerBuysQuantity" />
                                    </div>
                                    <div className="col-md-8">
                                        <label className="form-check-label" htmlFor="CustomerBuysAnyItems">Any items from</label>
                                        <select id="CustomerBuysAnyItems" value={customerBuysItems} onChange={handleCustomerBuysItems} className="form-select" aria-label="Default select example">
                                            <option value="specificCollections">Specific collections</option>
                                            <option value="specificProducts">Specific products</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="mt-3 mb-3">
                                    <Multiselect
                                        displayValue={customerBuysItems === "specificProducts" ? 'product_title' : 'azst_collection_name'}
                                        onRemove={onSelectedCustomerGetsValue}
                                        selectedValues={customerGetsSelectedListItem}
                                        onSelect={onSelectedCustomerGetsValue}
                                        options={customerBuysItems === "specificProducts" ? productsList : collectionsList}
                                        placeholder={customerBuysItems === "specificProducts" ? 'Search products' : 'Search collections'}
                                    />
                                </div>
                            </div>
                            <hr />
                            <div className=''>
                                <h6>At a discounted value</h6>
                                <div className="form-check">
                                    <input className="form-check-input" onChange={handleDiscountedValues} type="radio" name="atDiscount" id="atDiscountPercentage" />
                                    <label className="form-check-label" htmlFor="atDiscountPercentage">
                                        Percentage
                                    </label>
                                    {discountedValues === 'atDiscountPercentage' &&
                                        <input type="text" onChange={handleDiscountInputs} id="discountInPercentage" value={discountInputs.discountInPercentage} className="d-block" />}
                                </div>
                                <div className="form-check">
                                    <input className="form-check-input" onChange={handleDiscountedValues} type="radio" name="atDiscount" id="atDiscountAmount" />
                                    <label className="form-check-label" htmlFor="atDiscountAmount">
                                        Amount off each
                                    </label>
                                    {discountedValues === "atDiscountAmount" &&
                                        <><input type="text" onChange={handleDiscountInputs} id="discountInAmount" className="d-block" value={discountInputs.discountInAmount} />
                                            <span>For multiple quantities, the discount amount will be taken off each Y item.</span></>}
                                </div>
                                <div className="form-check">
                                    <input className="form-check-input" onChange={handleDiscountedValues} type="radio" name="atDiscount" id="fullDiscount" />
                                    <label className="form-check-label" htmlFor="fullDiscount">
                                        Free
                                    </label>
                                </div>
                            </div>
                            <hr />
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" checked={maxUses} onChange={handleMaxUses} id="setMaximumUses" />
                                <label className="form-check-label" htmlFor="setMaximumUses">
                                    Set a maximum number of uses per order
                                </label>
                                {maxUses &&
                                    <input type="text" id="maxUsesInput" value={maxUsesInput} onChange={handleMaxUsesCount} className="d-block" />}
                            </div>
                        </div> : ''}
                        {selectedDiscount === 'Free shipping' ?
                            <div className='bgStyle'>
                                <h6>Countries</h6>
                                <div className="form-check">
                                    <input className="form-check-input" onChange={handleShippingRatesForCountries} type="radio" name="countries" id="radios1" />
                                    <label className="form-check-label" htmlFor="radios1">
                                        All countries
                                    </label>
                                </div>
                                <div className="form-check">
                                    <input className="form-check-input" onChange={handleShippingRatesForCountries} type="radio" name="countries" id="radios2" />
                                    <label className="form-check-label" htmlFor="radios2">
                                        India
                                    </label>
                                </div>
                                <div className="form-check">
                                    <input className="form-check-input" onChange={handleShippingRatesForCountries} type="radio" name="countries" id="radios3" />
                                    <label className="form-check-label" htmlFor="radios3">
                                        Rest of world
                                    </label>
                                </div>
                                <h6>Shipping rates</h6>
                                <div class="form-check">
                                    <input class="form-check-input" checked={excludeShippingRate} onChange={handleExcludeShippingRate} type="checkbox" id="shippingRates" />
                                    <label class="form-check-label" htmlFor="shippingRates">
                                        Exclude shipping rates over a certain amount
                                    </label>
                                </div>
                            </div> : ''
                        }
                        {selectedDiscount === 'Amount of products' ?
                            <div className='bgStyle'>
                                <h6>Discount Value</h6>
                                <div className="row">
                                    <div className="col-md-8">
                                        <select className="form-select" value={amtOfPrdctsDscntVal} onChange={handleAmountOfProductsDiscounts} aria-label="Default select example">
                                            <option value="percentage">Percentage</option>
                                            <option value="fixed Amount">Fixed Amount</option>
                                        </select>
                                    </div>
                                    <div className="col-md-4">
                                        {amtOfPrdctsDscntVal === "percentage" ? <div className='discountBlock'><input type="text" value={discountVal} onChange={handleDiscountBlock} className="form-control amtInpt" /><LiaPercentSolid className='percentageSign' /></div> : <div className='discountBlock'><input value={discountVal} type="text" className="form-control amtInpt" onChange={handleDiscountBlock} placeholder='0.00' /><MdCurrencyRupee className='rupeeSign' /></div>}
                                    </div>
                                </div>
                                <h6>Applies to</h6>
                                <select className="form-select" value={discountAppliedValue} onChange={handleDiscountAppliedTo} aria-label="Default select example">
                                    <option value="collections">Specific collections</option>
                                    <option value="products">Specific Products</option>
                                </select>

                                <div className="mt-3 mb-3">
                                    <Multiselect
                                        displayValue={discountAppliedValue === "products" ? 'product_title' : 'azst_collection_name'}
                                        onRemove={onSelectedValue}
                                        selectedValues={selectedListItem}
                                        onSelect={onSelectedValue}
                                        options={discountAppliedValue === "products" ? productsList : collectionsList}
                                        placeholder={discountAppliedValue === "products" ? 'Select products' : 'Select collections'}
                                    />
                                </div>
                                <div className="mb-3 form-check">
                                    <input type="checkbox" checked={applyDiscoun} className="form-check-input" id="applydiscount" onChange={handleApplyDiscount} />
                                    <label className="form-check-label" htmlFor="applydiscount">Only apply discount once per order</label>
                                    <p>If not selected, the amount will be taken off each eligible item in an order.</p>
                                </div>
                            </div> : ''}
                        {selectedDiscount === 'Amount of Orders' ?
                            <div className='bgStyle'>
                                <h6>Discount Value</h6>
                                <div className="row">
                                    <div className="col-md-8">
                                        <select className="form-select" value={amtOfOrdersDscntVal} onChange={handleAmountOfOrdersDiscounts} aria-label="Default select example">
                                            <option value="percentage">Percentage</option>
                                            <option value="fixed Amount">Fixed Amount</option>
                                        </select>
                                    </div>
                                    <div className="col-md-4">
                                        {amtOfOrdersDscntVal === "percentage" ? <div className='discountBlock'><input type="text" value={discountVal} onChange={handleDiscountBlock} className="form-control amtInpt" /><LiaPercentSolid className='percentageSign' /></div> : <div className='discountBlock'><input value={discountVal} type="text" className="form-control amtInpt" onChange={handleDiscountBlock} placeholder='0.00' /><MdCurrencyRupee className='rupeeSign' /></div>}
                                    </div>
                                </div>
                            </div> : ''}
                        {selectedDiscount !== 'Buy X get Y' ?
                            <div className='bgStyle'>
                                <div className=''>
                                    <h6>Minimum purchase requirements</h6>
                                    <div className="form-check">
                                        <input onChange={handleMinPurReq} className="form-check-input" type="radio" name="minPurReq" id="noMinReq" value='noMinReq' />
                                        <label className="form-check-label" htmlFor="noMinReq">
                                            No minimum requirements
                                        </label>
                                    </div>
                                    <div className="form-check">
                                        <input onChange={handleMinPurReq} className="form-check-input" type="radio" name="minPurReq" id="minAmount" value='minAmount' />
                                        <label className="form-check-label" htmlFor="minAmount">
                                            Minimum purchase amount (₹)
                                        </label>
                                        {minPurReq === 'minAmount' && <div className=''>
                                            <div className='discountBlock'><input className="amtInpt" type='text' onChange={handleMinPurReqInput} value={minPurInputVal.minAmountField} id="minAmountField" placeholder='0.00' /><MdCurrencyRupee style={{ top: '8px' }} className='rupeeSign' /></div>
                                            <p>Applies only to selected products.</p>
                                        </div>}
                                    </div>
                                    <div className="form-check">
                                        <input onChange={handleMinPurReq} className="form-check-input" type="radio" name="minPurReq" id="minQuantity" value='minQuantity' />
                                        <label className="form-check-label" htmlFor="minQuantity">
                                            Minimum quantity of items
                                        </label>
                                        {minPurReq === 'minQuantity' && <div className=''>
                                            <input type='text' onChange={handleMinPurReqInput} value={minPurInputVal.minQuantityField} id="minQuantityField" />
                                            <p>Applies only to selected products.</p>
                                        </div>}
                                    </div>
                                </div>
                            </div> : ''}
                        <div className='bgStyle'>
                            <div className=''>
                                <h6>Customer eligibility</h6>
                                <div className="form-check">
                                    <input className="form-check-input" onChange={customerEligibility} type="radio" name="customerEligibility" id="allCustomers" value='allCustomers' />
                                    <label className="form-check-label" htmlFor="allCustomers">
                                        All customers
                                    </label>
                                </div>
                                {/* <div className="form-check">
                                    <input className="form-check-input" onChange={customerEligibility} type="radio" name="customerEligibility" id="specificCustomerSegments" value="specificCustomerSegments" />
                                    <label className="form-check-label" htmlFor="specificCustomerSegments">
                                        Specific customer segments
                                    </label>
                                    {custEligibility === "specificCustomerSegments" && <div className="mt-2">
                                        <Multiselect
                                            displayValue={discountAppliedValue === "products" ? 'product_title' : 'azst_collection_name'}
                                            onRemove={onSelectedValue}
                                            selectedValues={selectedListItem}
                                            onSelect={onSelectedValue}
                                            options={discountAppliedValue === "products" ? productsList : collectionsList}
                                            placeholder='Search customer segments'
                                        />
                                    </div>}
                                </div> */}
                                <div className="form-check">
                                    <input className="form-check-input" onChange={customerEligibility} type="radio" name="customerEligibility" id="specificCustomer" value="specificCustomer" />
                                    <label className="form-check-label" htmlFor="specificCustomer">
                                        Specific customers
                                    </label>
                                    {custEligibility === "specificCustomer" && <div className="mt-2">
                                        <Multiselect
                                            displayValue={discountAppliedValue === "products" ? 'product_title' : 'azst_collection_name'}
                                            onRemove={onSelectedValue}
                                            selectedValues={selectedListItem}
                                            onSelect={onSelectedValue}
                                            options={discountAppliedValue === "products" ? productsList : collectionsList}
                                            placeholder='Search customers'
                                        />
                                    </div>}
                                </div>
                            </div>
                        </div>
                        <div className='bgStyle'>
                            <div className=''>
                                <h6>Maximum discount uses</h6>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" value="" onChange={handleMaxDisUses} id="mutipleTimeDiscntUses" />
                                <label className="form-check-label" htmlFor="mutipleTimeDiscntUses">
                                    Limit number of times this discount can be used in total
                                </label>
                                {maxDisUses.mutipleTimeDiscntUses && <input className="form-input d-block" type='number' id='usageLimit' value={usageLimit} onChange={handleUsageLimit} />}
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" value="" id="oneTimeUser" onChange={handleMaxDisUses} />
                                <label className="form-check-label" htmlFor="oneTimeUser">
                                    Limit to one use per customer
                                </label>
                            </div>
                        </div>
                        {/* <div className='bgStyle'>
                            <div className=''>
                                <h6>Combinations</h6>
                                <p>This product discount can be combined with:</p>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" value="" id="productDiscounts" checked={combinations.productDiscounts} onChange={handleCombination} />
                                <label className="form-check-label" htmlFor="productDiscounts">
                                    Product discounts
                                </label>
                                {combinations.productDiscounts &&
                                    <p>No product discounts are set to combine. To let customers use more than one discount, set up at least one product discount that combines with product discounts.</p>
                                }
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" value="" id="orderDiscounts" checked={combinations.orderDiscounts} onChange={handleCombination} />
                                <label className="form-check-label" htmlFor="orderDiscounts">
                                    Order discounts
                                </label>
                                {combinations.orderDiscounts &&
                                    <p>No order discounts are set to combine. To let customers use more than one discount, set up at least one order discount that combines with product discounts.</p>
                                }
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" value="" id="shippingDiscounts" checked={combinations.shippingDiscounts} onChange={handleCombination} />
                                <label className="form-check-label" htmlFor="shippingDiscounts">
                                    Shipping discounts
                                </label>
                                {combinations.shippingDiscounts &&
                                    <p>No shipping discounts are set to combine. To let customers use more than one discount, set up at least one shipping discount that combines with product discounts.</p>
                                }
                            </div>
                        </div> */}
                        <div className='bgStyle'>
                            <h6>Active dates</h6>
                            <form className="row g-3">
                                <div className="col-md-6">
                                    <label htmlFor="startDate" className="form-label">Start date</label>
                                    <input type="date" className="form-control" id="startDate" value={startTimings.startDate} onChange={handleStartTimings} />
                                </div>
                                <div className="col-md-6">
                                    <label htmlFor="startTime" className="form-label">Start time (IST)</label>
                                    <input type="time" className="form-control" id="startTime" value={startTimings.startTime} onChange={handleStartTimings} />
                                </div>
                            </form>
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" value={endDate} onChange={handleEndDate} id="setEndDate" />
                                <label className="form-check-label" htmlFor="setEndDate">
                                    Set end date
                                </label>
                            </div>
                            <form className="row g-3">
                                <div className="col-md-6">
                                    <label htmlFor="endDate" className="form-label">End date</label>
                                    <input type="date" className="form-control" id="endDate" value={endTimings.endDate} onChange={handleEndTimings} />
                                </div>
                                <div className="col-md-6">
                                    <label htmlFor="endTime" className="form-label">End time (IST)</label>
                                    <input type="time" className="form-control" id="endTime" value={endTimings.startDate} onChange={handleEndTimings} />
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className='col-md-4'>
                        <div className='bgStyle'>
                            <h6>Summary</h6>
                            {method === 'discountCode' ? code.length === 0 ? <p className='summaryTxt'>No discount code yet</p> : <p className='summaryTxt'>{code}<FaRegCopy className="copyIcon" onClick={copyTxt} /></p> :
                                autoCode.length === 0 ? <p className='summaryTxt'>No title yet</p> : <p className='summaryTxt'>{autoCode}</p>}
                            <h6>Type and method</h6>
                            <ul>
                                <li>{selectedDiscount}</li>
                                <li>{method}</li>
                            </ul>
                            <h6>Details</h6>
                            {(code.length === 0 & autoCode.length === 0) ? <p>Can’t combine with other discounts</p> : ''}
                            {(code.length !== 0 & autoCode.length === 0) ? <ul>
                                <li>For Online Store</li>
                                <li>All customers</li>
                                <li>No usage limits</li>
                                <li>Can’t combine with other discounts</li>
                                <li>Active from today</li>
                            </ul> : ''}
                            {(code.length === 0 & autoCode.length !== 0) ? <ul>
                                <li>For Online Store</li>
                                <li>Can’t combine with other discounts</li>
                                <li>Active from today</li>
                            </ul> : ''}
                            <h6>Performance</h6>
                            <p>Discount is not active yet</p>
                        </div>
                        {method === 'discountCode' && <div className='bgStyle'>
                            <h6>Sales channels</h6>
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" checked={salesChannels.facebookAndInsta} onChange={handleSalesChannels} id="facebookAndInsta" />
                                <label className="form-check-label" htmlFor="facebookAndInsta">
                                    Facebook & Instagram
                                </label>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" checked={salesChannels.googleAndYoutube} onChange={handleSalesChannels} id="googleAndYoutube" />
                                <label className="form-check-label" htmlFor="googleAndYoutube">
                                    Google & YouTube
                                </label>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" checked={salesChannels.azistaStore} onChange={handleSalesChannels} id="azistaStore" />
                                <label className="form-check-label" htmlFor="azistaStore">
                                    azistastore_mobile_app
                                </label>
                            </div>
                        </div>}
                    </div>
                    <div className='col-md-12 d-flex justify-content-end mt-4'>
                        <button className='dltBtn' onClick={() => navigate(-1)} style={{ marginRight: '10px' }}>Discard</button>
                        <button className='saveBtn' onClick={handleSubmitButton}>Save discount</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DiscountForm