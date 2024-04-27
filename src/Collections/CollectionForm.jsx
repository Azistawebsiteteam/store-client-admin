import React, { useState } from 'react'
import { FaUpload } from 'react-icons/fa6'
import AdminSideBar from '../Pages/AdminSideBar'
import TextEditor from '../Pages/TextEditor'

import '../Pages/Admin.css'

const CollectionForm = (props) => {
    const { collectionData, setCollectionData } = props
    const {
        title,
        content,
        metaTitle,
        metaDescription,
        urlHandle,
        collectionImg
    } = collectionData

    const [error, setError] = useState('')



    const handleCollectionsTitle = (e) => {
        if ((e.target.value).length === 0) {
            setError('Title can’t be blank')
        } else {
            setError('')
        }
        setCollectionData({ ...collectionData, title: e.target.value, urlHandle: `${window.location.origin}/collections/${(e.target.value).replace(/ /g, '-')}` })
    }

    const handleMetaDetails = (e) => {
        setCollectionData({ ...collectionData, [e.target.id]: e.target.value });
    }
    const setContent = (content) => {
        setCollectionData({ ...collectionData, content });
    }


    const onChangeCollectionImage = (e) => {
        const collectionImg = e.target.files[0];
        setCollectionData({ ...collectionData, collectionImg: collectionImg });
    }


    return (
        <div className='adminSec'>
            <AdminSideBar />
            <div className='commonSec'>
                <div className='container'>
                    <div className='row'>
                        <h3>Create Collections</h3>
                        <div className='col-sm-8'>
                            <div className="row">
                                <div className="col-sm-12">
                                    <div className='bgStyle'>
                                        <div className="form-group">
                                            <label className="heading" htmlFor='title'>Title</label>
                                            <input type="text" className="form-control" id="title" value={title} onChange={handleCollectionsTitle} placeholder='e.g. Summer collections, under $100, Staff Picks' />
                                            <span className='errorValue'>{error}</span>
                                        </div>
                                        <div className="form-group mt-2">
                                            <label className="heading" htmlFor='content'>Description</label>
                                            <TextEditor id="content" content={content} setContent={setContent} />
                                        </div>
                                    </div>
                                    <div className='bgStyle'>
                                        <h6>Search engine listing</h6>
                                        <p>Add a title and description to see how this product might appear in a search engine listing</p>
                                        <div className="form-group">
                                            <label className="heading" htmlFor='metaTitle'>Seo title</label>
                                            <input type="text" className="form-control" id="metaTitle" maxLength="200" value={metaTitle} onChange={handleMetaDetails} />
                                            <p className='infoTxt'>{metaTitle.length} of 200 characters used</p>
                                        </div>
                                        <div className="form-group">
                                            <label className="heading" htmlFor='metaDescription'>Meta description</label>
                                            <textarea id="metaDescription" className="form-control" maxLength="320" onChange={handleMetaDetails} value={metaDescription}></textarea>
                                            <p className='infoTxt'>{metaDescription.length} of 320 characters used</p>
                                        </div>
                                        <div className="form-group">
                                            <label className="heading" htmlFor='urlHandle'>URL handle</label>
                                            <input type="text" className="form-control" id="urlHandle" value={urlHandle} onChange={handleMetaDetails} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='col-sm-4'>
                            {/* <div className='bgStyle'>
                            <div className='d-flex justify-content-between align-items-center'>
                                <h6>Publishing</h6>
                                <button type="button" className="btn" data-bs-toggle="modal" data-bs-target="#editLoc">
                                    Manage
                                </button>
                                <div className="modal fade" id="editLoc" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                    <div className="modal-dialog">
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <h5 className="modal-title" id="exampleModalLabel">Manage sales Channels</h5>
                                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                            </div>
                                            <div className="modal-body">
                                                <button className="d-block" onClick={handleStores}>{(channelValues) ? 'Deselect All' : 'Select All'}</button>
                                                <div className="form-check">
                                                    <input className="form-check-input" type="checkbox" value={channel.onlineStore} onClick={handleChannels} id="onlinestore" />
                                                    <label className="form-check-label" htmlFor="onlinestore">
                                                        Online store
                                                    </label>
                                                </div>
                                                <div className="form-check">
                                                    <input className="form-check-input" type="checkbox" value={channel['Facebook & Instagram']} onClick={handleChannels} id="facebook_instagram" />
                                                    <label className="form-check-label" htmlFor="facebook_instagram">
                                                        Facebook & Instagram
                                                    </label>
                                                </div>
                                                <div className="form-check">
                                                    <input className="form-check-input" type="checkbox" value={channel['Google & YouTube']} onClick={handleChannels} id="google_youTube" />
                                                    <label className="form-check-label" htmlFor="google_youTube">
                                                        Google & YouTube
                                                    </label>
                                                </div>
                                                <div className="form-check">
                                                    <input className="form-check-input" type="checkbox" value={channel.azistastore_mobile_app} onClick={handleChannels} id="azistastore_mobile_app" />
                                                    <label className="form-check-label" htmlFor="azistastore_mobile_app">
                                                        azistastore_mobile_app
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="modal-footer">
                                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Done</button>
                                                 <button type="button" className="btn btn-primary">Done</button> 
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <p>Sales channels</p>
                        </div> */}
                            <div className='bgStyle'>
                                <div className="form-group">
                                    <h6>Image</h6>
                                    <div className="drop-zone">
                                        {collectionImg ? (
                                            typeof collectionImg === 'string' ? (
                                                <img className='CollectionsThumbnail' src={collectionImg} width={200} height={180} alt="" />
                                            ) : (
                                                <img className='CollectionsThumbnail' src={URL.createObjectURL(collectionImg)} width={200} height={180} alt="" />
                                            )
                                        ) : (
                                            <span className="dropZoneOverlay"><FaUpload /> Drop file here or click to upload</span>
                                        )}
                                        <input type="file" className="FileUpload" id="collectionImage" onChange={onChangeCollectionImage} />
                                    </div>

                                </div>
                            </div>
                        </div>
                        <hr style={{ color: "grey" }} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CollectionForm