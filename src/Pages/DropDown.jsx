import Cookies from 'js-cookie';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { RiArrowDropDownFill, RiArrowDropUpFill } from 'react-icons/ri';
import { RiAccountPinCircleLine } from 'react-icons/ri';
import { CiLogout } from 'react-icons/ci';
import { MdLockReset } from 'react-icons/md';
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
    <div className='dropdown'>
      {showDropdown ? (
        <RiArrowDropUpFill
          size={26}
          style={{ color: '#fff' }}
          onClick={toggleDropdown}
        />
      ) : (
        <RiArrowDropDownFill
          size={26}
          style={{ color: '#fff' }}
          onClick={toggleDropdown}
        />
      )}
      {showDropdown && (
        <ul className='dropdownMenu'>
          <li>
            <Link
              className='dropdown-item dropdownItems mb-1'
              to='/manageAccount'
              style={{ fontSize: '14px', fontWeight: '500' }}
              onClick={() => setShowDropdown(false)}>
              <RiAccountPinCircleLine
                size={20}
                className='me-1'
                style={{ fontSize: '14px', fontWeight: '500' }}
              />
              Manage Accounts
            </Link>
          </li>
          <li>
            <Link
              className='dropdown-item dropdownItems mb-1'
              to='/reset-password'
              style={{ fontSize: '14px', fontWeight: '500' }}
              onClick={() => setShowDropdown(false)}>
              <MdLockReset
                size={20}
                className='me-1'
                style={{ fontSize: '14px', fontWeight: '500' }}
              />
              Reset Password
            </Link>
          </li>
          <li>
            <a
              className='dropdown-item dropdownItems'
              href='/adminLoginPage'
              onClick={handleUserLogout}
              style={{ fontSize: '14px', fontWeight: '500' }}>
              <CiLogout className='me-1' size={20} />
              Log out
            </a>
          </li>
        </ul>
      )}
    </div>
  );
}

export default BasicButtonExample;
