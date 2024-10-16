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
import { FcFaq } from "react-icons/fc";

import { BiSolidCategoryAlt } from "react-icons/bi";

const AdminSideBar = () => {
  const { activeTab, dropdownItems, setDropdownItems } = ProductState();

  return (
    <div className="sidebarCont">
      <ul className="sideBarItems">
        <Link className="link" to="/">
          <li className={activeTab === "/" ? "activeTab" : "linkItem"}>
            <FaHome /> Home
          </li>
        </Link>
        <Link className="link" to="/orders">
          <li
            className={
              activeTab.startsWith("/order") ? "activeTab" : "linkItem"
            }
          >
            <FaFirstOrder /> Orders
          </li>
        </Link>
        <Link className="link" to="/inventory">
          <li className={activeTab === "/inventory" ? "activeTab" : "linkItem"}>
            <MdInventory /> Inventory
          </li>
        </Link>
        <Link className="link" to="/products">
          <li
            className={
              activeTab.startsWith("/product") ? "activeTab" : "linkItem"
            }
          >
            <FaProductHunt /> Products
          </li>
        </Link>
        <button
          className="dropdown-btn"
          id="drobdownBtn"
          onClick={(e) => setDropdownItems(!dropdownItems)}
        >
          Features
          {dropdownItems ? <FaAngleUp /> : <FaAngleDown />}
        </button>
        {dropdownItems && (
          <div className="childElements">
            <Link className="link" to="/collections">
              <li
                className={
                  activeTab.startsWith("/collections")
                    ? "activeTab"
                    : "linkItem"
                }
              >
                <MdCollectionsBookmark /> Collections
              </li>
            </Link>
            <Link className="link" to="/popup">
              <li
                className={
                  activeTab.startsWith("/popup") ? "activeTab" : "linkItem"
                }
              >
                <MdCollectionsBookmark /> Popup
              </li>
            </Link>
            <Link className="link" to="/slider">
              <li
                className={
                  activeTab.startsWith("/slider") ? "activeTab" : "linkItem"
                }
              >
                <GiKnightBanner />
                Slider Banner
              </li>
            </Link>
            <Link className="link" to="/product-banners">
              <li
                className={
                  activeTab.startsWith("/product-banners")
                    ? "activeTab"
                    : "linkItem"
                }
              >
                <GiKnightBanner />
                Product Banner
              </li>
            </Link>
            <Link className="link" to="/categories">
              <li
                className={
                  activeTab.startsWith("/categories") ? "activeTab" : "linkItem"
                }
              >
                <BiSolidCategoryAlt /> Categories
              </li>
            </Link>
            <Link className="link" to="/brands">
              <li
                className={
                  activeTab.startsWith("/brands") ? "activeTab" : "linkItem"
                }
              >
                <SiBrandfolder /> Brands
              </li>
            </Link>

            <Link className="link" to="/announcements">
              <li
                className={
                  activeTab.startsWith("/announcements")
                    ? "activeTab"
                    : "linkItem"
                }
              >
                <TfiAnnouncement /> Announcement Bar
              </li>
            </Link>
            <Link className="link" to="/blogs">
              <li
                className={
                  activeTab.startsWith("/blogs") ? "activeTab" : "linkItem"
                }
              >
                <SiBlogger /> Blogs
              </li>
            </Link>
            <Link className="link" to="/faqs">
              <li
                className={
                  activeTab.startsWith("/faqs") ? "activeTab" : "linkItem"
                }
              >
                <FcFaq style={{ fontSize: "25px" }} /> Faqs
              </li>
            </Link>
          </div>
        )}
        <Link className="link" to="/discount">
          <li
            className={
              activeTab.startsWith("/discount") ? "activeTab" : "linkItem"
            }
          >
            <BiSolidDiscount /> Discounts
          </li>
        </Link>
        <Link className="link" to="/review-list">
          <li
            className={
              activeTab.startsWith("/review") ? "activeTab" : "linkItem"
            }
          >
            <MdRateReview /> Manage Reviews
          </li>
        </Link>
        <Link className="link" to="/customers">
          <li
            className={
              activeTab.startsWith("/customer") ? "activeTab" : "linkItem"
            }
          >
            <IoIosPerson /> Customers
          </li>
        </Link>
      </ul>
    </div>
  );
};

export default AdminSideBar;
