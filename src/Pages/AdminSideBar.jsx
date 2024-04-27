
import React from 'react'
import { Link } from 'react-router-dom'
import { FaHome } from "react-icons/fa";
import { FaFirstOrder } from "react-icons/fa6";
import { MdInventory } from "react-icons/md";
import { FaProductHunt } from "react-icons/fa";
import { MdCollectionsBookmark } from "react-icons/md";
import { GiKnightBanner } from "react-icons/gi";
import { productContext } from '../Context/ProductContext';
import { useContext } from 'react';
import { BiSolidDiscount } from "react-icons/bi";
import { SiBrandfolder } from "react-icons/si";

const AdminSideBar = () => {
    const { activeTab } = useContext(productContext)
    return (
        <div className='sidebarCont'>
            <ul className='sideBarItems'>
                <Link className='link' to="/" >
                    <li className={activeTab === '/' ? 'activeTab' : 'linkItem'}>
                        <FaHome /> Home
                    </li>
                </Link>
                <Link className='link' to="/orders" >
                    <li className={activeTab.startsWith('/orders') ? 'activeTab' : 'linkItem'}>
                        <FaFirstOrder /> Orders
                    </li>
                </Link>
                <Link className='link' to="/inventory" >
                    <li className={activeTab === '/inventory' ? 'activeTab' : 'linkItem'}>
                        <MdInventory /> Inventory
                    </li>
                </Link>
                <Link className='link' to='/products' >
                    <li className={activeTab.startsWith('/product') ? 'activeTab' : 'linkItem'}>
                        <FaProductHunt /> Products
                    </li>
                </Link>
                <Link className='link' to="/collections" >
                    <li className={activeTab.startsWith('/collections') ? 'activeTab' : 'linkItem'}>
                        <MdCollectionsBookmark /> Collections
                    </li>
                </Link>
                <Link className='link' to="/slider" >
                    <li className={activeTab.startsWith('/slider') ? 'activeTab' : 'linkItem'}>
                        <GiKnightBanner />Slider
                    </li>
                </Link>
                <Link className='link' to="/discount">
                    <li className={activeTab.startsWith("/discount") ? 'activeTab' : 'linkItem'}>
                        <BiSolidDiscount /> Discounts
                    </li>
                </Link>
                <Link className='link' to="/brands" >
                    <li className={activeTab.startsWith('/brands') ? 'activeTab' : 'linkItem'}>
                        <SiBrandfolder /> Brands
                    </li>
                </Link>
            </ul>
        </div>
    )
}

export default AdminSideBar