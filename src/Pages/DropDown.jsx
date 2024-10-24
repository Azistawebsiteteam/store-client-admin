import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';
import './Admin.css';

function BasicButtonExample() {
  const [showDropdown, setShowDropdown] = useState(false);
  const adminToken = process.env.REACT_APP_ADMIN_JWT_TOKEN;

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleUserLogout = () => {
    window.location.replace('/adminLoginPage');
    Cookies.remove(adminToken);
  };
  return (
    <div className='dropdown-center'>
      <button
        className='btn btn-secondary dropdown-toggle'
        type='button'
        data-bs-toggle='dropdown'
        aria-expanded='false'>
        User
      </button>
      <ul className='dropdown-menu customDropDown'>
        <li>
          <Link className='dropdown-item' to='/manageAccount'>
            Manage Accounts
          </Link>
        </li>

        <li>
          <a
            className='dropdown-item'
            onClick={handleUserLogout}
            href='/adminLoginPage'>
            Logout
          </a>
        </li>
      </ul>
    </div>
  );
}

export default BasicButtonExample;
