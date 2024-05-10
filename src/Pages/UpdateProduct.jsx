/* eslint-disable no-unused-vars */

import React, { useCallback, useContext, useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import axios from 'axios'
import Swal from "sweetalert2"
import { v4 } from 'uuid'
import AddProductForm from './AddProductForm'
import AdminSideBar from './AdminSideBar'
import { useParams } from 'react-router-dom'
import swalErr from './ErrorHandler'
import { productContext } from '../Context/ProductContext'


const UpdateProduct = () => {
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [locInputs, setLocInputs] = useState({
        inventoryIds: ['1', '2'],
        coc: 0,
        coh: 0
    })
    const [modal1Show, setStoreShow] = useState(false);
    const [modal2Show, setSiteShow] = useState(false);
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

    const [images, setImages] = useState([])

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
    const localUrl = process.env.REACT_APP_LOCAL_URL
    const jwtToken = process.env.REACT_APP_ADMIN_JWT_TOKEN
    const token = Cookies.get(jwtToken)
    const params = useParams()
    const { id } = params

    const setProductUpdateDetails = (productDetails) => {

        const {
            chintal_quantity,
            collections,
            compare_at_price,
            corporate_office_quantity,
            cost_per_item,
            inventroy_id,
            origin_country,
            is_taxable,
            out_of_stock_sale,
            price,
            product_category,
            product_images,
            product_info,
            product_title,
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
            brand_id
        } = productDetails

        setOriginCountry(origin_country)
        setTitle(product_title)
        setContent(product_info)
        setLocInputs({
            inventoryIds: [inventroy_id],
            coc: chintal_quantity,
            coh: corporate_office_quantity
        })
        setProductCategory({
            category: product_category,
            productType: type,
            vendor: vendor_id,
            brand: brand_id

        })
        setProductPrices({
            price: price,
            comparePrice: compare_at_price,
            isTaxable: is_taxable,
            costPerItem: cost_per_item
        })
        setMetaDetails({
            metaTitle: seo_title,
            metaDescription: seo_description,
            urlHandle: url_handle,
        })
        setTagValue(
            JSON.parse(tags)
        )
        setCollectionValue(JSON.parse(collections))
        setProductStatus(status)
        setWeight(product_weight.split('-')[0])
        setWeightUnit(product_weight.split('-')[1])
        setIsShipping(product_weight.split('-').length > 0)
        setSkuInput({
            SKU: sku_code,
            barcode: sku_bar_code
        })
        setHandleLoc({ cwos: out_of_stock_sale })
        if (JSON.parse(variant_store_order).length > 0) {
            setVariants(true)
            setTracker(false)
        } else {
            setVariants(false)
            setTracker(true)
        }
        setImages(product_images)
    }

    const setVariantsUpdateDetails = (v) => {
        setVariantsGroup(v[0].UOM)
        v.forEach((each) => {
            setVariant(prevVariants => [...prevVariants, {
                id: v4(), optionName: each.UOM,
                optionValue: [...each.values, ''],
                isDone: true
            }])
        })
    }

    const { setProductDetails, setVariantsData, setVariantDetails } = useContext(productContext)

    useEffect(() => {
        const getDetails = async () => {
            try {
                const url = `${baseUrl}/product/get/details`
                const headers = {
                    Authorization: `Bearer ${token}`
                }
                swalErr.onLoading()

                const response = await axios.post(url, { productId: id }, { headers })
                console.log(response)
                const { productDetails, variants, avalaibleVariants } = response.data
                Swal.close()
                setProductUpdateDetails(productDetails)
                setVariantsUpdateDetails(variants)
                setProductDetails(productDetails)
                setVariantsData(variants)
                setVariantDetails(avalaibleVariants)
            } catch (error) {
                Swal.close()
            }
        };
        getDetails();
    }, [id, baseUrl, token, setProductDetails, setVariantsData, setVariantDetails])


    const onSubmitProductDetails = async () => {
        try {
            const url = `${localUrl}/product/update-store`
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


            formdata.append('productId', id)
            formdata.append('productTitle', title)
            formdata.append('productInfo', content)
            formdata.append('variantsThere', variantsThere)
            formdata.append('metaTitle', metaDetails.metaTitle)
            formdata.append('metaDescription', metaDetails.metaDescription)
            formdata.append('urlHandle', metaDetails.urlHandle)
            formdata.append('productActiveStatus', productStatus)
            formdata.append('category', productCategory.category)
            formdata.append('productType', productCategory.productType)
            formdata.append('vendor', productCategory.vendor)
            formdata.append('brand', productCategory.brand)
            formdata.append('collections', JSON.stringify(collectionValue))
            formdata.append('tags', JSON.stringify(tagValue))

            if (variantsThere) {
                variantsDetails.forEach(variant => {
                    formdata.append('variantImage', variant.main.variantImage);
                    variant.sub.forEach(subVariant => {
                        formdata.append('variantImage', subVariant.variantImage);
                    })
                })
                formdata.append('variantsOrder', JSON.stringify(proVariants))
                formdata.append('variants', JSON.stringify(variantsDetails))
            } else {
                formdata.append('productPrice', productPrices.price)
                formdata.append('productComparePrice', productPrices.comparePrice)
                formdata.append('productIsTaxable', productPrices.isTaxable)
                formdata.append('productCostPerItem', productPrices.costPerItem)
                // formdata.append('quantityTracker', tracker)
                formdata.append('inventoryInfo', JSON.stringify(locInputs))
                formdata.append('cwos', handleLoc.cwos)
                formdata.append('skuCode', skuInput.SKU)
                formdata.append('skuBarcode', skuInput.barcode)
                formdata.append('productWeight', weight !== '' ? (weight + "-" + weightUnit) : "")
                formdata.append('originCountry', originCountry)
            }

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
                text: error.message,
            });
            console.log(error)
        }
    }

    const deleteImg = async (imgFile, setFun) => {
        try {
            const url = `${baseUrl}/product/delete/images`
            const headers = {
                Authorization: `Bearer ${token}`
            }
            const body = {
                productId: id, deleteImgs: imgFile
            }
            const response = await axios.patch(url, body, { headers })
            setImages(response.data.updatedImgs)
            setFun([])
        } catch (error) {
            console.log(error)
        }
    }

    const productProps = {
        proid: id,
        title, error, setError, setTitle, setMetaDetails,
        metaDetails, setVariantsGroup, setVariantsDetials, variantsDetails, variants, setSubVariantsVisibility, subVariantsVisibility,
        content, setContent, images, setVariants, variantsThere, tracker, setTracker, setCollectionValue, collectionValue, setHandleLoc, handleLoc,
        setChintalLoc, setLocValues, locValues, setLocInputs, locInputs, setCorporateLoc, setIsShipping, isShipping, setVariant,
        setProductPrices, productPrices, setSkuInput, skuInput, setWeight, setProductCategory, productCategory, setTagValue, tagValue, setImages,
        variantGroup, setSiteShow, modal2Show, modal1Show, setStoreShow, productStatus, setProductStatus, originCountry, setOriginCountry,
        weight, weightUnit, setWeightUnit, setIsSKU, isSKU, chintalLoc, corporateLoc, deleteImg
    }

    return (
        <div className='adminSec'>
            <AdminSideBar />
            <div className='commonSec'>
                <div className='addProductSection'>
                    <div className='container'>
                        <div className='row'>
                            <div className='col-12'>
                                <h3>{title}</h3>
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

export default UpdateProduct