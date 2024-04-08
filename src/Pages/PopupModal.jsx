import Modal from 'react-bootstrap/Modal';
import './Admin.css'

function popupModal(props) {
    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {props.value}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h6>Schedule product to be published on this date and time:</h6>
                <div className='modalCont'>
                    <input className="modalInputField" type="time" />
                    <input className="modalInputField" type="date" />
                </div>
            </Modal.Body>
            <Modal.Footer>
                <button className="cancelBtn" onClick={props.onHide}>Cancel</button>
                <button className="saveBtn" onClick={props.onHide}>Schedule publishing</button>
            </Modal.Footer>
        </Modal>
    );
}

export default popupModal