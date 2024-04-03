import React, { useContext, useEffect, useState } from 'react'
import AdminSideBar from './AdminSideBar'
import { TiArrowLeft } from "react-icons/ti";
import axios from 'axios';
import Cookies from 'js-cookie';
import { useParams, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { productContext } from '../Context/ProductContext'

const VariantDetails = () => {
    const [weight, setWeight] = useState('0')
    const [weightUnit, setWeightUnit] = useState('kg')
    const [isPhysical, setIsPhysical] = useState(false)
    const [variantImg, setVariantImg] = useState('')

    const [selectedVariantDetails, SetSelectedVariantDetails] = useState({})

    const baseUrl = process.env.REACT_APP_API_URL
    const jwtToken = process.env.REACT_APP_ADMIN_JWT_TOKEN
    const token = Cookies.get(jwtToken)
    const params = useParams()
    const { id } = params
    const navigate = useNavigate();


    const { productDetails, variantsData, variantDetails } = useContext(productContext)

    useEffect(() => {
        const apiCallback = async () => {
            const variantDetailsUrl = `${baseUrl}/product/variants/`
            const headers = {
                Authorization: `Bearer ${token}`
            }
            try {
                const response = await axios.post(variantDetailsUrl, { variantId: id }, { headers })

                if (response.status === 200) {
                    SetSelectedVariantDetails(response.data.variant)
                }
            } catch (error) {
                console.log(error)
            }
        };
        apiCallback();
    }, [id, baseUrl, token])

    const isPhysicalProduct = () => {
        setIsPhysical(!isPhysical)
    }

    const updateVariantImg = (e) => {
        setVariantImg(e.target.files[0])
    }

    console.log('jbj', variantImg)

    return (
        <div className='adminSec'>
            <AdminSideBar />
            <div className='commonSec'>
                <div className='container'>
                    <div className='row'>
                        <div className='col-sm-12'>
                            <h3 style={{ cursor: 'pointer' }}><TiArrowLeft onClick={() => navigate(-1)} />{selectedVariantDetails.option1 && <span>{selectedVariantDetails.option1}</span>} {selectedVariantDetails.option2 && <span>/ {selectedVariantDetails.option2}</span>} {selectedVariantDetails.option3 && <span>/ {selectedVariantDetails.option3}</span>}</h3>
                        </div>
                        <div className='col-sm-4'>
                            <div className='bgStyle'>
                                <div className='d-flex align-items-center'>
                                    <img className="vImg" src={productDetails.image_src} alt="" />
                                    <div className='' style={{ marginLeft: '6px' }}>
                                        <h5>{productDetails.product_title}</h5>
                                        <span className='d-block'>{productDetails.status === 1 ? 'Active' : 'Inactive'}</span>
                                        <span>{variantDetails.length} variants</span>
                                    </div>
                                </div>
                            </div>
                            <div className='bgStyle'>
                                <h6>Variants</h6>
                                <hr />
                                {variantDetails.map((variant) => (
                                    <Link to={`/variant-details/${variant.id}`}><div className='d-flex align-items-center'>
                                        <img className='vImg' src={variant.variant_image[0]} alt="ghg" />
                                        <p style={{ marginBottom: '0', marginLeft: '6px' }}>{variant.option1 && <span>{variant.option1}</span>} {variant.option2 && <span>/ {variant.option2}</span>} {variant.option3 && <span>/ {variant.option3}</span>}</p>
                                    </div></Link>
                                ))}
                            </div>
                        </div>
                        <div className='col-sm-8'>
                            <div className='bgStyle'>
                                <h6>Options</h6>
                                {variantsData.map((v, i) => (
                                    <div className="mb-3">
                                        <label htmlFor="optionName" className="col-form-label">{v.UOM}</label>
                                        <input type="text" className="form-control" id="optionValue" value={`${selectedVariantDetails['option' + (i + 1)]}`} />
                                    </div>
                                ))}
                                <div className='variantImgCont d-flex flex-column'>
                                    {typeof variantImg !== 'string' ?
                                        (variantImg instanceof Blob ?
                                            <img src={URL.createObjectURL(variantImg)} className="vImg" alt="" />
                                            : null) :
                                        <img className="vImg" src={productDetails.image_src} alt="yu" />
                                    }
                                    <div className=''>
                                        <label htmlFor="chooseImg">Change</label>
                                        <input type='file' id="chooseImg" onChange={updateVariantImg} className='variantImgInput2' />
                                    </div>
                                </div>
                            </div>
                            <div className='bgStyle'>
                                <h6>Pricing</h6>
                                <div className='row'>
                                    <div className="col">
                                        <label htmlFor="price" className="col-form-label">Price</label>
                                        <input type="text" className="form-control" id="price" value={selectedVariantDetails.offer_price || 0} />
                                    </div>
                                    <div className="col">
                                        <label htmlFor="costperitem" className="col-form-label">Compare-at-=price</label>
                                        <input type="text" className="form-control" id="costperitem" value={selectedVariantDetails.actual_price} />
                                    </div>
                                </div>
                                <div className="form-check">
                                    <input className="form-check-input" type="checkbox" checked={selectedVariantDetails.variant_taxable} id="isTaxable" />
                                    <label className="form-check-label" htmlFor="isTaxable">
                                        Charge tax on this variant
                                    </label>
                                </div>
                                <div className='row'>
                                    <div className="col">
                                        <label htmlFor="price" className="col-form-label">Cost per item</label>
                                        <input type="text" className="form-control" id="price" />
                                    </div>
                                </div>
                            </div>
                            <div className='bgStyle'>
                                <h6>Inventory</h6>
                                <div className="row">
                                    <div className="col-sm-6">
                                        <label htmlFor="sku" className="col-form-label">SKU (Stock Keeping Unit)</label>
                                        <input type="text" value={selectedVariantDetails.variant_sku} className="form-control" id="sku" placeholder="" />
                                    </div>
                                    <div className="col-sm-6">
                                        <label htmlFor="barcode" className="col-form-label">Barcode (ISBN, UPC, GTIN, etc.)</label>
                                        <input type="text" value={selectedVariantDetails.variant_barcode} className="form-control" id="barcode" placeholder="" />
                                    </div>
                                    <div className="col-sm-6">
                                        <label htmlFor="hsCode" className="col-form-label">Harmonized System (HS) code</label>
                                        <input type="text" value={selectedVariantDetails.variant_HS_code} className="form-control" id="hsCode" placeholder="" />
                                    </div>
                                </div>
                            </div>
                            <div className='bgStyle'>
                                <h6>Shipping</h6>
                                <div className="form-check">
                                    <input className="form-check-input" onClick={isPhysicalProduct} type="checkbox" id="physicalProduct" />
                                    <label className="form-check-label" htmlFor="physicalProduct">
                                        This is a physical product
                                    </label>
                                    <div className='shippingCont'>
                                        {isPhysical && <div className='d-flex'>
                                            <input type='text' placeholder='0.0' value={selectedVariantDetails.variant_weight} onChange={(e) => setWeight(e.target.value)} />
                                            <select className="" aria-label="Default select example" value={selectedVariantDetails.variant_weight_unit} onChange={(e) => setWeightUnit(e.target.value)}>
                                                <option value='kg'>Kg</option>
                                                <option value="lb">lb</option>
                                                <option value="oz">oz</option>
                                                <option value="g">g</option>
                                            </select>
                                        </div>}
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
                            <div className='row'>
                                <div className='d-flex justify-content-end mt-4'>
                                    <button className='dltBtn' style={{ marginRight: '10px' }}>Delete variant</button>
                                    <button className='saveBtn'>Save</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default VariantDetails