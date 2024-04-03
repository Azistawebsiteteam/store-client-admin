// import axios from 'axios'
import Cookies from 'js-cookie'
import React from 'react'
import { HiMiniUserCircle } from "react-icons/hi2";
import { IoMdSearch } from "react-icons/io";
import { IoMdArrowDropdown } from "react-icons/io";
import { Link } from 'react-router-dom'

import './Admin.css'

const AdminNavbar = () => {
    const adminData = JSON.parse(localStorage.getItem('adminDetails'))
    const profilePic = adminData?.azst_admin_details_profile_photo || ''


    const adminToken = process.env.REACT_APP_ADMIN_JWT_TOKEN
    let token = Cookies.get(adminToken)


    const handleUserLogout = () => {
        window.location.replace('/addProduct')
        Cookies.remove(adminToken)

    }

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top adminNavbar">
            <div className="adminNavbarInnerSection">
                <div className='navIcon'>
                    <Link className="navbar-brand m-auto mr-md-auto" to="/">
                        <img className='navlogo' src='../../../azista.png' alt="img" /> Azista
                    </Link>
                </div>
                <form className="form input_group searchInputCont">
                    <span><IoMdSearch className='searchIcon' /></span>
                    <input type="search" className='searchInput' placeholder="Search.." />
                </form>
                <ul className="navbar-nav d-flex align-items-center">
                    <li className="nav-item d-flex align-items-center">{profilePic && token ? <img src={profilePic} className="userProfile" alt='userProfile' /> : <HiMiniUserCircle className='nav_social_icon' />}</li>

                    {token ? <div className="dropdown">
                        <button className="dropdown-toggle adminNavToggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            Admin<IoMdArrowDropdown />
                        </button>
                        <ul className="dropdown-menu adminDropdown">
                            <li><Link to='/ManageAccount' className='adminDropdownLink'>Manage Accounts</Link></li>
                            <li><Link className='adminDropdownLink'>User Activities</Link></li>
                            <li><Link className='adminDropdownLink' onClick={handleUserLogout}>Logout</Link></li>
                        </ul>
                    </div>
                        : <Link className="adminLoginBtn" to='/adminLoginPage'>Login</Link>}
                </ul>
            </div>
        </nav>
    )
}

export default AdminNavbar