import React from 'react'
import { FaUpload } from "react-icons/fa";

const BrandForm = (props) => {

    const { brandImg, setBrandImg, brandName, setBrandName } = props

    const handleBrandImage = (e) => {
        const image = e.target.files[0];
        setBrandImg(image);
    }

    const handleBrandInput = (e) => {
        setBrandName(e.target.value)
    }

    console.log('dfdfd', brandImg)


    return (
        <div className='col-12'>
            <h4>Create Brand</h4>
            <div className='bgStyle'>
                <form className="row g-3">
                    <div className="col-md-6">
                        <label htmlFor="name" className="form-label">Brand Name</label>
                        <input type="text" value={brandName} onChange={handleBrandInput} className="form-control" id="name" />
                    </div>
                    <div className="col-12">
                        <div className="form-group">
                            <h6>Image</h6>
                            <div className="drop-zone">
                                {brandImg ? (
                                    typeof brandImg === 'string' ? (
                                        <img className='CollectionsThumbnail' src={brandImg} width={200} height={180} alt="" />
                                    ) : (
                                        <img className='CollectionsThumbnail' src={URL.createObjectURL(brandImg)} width={200} height={180} alt="" />
                                    )
                                ) : (
                                    <span className="dropZoneOverlay"><FaUpload /> Drop file here or click to upload</span>
                                )}
                                <input type="file" className="FileUpload" id="collectionImage" onChange={handleBrandImage} />
                            </div>

                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default BrandForm