import React from "react";
import { Link } from "react-router-dom";
import { FaHome, FaAngleDown, FaAngleUp } from "react-icons/fa";
import { FaFirstOrder } from "react-icons/fa6";
import { MdInventory, MdFeaturedPlayList, MdRateReview } from "react-icons/md";
import { BiSolidDiscount } from "react-icons/bi";
import { IoIosPerson } from "react-icons/io";
import { ProductState } from "../Context/ProductContext";
import "./Admin.css";

const AdminSideBar = () => {
  const {
    activeTab,
    toggleSidebar,
    setToggleSidebar,
    dropdowns,
    setDropdowns,
  } = ProductState();

  const handleDropdowns = (e) => {
    const { name } = e.target;
    setDropdowns((prevDropdowns) => ({
      ...Object.fromEntries(
        Object.keys(prevDropdowns).map((key) => [key, false])
      ),
      [name]: !prevDropdowns[name],
    }));
  };

  const toggleSidebars = (e, close) => {
    const isMobileOrTablet = window.innerWidth <= 1024;
    if (close) handleDropdowns(e);
    if (isMobileOrTablet) {
      setToggleSidebar(true);
    }
  };

  return (
    <div
      className={`sidebarCont ${toggleSidebar ? "closeSidebar" : ""}`}
      id="sidebarCont"
    >
      <ul className="sideBarItems">
        <Link className="link" to="/">
          <li
            className={
              activeTab === "/"
                ? "linkItem activeTab"
                : "linkItem singleLinkItem"
            }
            onClick={(e) => toggleSidebars(e, true)}
          >
            <FaHome className="me-3" /> Home
          </li>
        </Link>

        <button
          className="dropdown-btn customDropdownButton"
          id="drobdownBtn"
          onClick={handleDropdowns}
          name="orders"
        >
          <FaFirstOrder className="me-3" />
          Orders
          {dropdowns.orders ? (
            <FaAngleUp className="ms-2" />
          ) : (
            <FaAngleDown className="ms-2" />
          )}
        </button>
        <br />
        {dropdowns.orders && (
          <div className="childElements">
            <Link
              className="link"
              to="/orders"
              onClick={(e) => toggleSidebars(e, false)}
            >
              <li
                className={
                  activeTab.startsWith("/order")
                    ? "linkItem activeTab"
                    : "linkItem dropdownItems"
                }
              >
                Orders Log
              </li>
            </Link>
            <Link
              className="link"
              to="/checkouts"
              onClick={(e) => toggleSidebars(e, false)}
            >
              <li
                className={
                  activeTab.startsWith("/checkouts")
                    ? "linkItem activeTab"
                    : "linkItem dropdownItems"
                }
              >
                Abandoned checkouts
              </li>
            </Link>
          </div>
        )}

        <button
          className="dropdown-btn customDropdownButton"
          id="drobdownBtn"
          onClick={handleDropdowns}
          name="inventory"
        >
          <MdInventory className="me-3" />
          Inventory
          {dropdowns.inventory ? (
            <FaAngleUp className="ms-2" />
          ) : (
            <FaAngleDown className="ms-2" />
          )}
        </button>
        <br />
        {dropdowns.inventory && (
          <div className="childElements">
            <Link
              className="link"
              to="/inventory"
              onClick={(e) => toggleSidebars(e, false)}
            >
              <li
                className={
                  activeTab === "/inventory"
                    ? "linkItem activeTab"
                    : "linkItem dropdownItems"
                }
              >
                {/* <MdInventory className='me-3' /> Inventory */} Inventory
              </li>
            </Link>
            <Link
              className="link"
              to="/inv/locations"
              onClick={(e) => toggleSidebars(e, false)}
            >
              <li
                className={
                  activeTab.startsWith("/inv/locations")
                    ? "linkItem activeTab"
                    : "linkItem dropdownItems"
                }
              >
                Locations
              </li>
            </Link>
          </div>
        )}

        <button
          className="dropdown-btn customDropdownButton"
          id="drobdownBtn"
          onClick={handleDropdowns}
          name="products"
        >
          <MdFeaturedPlayList className="me-3" />
          Products
          {dropdowns.products ? (
            <FaAngleUp className="ms-2" />
          ) : (
            <FaAngleDown className="ms-2" />
          )}
        </button>
        <br />
        {dropdowns.products && (
          <div className="childElements">
            <Link
              className="link"
              to="/products"
              onClick={(e) => toggleSidebars(e, false)}
            >
              <li
                className={
                  activeTab.startsWith("/product")
                    ? "linkItem activeTab"
                    : "linkItem dropdownItems"
                }
              >
                {/* <FaProductHunt className="me-3" />  */}
                Products
              </li>
            </Link>
            <Link
              className="link"
              to="/collections"
              onClick={(e) => toggleSidebars(e, false)}
            >
              <li
                className={
                  activeTab.startsWith("/collections")
                    ? "linkItem activeTab"
                    : "linkItem dropdownItems"
                }
              >
                {/* <MdCollectionsBookmark className="me-3" />  */}
                Collections
              </li>
            </Link>
            <Link
              className="link"
              to="/categories"
              onClick={(e) => toggleSidebars(e, false)}
            >
              <li
                className={
                  activeTab.startsWith("/categories")
                    ? "linkItem activeTab"
                    : "linkItem dropdownItems"
                }
              >
                {/* <BiSolidCategoryAlt className="me-3" />  */}
                Categories
              </li>
            </Link>
            <Link
              className="link"
              to="/brands"
              onClick={(e) => toggleSidebars(e, false)}
            >
              <li
                className={
                  activeTab.startsWith("/brands")
                    ? "linkItem activeTab"
                    : "linkItem dropdownItems"
                }
              >
                {/* <SiBrandfolder className="me-3" />  */}
                Brands
              </li>
            </Link>
          </div>
        )}

        <Link className="link" to="/discount">
          <li
            className={
              activeTab.startsWith("/discount")
                ? "linkItem activeTab"
                : "linkItem singleLinkItem"
            }
            onClick={(e) => toggleSidebars(e, true)}
          >
            <BiSolidDiscount className="me-3" /> Discounts
          </li>
        </Link>
        <button
          className="dropdown-btn customDropdownButton"
          id="drobdownBtn"
          onClick={handleDropdowns}
          name="features"
        >
          <MdFeaturedPlayList className="me-3" />
          Features
          {dropdowns.features ? (
            <FaAngleUp className="ms-2" />
          ) : (
            <FaAngleDown className="ms-2" />
          )}
        </button>
        <br />
        {dropdowns.features && (
          <div className="childElements">
            <Link
              className="link"
              to="/popup"
              onClick={(e) => toggleSidebars(e, false)}
            >
              <li
                className={
                  activeTab.startsWith("/popup")
                    ? "linkItem activeTab"
                    : "linkItem dropdownItems"
                }
              >
                {/* <MdCollectionsBookmark className="me-3" /> */}
                Popup
              </li>
            </Link>
            <Link
              className="link"
              to="/slider"
              onClick={(e) => toggleSidebars(e, false)}
            >
              <li
                className={
                  activeTab.startsWith("/slider")
                    ? "linkItem activeTab"
                    : "linkItem dropdownItems"
                }
              >
                {/* <GiKnightBanner className="me-3" /> */}
                Slider Banner
              </li>
            </Link>
            <Link
              className="link"
              to="/product-banners"
              onClick={(e) => toggleSidebars(e, false)}
            >
              <li
                className={
                  activeTab.startsWith("/product-banners")
                    ? "linkItem activeTab"
                    : "linkItem dropdownItems"
                }
              >
                {/* <GiKnightBanner className="me-3" /> */}
                Product Banner
              </li>
            </Link>
            <Link
              className="link"
              to="/announcements"
              onClick={(e) => toggleSidebars(e, false)}
            >
              <li
                className={
                  activeTab.startsWith("/announcements")
                    ? "linkItem activeTab"
                    : "linkItem dropdownItems"
                }
              >
                {/* <TfiAnnouncement className="me-3" />  */}
                Announcement Bar
              </li>
            </Link>
            <Link
              className="link"
              to="/blogs"
              onClick={(e) => toggleSidebars(e, false)}
            >
              <li
                className={
                  activeTab.startsWith("/blogs")
                    ? "linkItem activeTab"
                    : "linkItem dropdownItems"
                }
              >
                {/* <SiBlogger className="me-3" />  */}
                Blogs
              </li>
            </Link>
            <Link
              className="link"
              to="/faqs"
              onClick={(e) => toggleSidebars(e, false)}
            >
              <li
                className={
                  activeTab.startsWith("/faqs")
                    ? "linkItem activeTab"
                    : "linkItem dropdownItems"
                }
              >
                {/* <FaQuestion className="me-3" /> */}
                Faqs
              </li>
            </Link>
          </div>
        )}
        <Link
          className="link"
          to="/review-list"
          onClick={(e) => toggleSidebars(e, true)}
        >
          <li
            className={
              activeTab.startsWith("/review")
                ? "linkItem activeTab"
                : "linkItem singleLinkItem"
            }
            onClick={handleDropdowns}
          >
            <MdRateReview className="me-3" /> Manage Reviews
          </li>
        </Link>
        <Link
          className="link"
          to="/customers"
          onClick={(e) => toggleSidebars(e, true)}
        >
          <li
            className={
              activeTab.startsWith("/customer")
                ? "linkItem activeTab"
                : "linkItem singleLinkItem"
            }
            onClick={handleDropdowns}
          >
            <IoIosPerson className="me-3" /> Customers
          </li>
        </Link>
        <Link
          className="link"
          to="/shipcharges"
          onClick={(e) => toggleSidebars(e, true)}
        >
          <li
            className={
              activeTab.startsWith("/shipcharges")
                ? "linkItem activeTab"
                : "linkItem singleLinkItem"
            }
            onClick={handleDropdowns}
          >
            <img
              src={`${process.env.PUBLIC_URL}/shipping-charges.png`}
              alt="shippingCharges"
              style={{ width: "1.6rem" }}
              className="me-3 shippingChargesIcon"
            />
            Shipping Charges
          </li>
        </Link>
      </ul>
    </div>
  );
};

export default AdminSideBar;
