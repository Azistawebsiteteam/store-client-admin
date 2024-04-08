import Modal from 'react-bootstrap/Modal';
import { TiArrowLeft } from "react-icons/ti";
import './Admin.css'

const VariantEdit = (props) => {

    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    <h4><TiArrowLeft onClick={props.onHide} />Edit {props.props}</h4>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className='variantEditCont'>
                    <div className='container'>
                        <div className='row'>
                            <div className="col">
                                <label htmlFor="price" className="col-form-label">Price</label>
                                <input type="text" className="form-control" id="price" />
                            </div>
                            <div className="col">
                                <label htmlFor="costperitem" className="col-form-label">Cost per item</label>
                                <input type="text" className="form-control" id="Costperitem" />
                            </div>
                        </div>
                        <hr />
                        <h6>Inventory</h6>
                        <div className="row">
                            <div className="col-sm-6">
                                <label htmlFor="sku" className="col-form-label">SKU (Stock Keeping Unit)</label>
                                <input type="text" className="form-control" id="sku" placeholder="" />
                            </div>
                            <div className="col-sm-6">
                                <label htmlFor="barcode" className="col-form-label">Barcode (ISBN, UPC, GTIN, etc.)</label>
                                <input type="text" className="form-control" id="barcode" placeholder="" />
                            </div>
                        </div>
                        <hr />
                        <h6>Customs information</h6>
                        <div className="row">
                            <div className="col">
                                <label htmlFor="hsCode" className="col-form-label">Harmonized System (HS) code</label>
                                <input type="text" className="form-control" id="hsCode" placeholder="" />
                            </div>
                            <span>Manually enter codes that are longer than 6 numbers.</span>
                        </div>
                        <p className='mt-4'>* Save the product to edit more variant details.</p>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <button className='cancelBtn' style={{ marginRight: '10px' }} onClick={props.onHide}>Cancel</button>
                <button className='saveBtn'>Done</button>
            </Modal.Footer>
        </Modal>
    )
}

export default VariantEdit

