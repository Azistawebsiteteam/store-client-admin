/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useCallback, useContext } from 'react';

import { Link, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios'
import { v4 } from 'uuid'

import TextEditor from './TextEditor'
import Dropdown from 'react-bootstrap/Dropdown';
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaBusinessTime } from "react-icons/fa6";
import PopupModal from './PopupModal'
import Button from 'react-bootstrap/Button';
import Multiselect from 'multiselect-react-dropdown';


import { RiDeleteBin6Line } from "react-icons/ri";

import { FaRegFileImage } from "react-icons/fa";
import { IoMdArrowDropup, IoMdArrowDropdown } from "react-icons/io";
import { productContext } from '../Context/ProductContext'


import './Admin.css'
import VariantEdit from './VariantEdit';




const AddProductForm = (props) => {
    const location = useLocation()
    const { productProps } = props
    const { title, error, setError, setTitle, setMetaDetails,
        metaDetails, setVariantsGroup, setVariantsDetials, variantsDetails, variants, setSubVariantsVisibility, subVariantsVisibility,
        content, setContent, images, setVariants, variantsThere, tracker, setTracker, setCollectionValue, collectionValue, setHandleLoc, handleLoc,
        setChintalLoc, setLocValues, locValues, setLocInputs, locInputs, setCorporateLoc, setIsShipping, isShipping, setVariant,
        setProductPrices, productPrices, setSkuInput, skuInput, setWeight, setProductCategory, productCategory, setTagValue, tagValue, setImages,
        variantGroup, setSiteShow, setVariantShow, modal2Show, modal1Show, modal3Show, setStoreShow, productStatus, setProductStatus, originCountry, setOriginCountry,
        weight, weightUnit, setWeightUnit, setIsSKU, isSKU, chintalLoc, corporateLoc
    } = productProps


    const [countriesList, setCountries] = useState()
    const [categoryItems, setCategoryItems] = useState([])
    const [tags, setTags] = useState([])

    const [vendors, setVendors] = useState()
    const [collections, setCollections] = useState([])

    const baseUrl = process.env.REACT_APP_API_URL
    const jwtToken = process.env.REACT_APP_ADMIN_JWT_TOKEN
    const token = Cookies.get(jwtToken)


    useEffect(() => {
        const apiCallback = async () => {
            const categoryUrl = `${baseUrl}/category/data`
            const tagsUrl = `${baseUrl}/tags/data`
            const vendorUrl = `${baseUrl}/vendors/details`
            const collectionsUrl = `${baseUrl}/collections/data`
            const headers = {
                Authorization: `Bearer ${token}`
            }
            const countriesUrl = `https://countriesnow.space/api/v0.1/countries/capital`
            try {
                const [categoryList, tagsList, vendorsList, countriesList, collectionsList] = await Promise.all([
                    axios.get(categoryUrl),
                    axios.get(tagsUrl),
                    axios.get(vendorUrl, { headers }),
                    axios.get(countriesUrl),
                    axios.get(collectionsUrl)
                ]);

                if (categoryList.status === 200) {
                    setCategoryItems(categoryList.data)
                }
                if (tagsList.status === 200) {
                    setTags(tagsList.data)
                }
                if (countriesList.status === 200) {
                    setCountries(countriesList.data)
                }
                if (vendorsList.status === 200) {
                    setVendors(vendorsList.data)
                }
                if (collectionsList.status === 200) {
                    setCollections(collectionsList.data)
                }
            } catch (error) {
                console.log(error)
            }
        };
        apiCallback();
    }, [baseUrl, token])


    const { variantDetails } = useContext(productContext)

    const generateOptions = useCallback(() => {
        const result = [];

        let mainOptionsobj = variants.find((v) => v.optionName === variantGroup)
        if (variants.length > 0 && variants[0].isDone === true && mainOptionsobj) {
            const mainOptions = mainOptionsobj.optionValue;
            const subOptions = variants.filter((v) => v.optionName !== variantGroup);

            mainOptions.forEach((mainOption) => {
                if (mainOption !== '') {
                    const main = { value: mainOption, variantImage: "", amount: 0, quantity: 0 };
                    const sub = [];

                    const recursiveGenerateSubOptions = (currentIndex, subVariant) => {
                        if (currentIndex === subOptions.length) {
                            const variants = subVariant.join('-')
                            sub.push({ id: v4(), value: variants, variantImage: "", amount: 0, quantity: 0 });
                            return;
                        }

                        subOptions[currentIndex].optionValue.forEach((subValue) => {
                            if (subValue === "") return;
                            recursiveGenerateSubOptions(currentIndex + 1, [
                                ...subVariant,
                                subValue,
                            ]);
                        });
                    };
                    if (subOptions.length > 0) {
                        recursiveGenerateSubOptions(0, []);
                    }

                    result.push({ id: v4(), main, sub });
                }
            });
        }

        return result;
    }, [variants, variantGroup]); // Dependencies htmlFor useCallback



    useEffect(() => {
        const variantsData = generateOptions()
        setVariantsDetials(variantsData)
        if (variants.length <= 1) {
            setVariantsGroup(variants[0]?.optionName || "")
        }

    }, [generateOptions, variants, variantGroup])


    const trackQty = () => {
        setTracker(!tracker)
    }

    const tagsDisplayOptions = tags.map(({ azst_tag_id, azst_tag_name }) => ({
        label: azst_tag_name,
        value: azst_tag_id,
    }));

    const onSelectCollection = (selectedItem) => {

        setCollectionValue(selectedItem.map(each => each.collection_url_title));
    }

    const handleConditions = (e) => {
        setHandleLoc({ ...handleLoc, [e.target.id]: e.target.checked })
    }

    const handleChintalLoc = (e) => {
        setChintalLoc(e.target.checked)
        if (e.target.checked) {
            setLocValues(e.target.checked)
            setLocInputs({ ...locInputs, coc: "", inventoryIds: [...locInputs.inventoryIds, '1'] })
        } else {
            setLocValues(e.target.checked)
            const updatedIds = locInputs.inventoryIds.filter(inv => (inv !== '1'))
            setLocInputs({
                ...locInputs, inventoryIds: updatedIds
            })
            delete locInputs.coc
        }
    }

    const handleCorporateLoc = (e) => {
        setCorporateLoc(e.target.checked)
        if (e.target.checked) {
            setLocValues(e.target.checked)
            setLocInputs({ ...locInputs, coh: "", inventoryIds: [...locInputs.inventoryIds, '2'] })
        } else {
            setLocValues(e.target.checked)
            const updatedIds = locInputs.inventoryIds.filter(inv => (inv !== '2'))
            setLocInputs({
                ...locInputs, inventoryIds: updatedIds
            })
            delete locInputs.coh
        }
    }

    const handleLocValues = (e) => {
        e.preventDefault()
        const selectState = !locValues
        setLocValues(!locValues)
        setChintalLoc(selectState)
        setCorporateLoc(selectState)
        if (selectState) {
            setLocInputs({ coc: '', coh: "", inventoryIds: ['1', '2'] })
        } else {
            setLocInputs({})
        }
    }

    const handleSku = (e) => {
        setIsSKU(e.target.checked)
    }

    const handleShipping = () => {
        setIsShipping(!isShipping)
    }

    const handleVariantChange = (e, id) => {
        const newVariants = [...variants];
        const variantIndex = newVariants.findIndex((v) => v.id === id);
        newVariants[variantIndex].optionName = e.target.value;

        setVariants(newVariants);
    }

    const onChangeVariantValue = (e, id, i) => {
        e.preventDefault()
        const newVariants = [...variants]
        const variantIndex = newVariants.findIndex(v => v.id === id)
        newVariants[variantIndex].optionValue[i] = e.target.value
        if (e.target.value.length === 1 && newVariants[variantIndex].optionValue.length - 1 === i) {
            newVariants[variantIndex].optionValue.push('')
            setVariant(newVariants)
        }
        setVariant(newVariants)
    }

    const deleteInput = (e, id, i) => {
        e.preventDefault()
        const newVariants = [...variants];
        const variantIndex = newVariants.findIndex((v) => v.id === id);
        newVariants[variantIndex].optionValue.splice(i, 1);
        setVariants(newVariants);
    }

    const changeOptionMode = (e, id) => {
        e.preventDefault();
        setVariant(preVariants => (
            preVariants.map(variant => {
                if (variant.id === id) {
                    return { ...variant, isDone: !variant.isDone }
                } return variant
            })
        ))
    }

    const addVarient = (e) => {
        e.preventDefault();
        const count = variants.length
        if (count < 3) {
            setVariant(prevVariants => [...prevVariants, {
                id: v4(), optionName: "size",
                optionValue: [''],
                isDone: false
            }])
        }
    }

    const deleteVariant = async (e, id) => {
        e.preventDefault();
        const count = variants.length
        if (count > 0) {
            const updatedVariants = variants.filter(variant => variant.id !== id)
            setVariant(updatedVariants)
        }
    }

    const handleProductPrices = (e) => {
        if (e.target.id === 'isTaxable') {
            setProductPrices({ ...productPrices, [e.target.id]: e.target.checked })
        } else {
            setProductPrices({ ...productPrices, [e.target.id]: e.target.value })
        }
    }

    const handleLocationInputs = (e) => {
        setLocInputs({ ...locInputs, [e.target.id]: e.target.value })
    }

    const handleSkuInput = (e) => {
        setSkuInput({ ...skuInput, [e.target.id]: e.target.value })
    }

    const handleWeight = (e) => {
        setWeight(e.target.value)
    }

    const handleProductCategorization = (e) => {
        setProductCategory({ ...productCategory, [e.target.id]: e.target.value })
    }

    const onSelectTag = (selectedItem) => {

        setTagValue(selectedItem.map(each => { return (each.label) }))
    }

    const onChangeImages = (e) => {
        const newFiles = Array.from(e.target.files);
        setImages(newFiles)
    }

    const handleVariantsImage = (e, vid, type, subId) => {
        setVariantsDetials(
            variantsDetails.map(eachVariant => {
                if (eachVariant.id === vid) {
                    if (type === 'main') {
                        return {
                            ...eachVariant, main: { ...eachVariant.main, variantImage: e.target.files[0] }
                        }
                    } else {
                        // Use map to return the updated sub-variants
                        const updatedSubVariants = eachVariant.sub.map(subV => {
                            if (subV.id === subId) {

                                return {
                                    ...subV,
                                    variantImage: e.target.files[0]
                                };
                            }
                            return subV;
                        });

                        // Return the updated eachVariant with the updated sub-variants
                        return {
                            ...eachVariant,
                            sub: updatedSubVariants
                        };
                    }
                } return eachVariant
            })
        )
    }

    const onChangeTitle = (e) => {
        if ((e.target.value).length === 0) {
            setError('Title can’t be blank')
        } else {
            setError('')
        }

        setTitle(e.target.value)
        setMetaDetails({ ...metaDetails, urlHandle: `${window.location.origin}/productItem/${(e.target.value).replace(/ /g, '-')}` })

    }


    const onchangeVariantGroupBy = (e) => {
        setVariantsGroup(e.target.value)
        setVariantsDetials(generateOptions())
    }


    const handleMetaDetails = (e) => {
        setMetaDetails({ ...metaDetails, [e.target.id]: e.target.value })
    }

    const handleVariantsOutput = (e, vid, type, subId) => {
        const { value, id } = e.target
        setVariantsDetials(
            variantsDetails.map(eachVariant => {
                if (eachVariant.id === vid) {
                    if (type === 'main') {
                        return {
                            ...eachVariant, main: { ...eachVariant.main, [id]: value }
                        }
                    } else {
                        // Use map to return the updated sub-variants
                        const updatedSubVariants = eachVariant.sub.map(subV => {
                            if (subV.id === subId) {

                                return {
                                    ...subV,
                                    [id]: value
                                };
                            }
                            return subV;
                        });

                        const variantAmounts = updatedSubVariants.map(vari => parseInt(vari.amount));
                        const mqinQuantity = updatedSubVariants.map(vari => parseInt(vari.quantity)).reduce((accumulator, currentValue) => accumulator + currentValue, 0)

                        let updatedMainAmount;
                        if (variantAmounts.length > 1) {
                            updatedMainAmount = `${Math.min(...variantAmounts)} - ${Math.max(...variantAmounts)}`;
                        } else {
                            updatedMainAmount = variantAmounts[0];
                        }

                        // Return the updated eachVariant with the updated sub-variants
                        return {
                            ...eachVariant,
                            main: { ...eachVariant.main, amount: updatedMainAmount, quantity: mqinQuantity },
                            sub: updatedSubVariants
                        };
                    }
                } return eachVariant
            })
        )
    }

    const toggleSubVariantsVisibility = (variantId) => {
        setSubVariantsVisibility(prevState => ({
            ...prevState,
            [variantId]: !prevState[variantId]
        }));
    };

    const goVariantsPage = (opt1, v) => {
        const options = v.split('-')
        const option2 = options[0]
        const option3 = options[1] || null
        // if (!availableVariants) return 0
        const id = variantDetails.find(variant => variant.option1 === opt1 && variant.option2 === option2 && variant.option3 === option3).id
        return id
        // console.log(id)
        // Navigate(`/variant-details/${id}`)
    }


    console.log('sdfsfs', variantsDetails)

    return (
        <div className='container'>
            <div className='row'>
                <div className='col-8'>
                    <div className='row'>
                        <div className='col-12'>
                            <div className='bgStyle'>
                                <form className='editorForm'>
                                    <div className="col-md-12">
                                        <label htmlFor="title" className="form-label">Title</label>
                                        <input type="text" className="form-control" value={title} onChange={onChangeTitle} id="title" />
                                        <span className='errorValue'>{error}</span>
                                    </div>
                                    <div className='mt-3'>
                                        <TextEditor content={content} setContent={setContent} />
                                    </div>
                                </form>
                            </div>
                            <div className='bgStyle'>
                                <form className='imagesForm'>
                                    <div className="col-md-12">
                                        <input type="file" multiple onChange={onChangeImages} />
                                        {Array.from(images).map(item => {
                                            return (
                                                <span>
                                                    {typeof item === 'string' ? <img src={item} width={150} height={150} alt="" />
                                                        : <img src={item ? URL.createObjectURL(item) : null} width={150} height={150} alt="" />}
                                                </span>
                                            )
                                        })}
                                    </div>
                                </form>
                            </div>
                            <div className='bgStyle'>
                                <form className='areVariantsForm'>
                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox" id="isVariants" checked={variantsThere} onChange={() => { setVariants(!variantsThere) }} />
                                        <label className="form-check-label" htmlFor="isVariants">Product has variants</label>
                                    </div>
                                </form>
                            </div>
                            {variantsThere ?
                                <div className='bgStyle'>
                                    <form className='variantsForm'>
                                        <p>Variants</p>
                                        {variants.map((varient, index) => (
                                            <div className='child-div' key={index}>
                                                <div className='d-flex justify-content-between'>
                                                    <div className='variantsDisplay'>
                                                        <div className='d-flex'>
                                                            {varient.isDone ? <strong>{varient.optionName}</strong> : <div className='d-flex flex-column'>
                                                                <label htmlFor='optionName'>Option Name</label>
                                                                <select id="optionName" className="your-select-className" aria-label="Default select example" value={varient.optionName} onChange={(e) => handleVariantChange(e, varient.id)}>
                                                                    <option value="size">Size</option>
                                                                    <option value="color">Color</option>
                                                                    <option value="material">Material</option>
                                                                    <option value="flavour">Flavour</option>
                                                                    <option value="quantity">Quantity</option>
                                                                </select></div>}
                                                        </div>
                                                        <div className='d-flex'>
                                                            {varient.isDone ?
                                                                varient.optionValue.map((value, i) => (
                                                                    value !== '' ? <span className='valueCont'>{value}</span> : null
                                                                ))
                                                                : <div className='d-flex flex-column'>
                                                                    <label htmlFor='optionValue'>Option Value</label>
                                                                    {varient.optionValue.map((value, i) => (
                                                                        <div key={i} className='d-flex'>
                                                                            <input id="optionValue" type="text" value={value} autoComplete='off' placeholder='Add Another Option' onChange={(e) => onChangeVariantValue(e, varient.id, i)} />
                                                                            {varient.optionValue.length - 1 !== i && <button className="variantDltBtn" onClick={(e) => deleteInput(e, varient.id, i)}><RiDeleteBin6Line /></button>}
                                                                        </div>))}
                                                                    {/* <button className="addBtn" onClick={(e) => addOptionValue(e, varient.id)}><FaPlus /></button> */}
                                                                </div>}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        {varient.isDone ? <button className="variantEditBtn" onClick={(e) => changeOptionMode(e, varient.id)}>Edit</button> : <button className="variantDltBtn" onClick={(e) => deleteVariant(e, varient.id)}><RiDeleteBin6Line /></button>}
                                                    </div>
                                                </div>
                                                {!varient.isDone && <button className="variantDoneBtn" onClick={(e) => changeOptionMode(e, varient.id)}>Done</button>}
                                            </div>
                                        ))}
                                        {variants.length < 3 && <button className="addVariant" onClick={addVarient}>+ Add Options like size or color...</button>}
                                    </form>
                                    {variantsDetails.length > 0 && <>
                                        <div className='variantsOutput'>
                                            {variants.length > 1 && <div className='d-flex align-items-center'>Group By
                                                <select value={variantGroup} onChange={onchangeVariantGroupBy}>
                                                    {variants.map(variant => (<option key={variant.id} value={variant.optionName}>{variant.optionName}</option>))}
                                                </select>
                                            </div>}
                                            <div>
                                                <Dropdown>
                                                    <Dropdown.Toggle variant="" id="dropdown-basic">
                                                        All Locations <IoMdArrowDropdown />
                                                    </Dropdown.Toggle>

                                                    <Dropdown.Menu>
                                                        <Dropdown.Item value='All Locations'>All Locations</Dropdown.Item>
                                                        <Dropdown.Item value='Chintal'>Chintal, Hyderabad Warehouse</Dropdown.Item>
                                                        <Dropdown.Item value='Corporate Office Hyderabad'>Corporate Office Hyderabad</Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            </div>
                                        </div>
                                        <div className='variantsOutputTopbar'>
                                            <span>Variant</span><span>Price</span><span>Available</span>
                                        </div>
                                        {variantsDetails.map((variant) => (
                                            <div key={variant.id}>
                                                <div className='variantsOutputValbar' >
                                                    <div className='variantImgCont'>
                                                        {variant.main.variantImage && variant.main.variantImage instanceof Blob ?
                                                            <img src={URL.createObjectURL(variant.main.variantImage)} alt="" className='vImg' /> :
                                                            <FaRegFileImage className='variantImgFile' />}
                                                        <input type='file' id="variantImage" className='variantImgInput' onChange={(e) => handleVariantsImage(e, variant.id, 'main', 0)} />
                                                        <div className='d-flex flex-column'>
                                                            <span>{variant.main.value}</span> {variant.sub.length > 0 && <div><span>{variant.sub.length} Variants</span>
                                                                <IoMdArrowDropup onClick={() => toggleSubVariantsVisibility(variant.id)} /></div>}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <input id='amount' onChange={(e) => handleVariantsOutput(e, variant.id, 'main', 0)} value={variant.main.amount} type="text" placeholder="₹ 0.0" />
                                                    </div>
                                                    <div>
                                                        <input id="quantity" onChange={(e) => handleVariantsOutput(e, variant.id, 'main', 0)} value={variant.main.quantity} type="number" disabled={variant.sub.length === 0 ? false : true} />
                                                    </div>
                                                </div>
                                                {subVariantsVisibility[variant.id] &&
                                                    variant.sub.map((va, subIndex) => (
                                                        <div className='subVariantsOutputValbar' key={va.id}>
                                                            <div className='variantImgCont'>
                                                                {(va.variantImage || variant.main.variantImage) ?
                                                                    ((va.variantImage ?
                                                                        (va.variantImage instanceof Blob ?
                                                                            <img src={URL.createObjectURL(va.variantImage)} className="vImg" alt="" />
                                                                            : null)
                                                                        : (variant.main.variantImage instanceof Blob ?
                                                                            <img src={URL.createObjectURL(variant.main.variantImage)} className="vImg" alt="" />
                                                                            : null)))
                                                                    : <FaRegFileImage className='variantImgFile' />
                                                                }

                                                                {location.pathname === "/addProduct" ? <Button variant="light" onClick={() => setVariantShow(true)}><span>{va.value}</span></Button> : <Link to={`/variant-details/${goVariantsPage(variant.main.value, va.value)}`}> <span>{va.value}</span></Link>}

                                                                <VariantEdit props={va.value} show={modal3Show}
                                                                    onHide={() => setVariantShow(false)}
                                                                />
                                                                <input type='file' id='variantImage' className='variantImgInput'
                                                                    onChange={(e) => handleVariantsImage(e, variant.id, '', va.id)} />
                                                            </div>

                                                            <div>
                                                                <input type="text" id='amount' placeholder="₹ 0.0" onChange={(e) => handleVariantsOutput(e, variant.id, '', va.id)} value={va.amount} />
                                                            </div>
                                                            <div>
                                                                <input type="text" id='quantity' onChange={(e) => handleVariantsOutput(e, variant.id, '', va.id)} value={va.quantity} />
                                                            </div>
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        ))}</>}
                                </div> :
                                <div className='bgStyle'>
                                    <div className='orderDetails'>
                                        <form className='priceForm'>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <label htmlFor="price">Price</label>
                                                    <input type="text" className="form-control" id="price" value={productPrices.price} onChange={handleProductPrices} placeholder="0.00" />
                                                </div>
                                                <div className="col-md-6">
                                                    <label htmlFor="comparePrice">Compare-at-price</label>
                                                    <input type="text" className="form-control" id="comparePrice" value={productPrices.comparePrice} onChange={handleProductPrices} placeholder="0.00" />
                                                </div>
                                                <div className="col-md-12">
                                                    <input className="form-check-input" type="checkbox" checked={productPrices.isTaxable} onChange={handleProductPrices} id="isTaxable" placeholder="0.00" />
                                                    <label className="form-check-label" htmlFor="isTaxable">
                                                        Charge tax on this product
                                                    </label>
                                                </div>
                                                <div className="col-md-6">
                                                    <label htmlFor="costPerItem">Cost per item</label>
                                                    <input type="text" className="form-control" value={productPrices.costPerItem} onChange={handleProductPrices} id="costPerItem" placeholder="0.00" />
                                                </div>
                                            </div>
                                        </form>
                                        <form className='inventoryForm'>
                                            <p>Inventory</p>
                                            <div className="form-check">
                                                <input className="form-check-input" type="checkbox" onClick={trackQty} value={tracker} id="trackQty" />
                                                <label className="form-check-label" htmlFor="trackQty">
                                                    Track quantity
                                                </label>
                                            </div>
                                            {tracker ?
                                                <div className=''>
                                                    <div className='d-flex justify-content-between align-items-center'>
                                                        <p>Quantity</p>
                                                        <button type="button" className="btn" data-bs-toggle="modal" data-bs-target="#editLoc">
                                                            Edit Location
                                                        </button>
                                                    </div>
                                                    {/* <div className='modal'> */}
                                                    <div className="modal fade" id="editLoc" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                                        <div className="modal-dialog">
                                                            <div className="modal-content">
                                                                <div className="modal-header">
                                                                    <h5 className="modal-title" id="exampleModalLabel">Edit locations</h5>
                                                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                                </div>
                                                                <div className="modal-body">
                                                                    <p>Select locations that stock the selected variants.</p>
                                                                    <button className="d-block" onClick={(e) => handleLocValues(e)}>{(locValues && (chintalLoc || corporateLoc)) ? 'Deselect All' : 'Select All'}</button>
                                                                    <label>
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={chintalLoc}
                                                                            onChange={handleChintalLoc} // Handle onChange to prevent warning
                                                                        />
                                                                        Chintal, Hyderabad Warehouse
                                                                    </label>
                                                                    <label>
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={corporateLoc}

                                                                            onChange={handleCorporateLoc} // Handle onChange to prevent warning
                                                                        />
                                                                        Corporate Office Hyderabad
                                                                    </label>
                                                                </div>
                                                                <div className="modal-footer">
                                                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Done</button>
                                                                    {/* <button type="button" className="btn btn-primary">Done</button> */}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {/* </div> */}

                                                    <div className="form-check">{chintalLoc && <div><span>Chintal, Hyderabad Warehouse</span><input type='number' id="coc" value={locInputs.coc} onChange={handleLocationInputs} /></div>}
                                                        {corporateLoc && <div><span>Corporate Office Hyderabad</span><input type='number' id="coh" value={locInputs.coh} onChange={handleLocationInputs} /></div>}
                                                        <input className="form-check-input" type="checkbox" checked={handleLoc.cwos} id="cwos" onChange={handleConditions} />
                                                        <label className="form-check-label" htmlFor="cwos">
                                                            Continue selling when out of stock
                                                        </label>
                                                    </div>

                                                </div> : ''
                                            }

                                            <div className="form-check">
                                                <input className="form-check-input" type="checkbox" checked={isSKU} id="hasSKU" onChange={handleSku} />
                                                <label className="form-check-label" htmlFor="hasSKU">
                                                    This product has a SKU or barcode
                                                </label>
                                            </div>
                                            {isSKU ? <div className='row'>
                                                <div className='col-md-6'>
                                                    <div className="mb-3">
                                                        <label htmlFor="SKU" className="form-label">SKU (Stock Keeping Unit)</label>
                                                        <input type="text" className="form-control" id="SKU" value={skuInput.SKU} onChange={handleSkuInput} placeholder="" />
                                                    </div>
                                                </div>
                                                <div className='col-md-6'>
                                                    <div className="mb-3">
                                                        <label htmlFor="barcode" className="form-label">Barcode (ISBN, UPC, GTIN, etc.)</label>
                                                        <input type="text" className="form-control" id="barcode" value={skuInput.barcode} onChange={handleSkuInput} placeholder="" />
                                                    </div>
                                                </div>
                                            </div> : ''}

                                        </form>
                                        <form className='shippingForm'>
                                            <p>Shipping</p>
                                            <label>
                                                <input
                                                    type="checkbox"
                                                    checked={isShipping}
                                                    value={isShipping}
                                                    onChange={handleShipping}
                                                />
                                                This is a physical product
                                            </label>
                                            {isShipping ? <div className='shippingCont'>
                                                <div className='d-flex'>
                                                    <input type='text' placeholder='0.0' value={weight} onChange={handleWeight} />
                                                    <select className="" aria-label="Default select example" value={weightUnit} onChange={(e) => setWeightUnit(e.target.value)}>
                                                        <option value='kg'>Kg</option>
                                                        <option value="lb">lb</option>
                                                        <option value="oz">oz</option>
                                                        <option value="g">g</option>
                                                    </select>
                                                </div>
                                                <label htmlFor='countrySelect'>Country/Region of origin</label>
                                                <select id="countrySelect" value={originCountry} onChange={(e) => setOriginCountry(e.target.value)} className="form-select" aria-label="Default select example">
                                                    <option value="">Select</option>
                                                    {countriesList.data.map(eachObj => (
                                                        <option value={eachObj.iso2} key={eachObj.iso3}>
                                                            {eachObj.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div> : ''}
                                        </form>
                                    </div>
                                </div>
                            }
                            <div className='bgStyle'>
                                <h6>Search engine listing</h6>
                                <p>Add a title and description to see how this product might appear in a search engine listing</p>
                                <div className="form-group">
                                    <label className="heading" htmlFor='metaTitle'>Page title</label>
                                    <input type="text" className="form-control" id="metaTitle" maxLength="100" value={metaDetails.metaTitle} onChange={handleMetaDetails} />
                                    <p className='infoTxt'>{metaDetails.metaTitle.length} of 100 characters used</p>
                                </div>
                                <div className="form-group">
                                    <label className="heading" htmlFor='metaDescription'>Meta description</label>
                                    <textarea id="metaDescription" className="form-control" maxLength="10000" onChange={handleMetaDetails} value={metaDetails.metaDescription}></textarea>
                                    <p className='infoTxt'>{metaDetails.metaDescription.length} of 10000 characters used</p>
                                </div>
                                <div className="form-group">
                                    <label className="heading" htmlFor='urlHandle'>URL handle</label>
                                    <input type="text" className="form-control" id="url" value={metaDetails.urlHandle} onChange={handleMetaDetails} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='col-4'>
                    <div className='row'>
                        <div className='col-12'>
                            <div className='bgStyle'>
                                <form className="statusForm">
                                    <label htmlFor="inputState" className="form-label">Status</label>
                                    <select onChange={(e) => setProductStatus(e.target.value)} value={productStatus} id="inputState" className="form-select">
                                        <option value='0'>InActive</option>
                                        <option value='1' >Active</option>
                                    </select>
                                </form>
                            </div>
                            <div className='bgStyle'>
                                <form className='publishingForm'>
                                    <div className='top_sec'>
                                        <h6>Publishing</h6>
                                        <Dropdown>
                                            <Dropdown.Toggle variant="light" id="dropdown-basic">
                                                <BsThreeDotsVertical />
                                            </Dropdown.Toggle>

                                            <Dropdown.Menu>
                                                <Dropdown.Item href="#/action-1">Manage sales channel</Dropdown.Item>
                                                <Dropdown.Item href="#/action-2">Manage markets</Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </div>
                                    <div className='bot_sec'>
                                        <p>Sales Channels</p>
                                        <ul>
                                            <li><span></span> Online Store  <Button variant="light" onClick={() => setStoreShow(true)}>
                                                <FaBusinessTime />
                                            </Button></li>
                                            <PopupModal show={modal1Show} value={'Schedule Online Store publishing'}
                                                onHide={() => setStoreShow(false)}
                                            />
                                            <li><span></span> Google & Youtube<Button variant="light" onClick={() => setSiteShow(true)}>
                                                <FaBusinessTime /></Button></li>
                                            <PopupModal show={modal2Show} value={'Schedule Google & YouTube publishing'}
                                                onHide={() => setSiteShow(false)}
                                            />
                                            <li><span></span> Facebook & Instagram & <br />Azistastore mobile app</li>
                                        </ul>
                                        <p>Markets</p>
                                        <ul>
                                            <li><span></span> India and International</li>
                                        </ul>
                                    </div>
                                </form>
                            </div>
                            <div className='bgStyle'>
                                <form className='productOrganization'>
                                    <h6>Product organization</h6>
                                    <div className="form-group">
                                        <label htmlFor="category">Product category</label>
                                        <select className="form-control" value={productCategory.category} onChange={handleProductCategorization} id="category">
                                            <option>Search</option>
                                            {categoryItems.map((item, i) => (
                                                <option key={i} value={item.id}>{item.azst_category_name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="productType">Product type</label>
                                        <select className="form-control" id="productType" value={productCategory.productType} onChange={handleProductCategorization}>
                                            <option value=''>Add custom category</option>
                                            <option value='beverages'>Beverages</option>
                                            <option value='cookies'>Cookies</option>
                                            <option value='cosmetics'>Cosmetics</option>
                                            <option value='mouthwash'>Mouthwash</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="vendor">Vendor</label>
                                        <select className="form-control" id="vendor" value={productCategory.vendor} onChange={handleProductCategorization}>
                                            <option>Search</option>
                                            {vendors && vendors.map((vendor) => (
                                                <option key={vendor.azst_vendor_id} value={vendor.azst_vendor_id}>{vendor.azst_vendor_name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="">Collections</label>
                                        <Multiselect
                                            displayValue='azst_collection_name'
                                            onRemove={(each) => { console.log(each) }}
                                            onSelect={onSelectCollection}
                                            selectedValues={collectionValue}
                                            options={collections}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="">Tags</label>
                                        <Multiselect
                                            displayValue='label'
                                            onRemove={(each) => { console.log(each) }}
                                            selectedValues={tagValue}
                                            onSelect={onSelectTag}
                                            options={tagsDisplayOptions}
                                        />
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default AddProductForm