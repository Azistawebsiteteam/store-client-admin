import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';
import { FaFirstOrder } from 'react-icons/fa6';
import { MdInventory } from 'react-icons/md';
// import { FaProductHunt } from "react-icons/fa";
// import { MdCollectionsBookmark } from "react-icons/md";
// import { GiKnightBanner } from "react-icons/gi";
import { ProductState } from '../Context/ProductContext';
// import { MdAssignmentReturned } from "react-icons/md";
import { BiSolidDiscount } from 'react-icons/bi';
// import { SiBrandfolder } from "react-icons/si";
import { MdRateReview } from 'react-icons/md';
// import { TfiAnnouncement } from "react-icons/tfi";
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';
import { IoIosPerson } from 'react-icons/io';
// import { SiBlogger } from "react-icons/si";
// import { FaQuestion } from "react-icons/fa";
import { MdFeaturedPlayList } from 'react-icons/md';
// import { BiSolidCategoryAlt } from "react-icons/bi";

const AdminSideBar = () => {
  const {
    activeTab,
    featureDropdownItems,
    setFeatureDropdownItems,
    ordersDropdownItems,
    setOrdersDropdownItems,
    productsDropdownItems,
    setProductsDropdownItems,
    toggleSidebar,
  } = ProductState();

  const handleProductsDropdownClick = () => {
    setProductsDropdownItems(!productsDropdownItems);
    setFeatureDropdownItems(false);
    setOrdersDropdownItems(false);
  };

  const handleOrdersDropdownClick = () => {
    setOrdersDropdownItems(!ordersDropdownItems);
    setFeatureDropdownItems(false);
    setProductsDropdownItems(false);
  };

  const handleFeaturesDropdownClick = () => {
    setFeatureDropdownItems(!featureDropdownItems);
    setOrdersDropdownItems(false);
    setProductsDropdownItems(false);
  };

  const handleNavbarItemClick = () => {
    setFeatureDropdownItems(false);
    setOrdersDropdownItems(false);
    setProductsDropdownItems(false);
  };

  return (
    <div
      className={`sidebarCont ${toggleSidebar ? 'closeSidebar' : ''}`}
      id='sidebarCont'>
      <ul className='sideBarItems'>
        <Link className='link' to='/'>
          <li
            className={
              activeTab === '/'
                ? 'linkItem activeTab'
                : 'linkItem singleLinkItem'
            }
            onClick={handleNavbarItemClick}>
            <FaHome className='me-3' /> Home
          </li>
        </Link>

        <button
          className='dropdown-btn customDropdownButton'
          id='drobdownBtn'
          onClick={handleOrdersDropdownClick}>
          <FaFirstOrder className='me-3' />
          Orders
          {ordersDropdownItems ? (
            <FaAngleUp className='ms-2' />
          ) : (
            <FaAngleDown className='ms-2' />
          )}
        </button>
        {ordersDropdownItems && (
          <div className='childElements'>
            <Link className='link' to='/orders'>
              <li
                className={
                  activeTab.startsWith('/order')
                    ? 'linkItem activeTab'
                    : 'linkItem dropdownItems'
                }>
                {/* <FaFirstOrder className="me-3" /> */}
                Orders Log
              </li>
            </Link>
            {/* <Link className="link" to="/products">
                  <li
                    className={
                      activeTab.startsWith("/product")
                        ? "linkItem activeTab"
                        : "linkItem dropdownItems"
                    }
                  >
                    Returns
                  </li>
                </Link> */}
            <Link className='link' to='/checkouts'>
              <li
                className={
                  activeTab.startsWith('/checkouts')
                    ? 'linkItem activeTab'
                    : 'linkItem dropdownItems'
                }>
                Abandoned checkouts
              </li>
            </Link>
          </div>
        )}
        <Link className='link' to='/inventory'>
          <li
            className={
              activeTab === '/inventory'
                ? 'linkItem activeTab'
                : 'linkItem singleLinkItem'
            }
            onClick={(e) => handleNavbarItemClick(false)}>
            <MdInventory className='me-3' /> Inventory
          </li>
        </Link>
        <button
          className='dropdown-btn customDropdownButton'
          id='drobdownBtn'
          onClick={handleProductsDropdownClick}>
          <MdFeaturedPlayList className='me-3' />
          Products
          {productsDropdownItems ? (
            <FaAngleUp className='ms-2' />
          ) : (
            <FaAngleDown className='ms-2' />
          )}
        </button>
        {productsDropdownItems && (
          <div className='childElements'>
            <Link className='link' to='/products'>
              <li
                className={
                  activeTab.startsWith('/product')
                    ? 'linkItem activeTab'
                    : 'linkItem dropdownItems'
                }>
                {/* <FaProductHunt className="me-3" />  */}
                Products
              </li>
            </Link>
            <Link className='link' to='/collections'>
              <li
                className={
                  activeTab.startsWith('/collections')
                    ? 'linkItem activeTab'
                    : 'linkItem dropdownItems'
                }>
                {/* <MdCollectionsBookmark className="me-3" />  */}
                Collections
              </li>
            </Link>
            <Link className='link' to='/categories'>
              <li
                className={
                  activeTab.startsWith('/categories')
                    ? 'linkItem activeTab'
                    : 'linkItem dropdownItems'
                }>
                {/* <BiSolidCategoryAlt className="me-3" />  */}
                Categories
              </li>
            </Link>
            <Link className='link' to='/brands'>
              <li
                className={
                  activeTab.startsWith('/brands')
                    ? 'linkItem activeTab'
                    : 'linkItem dropdownItems'
                }>
                {/* <SiBrandfolder className="me-3" />  */}
                Brands
              </li>
            </Link>
          </div>
        )}
        <Link className='link' to='/discount'>
          <li
            className={
              activeTab.startsWith('/discount')
                ? 'linkItem activeTab'
                : 'linkItem singleLinkItem'
            }
            onClick={(e) => handleNavbarItemClick(false)}>
            <BiSolidDiscount className='me-3' /> Discounts
          </li>
        </Link>
        <button
          className='dropdown-btn customDropdownButton'
          id='drobdownBtn'
          onClick={handleFeaturesDropdownClick}>
          <MdFeaturedPlayList className='me-3' />
          Features
          {featureDropdownItems ? (
            <FaAngleUp className='ms-2' />
          ) : (
            <FaAngleDown className='ms-2' />
          )}
        </button>
        {featureDropdownItems && (
          <div className='childElements'>
            <Link className='link' to='/popup'>
              <li
                className={
                  activeTab.startsWith('/popup')
                    ? 'linkItem activeTab'
                    : 'linkItem dropdownItems'
                }>
                {/* <MdCollectionsBookmark className="me-3" /> */}
                Popup
              </li>
            </Link>
            <Link className='link' to='/slider'>
              <li
                className={
                  activeTab.startsWith('/slider')
                    ? 'linkItem activeTab'
                    : 'linkItem dropdownItems'
                }>
                {/* <GiKnightBanner className="me-3" /> */}
                Slider Banner
              </li>
            </Link>
            <Link className='link' to='/product-banners'>
              <li
                className={
                  activeTab.startsWith('/product-banners')
                    ? 'linkItem activeTab'
                    : 'linkItem dropdownItems'
                }>
                {/* <GiKnightBanner className="me-3" /> */}
                Product Banner
              </li>
            </Link>
            <Link className='link' to='/announcements'>
              <li
                className={
                  activeTab.startsWith('/announcements')
                    ? 'linkItem activeTab'
                    : 'linkItem dropdownItems'
                }>
                {/* <TfiAnnouncement className="me-3" />  */}
                Announcement Bar
              </li>
            </Link>
            <Link className='link' to='/blogs'>
              <li
                className={
                  activeTab.startsWith('/blogs')
                    ? 'linkItem activeTab'
                    : 'linkItem dropdownItems'
                }>
                {/* <SiBlogger className="me-3" />  */}
                Blogs
              </li>
            </Link>
            <Link className='link' to='/faqs'>
              <li
                className={
                  activeTab.startsWith('/faqs')
                    ? 'linkItem activeTab'
                    : 'linkItem dropdownItems'
                }>
                {/* <FaQuestion className="me-3" /> */}
                Faqs
              </li>
            </Link>
          </div>
        )}
        <Link className='link' to='/review-list'>
          <li
            className={
              activeTab.startsWith('/review')
                ? 'linkItem activeTab'
                : 'linkItem singleLinkItem'
            }
            onClick={(e) => handleNavbarItemClick(false)}>
            <MdRateReview className='me-3' /> Manage Reviews
          </li>
        </Link>
        <Link className='link' to='/customers'>
          <li
            className={
              activeTab.startsWith('/customer')
                ? 'linkItem activeTab'
                : 'linkItem singleLinkItem'
            }
            onClick={(e) => handleNavbarItemClick(false)}>
            <IoIosPerson className='me-3' /> Customers
          </li>
        </Link>
      </ul>
    </div>
  );
};

export default AdminSideBar;
