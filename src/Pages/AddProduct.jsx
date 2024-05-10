/* eslint-disable no-unused-vars */

import React, { useState } from 'react'
import Cookies from 'js-cookie'
import axios from 'axios'
import Swal from "sweetalert2"
import { v4 } from 'uuid'
import AddProductForm from './AddProductForm'
import AdminSideBar from './AdminSideBar'


const AddProduct = () => {
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [locInputs, setLocInputs] = useState({
        inventoryIds: ['1', '2'],
        coc: 0,
        coh: 0
    })
    const [modal1Show, setStoreShow] = useState(false);
    const [modal2Show, setSiteShow] = useState(false);
    const [modal3Show, setVariantShow] = useState(false);
    const [tracker, setTracker] = useState(false)
    const [chintalLoc, setChintalLoc] = useState(true)
    const [corporateLoc, setCorporateLoc] = useState(true)
    const [locValues, setLocValues] = useState(false)
    const [isShipping, setIsShipping] = useState(false)
    const [variantsThere, setVariants] = useState(false)
    const [isSKU, setIsSKU] = useState(false)
    const [error, setError] = useState(false)
    const [handleLoc, setHandleLoc] = useState({
        cwos: false
    })
    const [productPrices, setProductPrices] = useState({
        price: 0,
        comparePrice: 0,
        isTaxable: false,
        costPerItem: 0
    })
    const [countriesList, setCountries] = useState()
    const [categoryItems, setCategoryItems] = useState([])
    const [tags, setTags] = useState([])
    const [images, setImages] = useState([])
    const [vendors, setVendors] = useState()
    const [collections, setCollections] = useState([])
    const [variants, setVariant] = useState([])
    // const [isArrowDown, setIsArrowDown] = useState(false);


    const [variantsDetails, setVariantsDetials] = useState([])
    const [variantGroup, setVariantsGroup] = useState("")
    const [subVariantsVisibility, setSubVariantsVisibility] = useState({});
    const [skuInput, setSkuInput] = useState(
        {
            SKU: '',
            barcode: ''
        })
    const [weight, setWeight] = useState('0')
    const [weightUnit, setWeightUnit] = useState('kg')
    const [originCountry, setOriginCountry] = useState('')
    const [productStatus, setProductStatus] = useState('0')
    const [productCategory, setProductCategory] = useState({
        category: '',
        productType: '',
        vendor: '',
        brand: ''
    })
    const [tagValue, setTagValue] = useState([])
    const [collectionValue, setCollectionValue] = useState([])
    const [metaDetails, setMetaDetails] = useState({
        metaTitle: '',
        metaDescription: '',
        urlHandle: `${window.location.origin}/productItem`
    })

    const baseUrl = process.env.REACT_APP_API_URL
    const jwtToken = process.env.REACT_APP_ADMIN_JWT_TOKEN
    const token = Cookies.get(jwtToken)
    const localUrl = process.env.REACT_APP_LOCAL_URL

    const onSubmitProductDetails = async () => {
        try {
            const url = `${localUrl}/product/add-store`
            const headers = {
                Authorization: `Bearer ${token}`,
                'Content-type': 'multipart/form-data'
            }
            if (title === '') {
                setError('Title can’t be blank');
                return;
            } else {
                setError('')
            }
            Swal.fire({
                title: 'Loading',
                allowOutsideClick: false,
                allowEscapeKey: false,
                didOpen: () => {
                    Swal.showLoading();
                },
            });
            const formdata = new FormData()
            const proVariants = []
            variants.forEach(varaint => {
                if (!proVariants.includes(varaint.optionName)) {
                    proVariants.push(varaint.optionName)
                }
            });

            images.forEach((file, i) => {
                formdata.append(`productImages`, file)
            })

            variantsDetails.forEach(variant => {
                formdata.append('variantImage', variant.main.variantImage);
                variant.sub.forEach(subVariant => {
                    formdata.append('variantImage', subVariant.variantImage);
                })
            })
            formdata.append('variants', JSON.stringify(variantsDetails))
            formdata.append('productTitle', title)
            formdata.append('productInfo', content)
            formdata.append('variantsOrder', JSON.stringify(proVariants))
            formdata.append('productPrice', productPrices.price)
            formdata.append('productComparePrice', productPrices.comparePrice)
            formdata.append('productIsTaxable', productPrices.isTaxable)
            formdata.append('productCostPerItem', productPrices.costPerItem)
            // formdata.append('quantityTracker', tracker)
            formdata.append('inventoryInfo', JSON.stringify(locInputs))
            formdata.append('cwos', handleLoc.cwos)
            formdata.append('skuCode', skuInput.SKU)
            formdata.append('skuBarcode', skuInput.barcode)
            formdata.append('productWeight', weight + " " + weightUnit)
            formdata.append('originCountry', originCountry)
            formdata.append('productActiveStatus', productStatus)
            formdata.append('category', productCategory.category)
            formdata.append('productType', productCategory.productType)
            formdata.append('vendor', productCategory.vendor)
            formdata.append('brand', productCategory.brand)
            formdata.append('collections', JSON.stringify(collectionValue))
            formdata.append('tags', JSON.stringify(tagValue))
            formdata.append('metaTitle', metaDetails.metaTitle)
            formdata.append('metaDescription', metaDetails.metaDescription)
            formdata.append('urlHandle', metaDetails.urlHandle)
            formdata.append('variantsThere', variantsThere)

            const response = await axios.post(url, formdata, { headers })

            Swal.close();
            Swal.fire({
                position: "center",
                icon: "success",
                title: "Your work has been saved",
                showConfirmButton: false,
                timer: 2000
            });
        } catch (error) {
            Swal.close();
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: error.response.data.message,
            });

        }
    }

    const deleteImg = async (imgFile, setFun) => {
        console.log(imgFile)
        console.log(images)
        const filteredImgs = images.filter((img, i) => !imgFile.includes(i))
        setImages(filteredImgs)
        setFun([])
        console.log('file', filteredImgs)
    }

    const productProps = {
        title, error, setError, setTitle, setMetaDetails,
        metaDetails, setVariantsGroup, setVariantsDetials, variantsDetails, variants, setSubVariantsVisibility, subVariantsVisibility,
        content, setContent, images, setVariants, variantsThere, tracker, setTracker, setCollectionValue, setHandleLoc, handleLoc,
        setChintalLoc, setLocValues, locValues, setLocInputs, locInputs, setCorporateLoc, setIsShipping, isShipping, setVariant,
        setProductPrices, productPrices, setSkuInput, skuInput, setWeight, setProductCategory, productCategory, setTagValue, setImages,
        variantGroup, setSiteShow, modal2Show, modal1Show, setStoreShow, setVariantShow, modal3Show, productStatus, setProductStatus, originCountry, setOriginCountry,
        weight, weightUnit, setWeightUnit, setIsSKU, isSKU, chintalLoc, corporateLoc, collectionValue, tagValue, deleteImg

    }

    return (
        <div className='adminSec'>
            <AdminSideBar />
            <div className='commonSec'>
                <div className='addProductSection'>
                    <div className='container'>
                        <div className='row'>
                            <div className='col-12'>
                                <h3>Add Product</h3>
                            </div>
                            <AddProductForm productProps={productProps} />
                            <div className='col-12'>
                                <div className='btnCont'>
                                    <button onClick={onSubmitProductDetails} className='adminBtn'>Save</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddProduct