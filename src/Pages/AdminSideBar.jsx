import React from "react";
import { Link } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import { FaFirstOrder } from "react-icons/fa6";
import { MdInventory } from "react-icons/md";
import { FaProductHunt } from "react-icons/fa";
import { MdCollectionsBookmark } from "react-icons/md";
import { GiKnightBanner } from "react-icons/gi";
import { ProductState } from "../Context/ProductContext";

import { BiSolidDiscount } from "react-icons/bi";
import { SiBrandfolder } from "react-icons/si";
import { MdRateReview } from "react-icons/md";
import { TfiAnnouncement } from "react-icons/tfi";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { IoIosPerson } from "react-icons/io";
import { SiBlogger } from "react-icons/si";
import { FaQuestion } from "react-icons/fa";
import { MdFeaturedPlayList } from "react-icons/md";
import { BiSolidCategoryAlt } from "react-icons/bi";

const AdminSideBar = () => {
  const { activeTab, dropdownItems, setDropdownItems } = ProductState();

  return (
    <div className="sidebarCont">
      <ul className="sideBarItems">
        <Link className="link" to="/">
          <li
            className={activeTab === "/" ? "linkItem activeTab" : "linkItem"}
            onClick={(e) => setDropdownItems(false)}
          >
            <FaHome className="me-1" /> Home
          </li>
        </Link>
        <Link className="link" to="/orders">
          <li
            className={
              activeTab.startsWith("/order") ? "linkItem activeTab" : "linkItem"
            }
            onClick={(e) => setDropdownItems(false)}
          >
            <FaFirstOrder className="me-1" /> Orders
          </li>
        </Link>
        <Link className="link" to="/inventory">
          <li
            className={
              activeTab === "/inventory" ? "linkItem activeTab" : "linkItem"
            }
            onClick={(e) => setDropdownItems(false)}
          >
            <MdInventory className="me-1" /> Inventory
          </li>
        </Link>
        <Link className="link" to="/products">
          <li
            className={
              activeTab.startsWith("/product")
                ? "linkItem activeTab"
                : "linkItem"
            }
            onClick={(e) => setDropdownItems(false)}
          >
            <FaProductHunt className="me-1" /> Products
          </li>
        </Link>
        <button
          className="dropdown-btn customDropdownButton"
          id="drobdownBtn"
          onClick={(e) => setDropdownItems(!dropdownItems)}
        >
          <MdFeaturedPlayList /> Features
          {dropdownItems ? (
            <FaAngleUp className="ms-2" />
          ) : (
            <FaAngleDown className="ms-2" />
          )}
        </button>
        {dropdownItems && (
          <div className="childElements">
            <Link className="link" to="/collections">
              <li
                className={
                  activeTab.startsWith("/collections")
                    ? "linkItem activeTab"
                    : "linkItem dropdownItems"
                }
              >
                <MdCollectionsBookmark className="me-1" /> Collections
              </li>
            </Link>
            <Link className="link" to="/popup">
              <li
                className={
                  activeTab.startsWith("/popup")
                    ? "linkItem activeTab"
                    : "linkItem dropdownItems"
                }
              >
                <MdCollectionsBookmark className="me-1" /> Popup
              </li>
            </Link>
            <Link className="link" to="/slider">
              <li
                className={
                  activeTab.startsWith("/slider")
                    ? "linkItem activeTab"
                    : "linkItem dropdownItems"
                }
              >
                <GiKnightBanner className="me-1" />
                Slider Banner
              </li>
            </Link>
            <Link className="link" to="/product-banners">
              <li
                className={
                  activeTab.startsWith("/product-banners")
                    ? "linkItem activeTab"
                    : "linkItem dropdownItems"
                }
              >
                <GiKnightBanner className="me-1" />
                Product Banner
              </li>
            </Link>
            <Link className="link" to="/categories">
              <li
                className={
                  activeTab.startsWith("/categories")
                    ? "linkItem activeTab"
                    : "linkItem dropdownItems"
                }
              >
                <BiSolidCategoryAlt className="me-1" /> Categories
              </li>
            </Link>
            <Link className="link" to="/brands">
              <li
                className={
                  activeTab.startsWith("/brands")
                    ? "linkItem activeTab"
                    : "linkItem dropdownItems"
                }
              >
                <SiBrandfolder className="me-1" /> Brands
              </li>
            </Link>

            <Link className="link" to="/announcements">
              <li
                className={
                  activeTab.startsWith("/announcements")
                    ? "linkItem activeTab"
                    : "linkItem dropdownItems"
                }
              >
                <TfiAnnouncement className="me-1" /> Announcement Bar
              </li>
            </Link>
            <Link className="link" to="/blogs">
              <li
                className={
                  activeTab.startsWith("/blogs")
                    ? "linkItem activeTab"
                    : "linkItem dropdownItems"
                }
              >
                <SiBlogger className="me-1" /> Blogs
              </li>
            </Link>
            <Link className="link" to="/faqs">
              <li
                className={
                  activeTab.startsWith("/faqs")
                    ? "linkItem activeTab"
                    : "linkItem dropdownItems"
                }
              >
                <FaQuestion className="me-1" /> Faqs
              </li>
            </Link>
          </div>
        )}
        <Link className="link" to="/discount">
          <li
            className={
              activeTab.startsWith("/discount")
                ? "linkItem activeTab"
                : "linkItem"
            }
            onClick={(e) => setDropdownItems(false)}
          >
            <BiSolidDiscount className="me-1" /> Discounts
          </li>
        </Link>
        <Link className="link" to="/review-list">
          <li
            className={
              activeTab.startsWith("/review")
                ? "linkItem activeTab"
                : "linkItem"
            }
            onClick={(e) => setDropdownItems(false)}
          >
            <MdRateReview className="me-1" /> Manage Reviews
          </li>
        </Link>
        <Link className="link" to="/customers">
          <li
            className={
              activeTab.startsWith("/customer")
                ? "linkItem activeTab"
                : "linkItem"
            }
            onClick={(e) => setDropdownItems(false)}
          >
            <IoIosPerson className="me-1" /> Customers
          </li>
        </Link>
      </ul>
    </div>
  );
};

export default AdminSideBar;
