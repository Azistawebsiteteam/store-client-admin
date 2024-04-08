
import React from 'react'
import { Link } from 'react-router-dom'
import { FaHome } from "react-icons/fa";
import { FaFirstOrder } from "react-icons/fa6";
import { MdInventory } from "react-icons/md";
import { FaProductHunt } from "react-icons/fa";
import { MdCollectionsBookmark } from "react-icons/md";
import { GiKnightBanner } from "react-icons/gi";
import { productContext } from '../Context/ProductContext'
import { useContext } from 'react';

const AdminSideBar = () => {
    const { activeTab, setActiveTab } = useContext(productContext)

    const handleTabClick = (tabId) => {
        setActiveTab((prevTab) => (prevTab === tabId ? prevTab : tabId))
    }

    return (
        <div className='sidebarCont'>
            <ul className='sideBarItems'>
                <Link className='link' to="/" onClick={() => handleTabClick('tab1')}>
                    <li className={activeTab === 'tab1' ? 'activeTab' : 'linkItem'}>
                        <FaHome /> Home
                    </li>
                </Link>
                <Link className='link' to="/orders" onClick={() => handleTabClick('tab2')}>
                    <li className={activeTab === 'tab2' ? 'activeTab' : 'linkItem'}>
                        <FaFirstOrder /> Orders
                    </li>
                </Link>
                <Link className='link' to="/inventory" onClick={() => handleTabClick('tab3')}>
                    <li className={activeTab === 'tab3' ? 'activeTab' : 'linkItem'}>
                        <MdInventory /> Inventory
                    </li>
                </Link>
                <Link className='link' to='/productListing' onClick={() => handleTabClick('tab4')}>
                    <li className={activeTab === 'tab4' ? 'activeTab' : 'linkItem'}>
                        <FaProductHunt /> Products
                    </li>
                </Link>
                <Link className='link' to="/Collections" onClick={() => handleTabClick('tab5')}>
                    <li className={activeTab === 'tab5' ? 'activeTab' : 'linkItem'}>
                        <MdCollectionsBookmark /> Collections
                    </li>
                </Link>
                <Link className='link' to="/slidersListing" onClick={() => handleTabClick('tab6')}>
                    <li className={activeTab === 'tab6' ? 'activeTab' : 'linkItem'}>
                        <GiKnightBanner /> Create Slider
                    </li>
                </Link>
            </ul>
        </div>
    )
}

export default AdminSideBar