import React, { useEffect, useState } from 'react'
import AdminSideBar from '../Pages/AdminSideBar';
import { Link } from 'react-router-dom';
import { FaRegFileImage } from "react-icons/fa";
import Cookies from 'js-cookie';
import axios from 'axios';
import swalErr from '../Pages/ErrorHandler'
import Swal from 'sweetalert2';
import '../Pages/Admin.css'

const Collections = () => {
    const [collectionData, setCollectionData] = useState([])
    const baseUrl = process.env.REACT_APP_API_URL
    const tokenKey = process.env.admin_jwt_token
    const token = Cookies.get(tokenKey)

    useEffect(() => {
        const collections = async () => {
            try {
                const url = `${baseUrl}/collections/data`
                const headers = {
                    Authorization: `Bearer ${token}`
                }
                swalErr.onLoading()
                const response = await axios.get(url, { headers })
                Swal.close();
                setCollectionData(response.data)
            } catch (error) {
                console.log(error)
            }
        }; collections()
    }, [baseUrl, token])

    console.log('sasda', collectionData)

    return (
        <div className='adminSec'>
            <div><AdminSideBar /></div>
            <div className='commonSec'>
                <div className='collectionTopbar'>
                    <h3>Collections</h3>
                    <Link to="/createCollections">Create collection</Link>
                </div>
                <div className='collectionsDisplay'>
                    <div className='row'>
                        <div className="col-sm-3">

                        </div>
                        <div className="col-sm-3">
                            <h6>Title</h6>
                        </div>
                        <div className="col-sm-3">
                            <h6>Products</h6>
                        </div>
                        <div className="col-sm-3">
                            <h6>Products condition</h6>
                        </div>
                    </div>
                    {collectionData.map((eachCollection, id) => (
                        <div className='collectionsCont'>
                            <Link className='link' key={eachCollection.azst_collection_id} to={`/UpdateCollection/${eachCollection.azst_collection_id}`}>
                                <div className='row'>
                                    <div className='d-flex align-items-center'>
                                        <div className="col-sm-3">
                                            <div className='collectionsImgCont'>
                                                {eachCollection.azst_collection_img ?

                                                    <img className='CollectionsThumbnail' src={eachCollection.azst_collection_img} width={40} height={40} alt="" />
                                                    : <div className='imgThumbnail'>
                                                        <FaRegFileImage />
                                                    </div>}
                                            </div>
                                        </div>
                                        <div className="col-sm-3">
                                            <h6 className='collectionTitle'>{eachCollection.azst_collection_name}</h6>
                                        </div>
                                        <div className="col-sm-3">
                                            <span className='collectionCount'>9</span>
                                        </div>
                                        <div className="col-sm-3">
                                            <p className='productCondition'>Testing</p>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Collections