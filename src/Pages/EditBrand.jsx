import React from 'react'
import axios from 'axios'
import AdminSideBar from './AdminSideBar'
import BrandForm from './BrandForm'
import Cookies from 'js-cookie'
import { useState, useEffect } from 'react'
import swalHandle from './ErrorHandler'
import Swal from 'sweetalert2'
import { useNavigate, useParams } from 'react-router-dom'

const EditBrand = () => {
    const [brandImg, setBrandImg] = useState()
    const [brandName, setBrandName] = useState('')

    const baseUrl = process.env.REACT_APP_API_URL
    const tokenKey = process.env.REACT_APP_ADMIN_JWT_TOKEN
    const token = Cookies.get(tokenKey)

    const { id } = useParams();
    const navigate = useNavigate()

    useEffect(() => {
        const apiCallback = async () => {
            try {
                const brandsUrl = `${baseUrl}/brands`
                const headers = {
                    Authorization: `Bearer ${token}`
                }

                swalHandle.onLoading()

                const brandsList = await axios.post(brandsUrl, { 'brandId': id }, { headers })
                if (brandsList.status === 200) {
                    Swal.close()
                    console.log(brandsList)
                    setBrandName(brandsList.data.azst_brand_name)
                    setBrandImg(brandsList.data.azst_brand_logo)
                }
            } catch (error) {
                Swal.close()
                swalHandle.onError()
                console.log(error)
            }
        }; apiCallback();
    }, [])

    const saveBrand = async () => {
        try {
            const url = `${baseUrl}/brands`
            const headers = {
                Authorization: `Bearer ${token}`
            }
            const formData = new FormData()
            formData.append('brandId', id)
            formData.append('brandName', brandName)
            formData.append('brandLogo', brandImg)
            swalHandle.onLoading()
            const response = await axios.put(url, formData, { headers })
            if (response.status === 200) {
                Swal.close()
                navigate('/brands')
            }
        } catch (error) {
            swalHandle.onError()
            Swal.close()
            console.log(error)
        }
    }

    return (
        <div className='adminSec'>
            <AdminSideBar />
            <div className='commonSec'>
                <div className='addProductSection'>
                    <div className='container'>
                        <div className='row'>
                            <BrandForm brandImg={brandImg} setBrandImg={setBrandImg} brandName={brandName} setBrandName={setBrandName} />
                            <div className="col-12">
                                <button className="saveBtn" onClick={saveBrand}>Save</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditBrand