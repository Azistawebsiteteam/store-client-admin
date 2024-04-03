import React, { useState } from 'react'
import Cookies from 'js-cookie'
import axios from 'axios'
import Swal from 'sweetalert2'

import CollectionForm from './CollectionForm'

import '../Pages/Admin.css'

const CreateCollections = () => {
    const [collectionData, setCollectionData] = useState({
        'title': '',
        'content': '',
        'metaTitle': '',
        'metaDescription': '',
        'urlHandle': `${window.location.origin}/collections/`,
        'collectionImg': ''
    })


    const tokenKey = process.env.REACT_APP_ADMIN_JWT_TOKEN
    const token = Cookies.get(tokenKey)
    const baseUrl = process.env.REACT_APP_API_URL


    const onSubmitCollection = async () => {
        try {
            const url = `${baseUrl}/collections/add`
            const headers = {
                Authorization: `Bearer ${token}`,
                'Content-type': 'multipart/form-data'
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

            const {
                title,
                content,
                metaTitle,
                metaDescription,
                urlHandle,
                collectionImg
            } = collectionData
            const metaDetails = {
                metaTitle,
                metaDescription,
                urlHandle
            }

            formdata.append('title', title)
            formdata.append('content', content)
            formdata.append('metaDetails', JSON.stringify(metaDetails))
            formdata.append('collectionImg', collectionImg)

            const response = await axios.post(url, formdata, { headers })
            console.log(response);
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
        }
    }

    return (
        <div className=''>
            <CollectionForm collectionData={collectionData} setCollectionData={setCollectionData} />
            <div className='col-sm-12'>
                <div className='btnCont'>
                    <button className='adminBtn' onClick={onSubmitCollection}>Save</button>
                </div>
            </div>
        </div>

    )
}

export default CreateCollections