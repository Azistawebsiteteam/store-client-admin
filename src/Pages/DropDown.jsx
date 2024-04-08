import Cookies from 'js-cookie';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';

// import { IoMdArrowDropdown } from "react-icons/io";

function BasicButtonExample() {

    const adminToken = process.env.REACT_APP_ADMIN_JWT_TOKEN

    const handleUserLogout = () => {
        window.location.replace('/addProduct')
        Cookies.remove(adminToken)
    }
    return (
        <DropdownButton id="dropdown-basic-button" variant="bg-light" className="adminDropdown" title="Admin">
            <Dropdown.Item href="ManageAccount">Manage Accounts</Dropdown.Item>
            <Dropdown.Item href="#/action-2">User Activities</Dropdown.Item>
            <Dropdown.Item href="#/action-3" onClick={handleUserLogout}>Logout</Dropdown.Item>
        </DropdownButton>
    );
}

export default BasicButtonExample;
