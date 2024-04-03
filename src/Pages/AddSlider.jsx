import axios from 'axios';
import Cookies from 'js-cookie';
import React, { useState } from 'react'
import { FaUpload } from "react-icons/fa";
import AdminSideBar from './AdminSideBar';
import Swal from 'sweetalert2';
import swalErr from './ErrorHandler'

const AddSlider = () => {
    const [imgDetails, setImgDetails] = useState({
        title: '',
        description: '',
        startTime: '',
        endTime: '',
        altText: '',
        backgroundUrl: '',
        isDefault: '1'
    })

    const [imgValue, setimgValue] = useState({
        webBanner: '',
        mobileBanner: ''
    })

    const handleImgDetails = (e) => {
        if (e.target.id === 'isDefault' && e.target.value === '1') {
            setImgDetails({
                ...imgDetails, startTime: '', endTime: '', [e.target.id]: e.target.value
            })
        } else {
            setImgDetails({ ...imgDetails, [e.target.id]: e.target.value })
        }
    }

    const handleBannerImg = (e) => {
        setimgValue({ ...imgValue, [e.target.id]: e.target.files[0] })
    }

    const tokenKey = process.env.REACT_APP_ADMIN_JWT_TOKEN
    const token = Cookies.get(tokenKey)
    const baseUrl = process.env.REACT_APP_API_URL

    const onSubmitSliderDetails = async () => {
        try {

            if (imgDetails.isDefault === '0' && (imgDetails.startTime === '' || imgDetails.endTime === '')) {
                return alert("please select date")
            }
            swalErr.onLoading()
            const url = `${baseUrl}/banners/add`
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

            formdata.append('title', imgDetails.title)
            formdata.append('description', imgDetails.description)
            formdata.append('altText', imgDetails.altText)
            formdata.append('backgroundUrl', imgDetails.backgroundUrl)
            formdata.append('startTime', imgDetails.startTime)
            formdata.append('endTime', imgDetails.endTime)
            formdata.append('isDefault', imgDetails.isDefault)
            formdata.append('webBanner', imgValue.webBanner)
            formdata.append('mobileBanner', imgValue.mobileBanner)

            const response = await axios.post(url, formdata, { headers })
            console.log(response)
            Swal.close();
            Swal.fire({
                position: "center",
                icon: "success",
                title: "Your work has been saved",
                showConfirmButton: false,
                timer: 2000
            });
        } catch (error) {
            console.log(error)
            Swal.close();
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: error.message,
            });
        }
    }

    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split('T')[0]; // Extract date part
    const formattedTime = currentDate.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }); // Format time
    const today = `${formattedDate}T${formattedTime}`;

    return (
        <div className='adminSec'>
            <AdminSideBar />
            <div className='commonSec'>
                <div className='container'>
                    <div className='row'>
                        <h3>Add Slider</h3>
                        <div className='col-sm-8'>
                            <div className="row">
                                <div className="col-sm-12">
                                    <div className='bgStyle'>
                                        <div className="form-group">
                                            <label className="heading" htmlFor='title'>Title</label>
                                            <input type="text" className="form-control" id="title" maxLength="70" value={imgDetails.title} onChange={handleImgDetails} />
                                            <p className='infoTxt'>{imgDetails.title.length} of 70 characters used</p>
                                        </div>
                                        <div className="form-group">
                                            <label className="heading" htmlFor='description'>Short write up</label>
                                            <textarea id="description" className="form-control" maxLength="100" onChange={handleImgDetails} value={imgDetails.writeup}></textarea>
                                            <p className='infoTxt'>{imgDetails.description.length} of 100 characters used</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='bgStyle'>
                                <h6>Featured Image</h6>
                                <div className="row">
                                    <div className="col-sm-8">
                                        <div className="form-group">
                                            <label className="heading">Image</label>
                                            <div className="drop-zone">
                                                {imgValue.webBanner ? <img src={URL.createObjectURL(imgValue.webBanner)} alt="" className='bImg' /> :
                                                    <span className="dropZoneOverlay"><FaUpload /> Drop file here or click to upload</span>}
                                                <input type="file" className="FileUpload" id="webBanner" onChange={handleBannerImg} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-sm-4">
                                        <div className="form-group">
                                            <div className="">
                                                <label className="heading">Mobile image</label>
                                            </div>
                                            <div className="drop-zone">
                                                {imgValue.mobileBanner ? <img src={URL.createObjectURL(imgValue.mobileBanner)} alt="" className='mbImg' /> :
                                                    <span className="dropZoneOverlay"><FaUpload /> Drop file here or click to upload</span>}
                                                <input type="file" className="FileUpload" id='mobileBanner' onChange={handleBannerImg} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-sm-12 mt-3 mb-3">
                                        <div className="image_size">
                                            <p className='infoTxt mb-0'><strong>Image:</strong> we recommend using an image size of 1800px x 1000px. This size is optimal htmlFor displaying the slideshow on larger screens and ensuring high-quality visuals</p>
                                            <p className='infoTxt'><strong>Mobile image:</strong> By default, the slideshow will utilize the main slide image on mobile devices. We recommend using an image size of 420px x 500px.</p>
                                        </div>
                                    </div>

                                    <div className="col-sm-12">
                                        <div className="form-group">
                                            <label className="heading" htmlFor='altText'>Alt text</label>
                                            <input type="text" className="form-control" onChange={handleImgDetails} id="altText" maxLength="70" />
                                            <p className='infoTxt'>of 70 characters used</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='col-sm-4'>
                            <div className='bgStyle'>
                                <h6>Visibility</h6>
                                <div className="">
                                    <input type="radio" id="isDefault" name="publish" value='1' checked={imgDetails.isDefault === "1"} onChange={handleImgDetails} />
                                    <label className='radioBtnStylings' htmlFor="publishNow">Publish Now</label>
                                </div>
                                <div className="">
                                    <input type="radio" id="isDefault" name="publish" value='0' checked={imgDetails.isDefault === "0"} onChange={handleImgDetails} />
                                    <label className='radioBtnStylings' htmlFor="schedulePublish">Schedule Publish</label>
                                </div>
                                <p className='infoTxt mb-3 mt-3'>In summary, "Publish Now" ensures immediate availability, while "Schedule Publish" allows you to plan and release your content at a later, predetermined time.</p>
                                {imgDetails.isDefault === "0" && <div className="schedulevisbilty">
                                    <div className="form-group">
                                        <label className="heading" htmlFor='startTime'>Start Time</label>
                                        <input id="startTime" type="datetime-local" className="form-control" min={today} max={imgDetails.endTime} value={imgDetails.startTime} onChange={handleImgDetails} />
                                    </div>
                                    <div className="form-group mt-3">
                                        <label className="heading" htmlFor='endTime'>End Time</label>
                                        <input id="endTime" type="datetime-local" className="form-control" min={imgDetails.startTime} value={imgDetails.endTime} onChange={handleImgDetails} />
                                    </div>
                                </div>}
                            </div>
                            <div className='bgStyle'>
                                <h6>Call to action</h6>
                                <div className="">
                                    <label className="heading" htmlFor="backgroundUrl">Link</label>
                                    <input className="d-block form-control" type="text" value={imgDetails.backgroundUrl} onChange={handleImgDetails} id="backgroundUrl" />
                                </div>
                                <p className='infoTxt mt-3'>In summary "Background Link" refers to url of background images in slider section, while "Buttons" refers to buttons which appear on slider.</p>
                            </div>
                        </div>
                        <hr style={{ color: "grey" }} />
                        <div className='col-sm-12'>
                            <div className='btnCont'>
                                <button className='adminBtn' onClick={onSubmitSliderDetails}>Save</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddSlider