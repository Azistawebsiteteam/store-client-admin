<<<<<<< HEAD
import React, { useRef } from 'react';
import AdminSideBar from '../Pages/AdminSideBar';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import errorHandler from '../Pages/ErrorHandler';
import axios from 'axios';
import { BiRupee } from 'react-icons/bi';
import { RiArrowUpDownLine } from 'react-icons/ri';
import { GoArrowUp, GoArrowDown } from 'react-icons/go';
import { Link } from 'react-router-dom';
import '../Pages/Admin.css';
import './index.css';
import { getStringData } from '../Utils/StringConcat';
import { DownloadTableExcel } from 'react-export-table-to-excel';
=======
import React from "react";
import AdminSideBar from "../Pages/AdminSideBar";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import errorHandler from "../Pages/ErrorHandler";
import axios from "axios";
import { BiRupee } from "react-icons/bi";
import { RiArrowUpDownLine } from "react-icons/ri";
import { GoArrowUp, GoArrowDown } from "react-icons/go";
import { Link } from "react-router-dom";
import "../Pages/Admin.css";
import "./index.css";
import Pagination from "../Components/Pagination";
import { getStringData } from "../Utils/StringConcat";
>>>>>>> 2c04beee565efeca35c604812ce70cb2020556d6

const CustomersListing = () => {
  const [displayFilterDropdown, setDisplayFilterDropdown] = useState(false);
  const [filteredVal, setFilteredValue] = useState('registeredon');
  const [filtersOrder, setFiltersOrder] = useState('DESC');
  const [activeUsers, setActiveUsers] = useState(true);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
<<<<<<< HEAD
  const tableRef = useRef();
=======
  const [totalCustomers, setTotalCustomers] = useState(0); //totalItems
  const [customersData, setCustomersData] = useState([]); // Store full list listOfItems
  const [currentPage, setCurrentPage] = useState(1);

  const logsPerPage = 10;

>>>>>>> 2c04beee565efeca35c604812ce70cb2020556d6
  const baseUrl = `${process.env.REACT_APP_API_URL}/users/get`;
  const token = Cookies.get(process.env.REACT_APP_ADMIN_JWT_TOKEN);

  useEffect(() => {
    const getCustomersData = async () => {
      try {
        const url = `${baseUrl}/all`;
        const headers = {
          Authorization: `Bearer ${token}`,
        };
        const body = {
          isActive: activeUsers,
          orderbyKey: filteredVal,
          sort: filtersOrder,
        };
        errorHandler.onLoading();
        const response = await axios.post(url, body, { headers });
        errorHandler.onSuccess();
        errorHandler.onLoadingClose();
        setCustomersData(response.data);
        setFilteredCustomers(response.data);
        setTotalCustomers(response.data.length);
      } catch (error) {
        errorHandler.onLoadingClose();
        errorHandler.onError(error);
      }
    };
    getCustomersData();
  }, [baseUrl, token, activeUsers, filteredVal, filtersOrder]);

  const handleFilters = (e) => {
    setFilteredValue(e.target.value);
  };

  const handleFiltersOrder = (txt) => {
    setFiltersOrder(txt);
  };

  const filterCustomers = (e) => {
    const customers = customersData.filter((customer) =>
      customer.azst_customer_name
        .toLowerCase()
        .startsWith(e.target.value.toLowerCase())
    );
    setFilteredCustomers(customers);
  };

  return (
    <div className='adminSec'>
      <AdminSideBar />
<<<<<<< HEAD
      <div className='commonSec'>
        <div className='filterSec'>
=======
      <div className="commonSec">
        <div className="commonTopSec">
>>>>>>> 2c04beee565efeca35c604812ce70cb2020556d6
          <input
            className='searchCustomer'
            type='search'
            placeholder='Search Customers'
            onChange={filterCustomers}
          />
          <div className='form-check form-switch'>
            <input
              className='form-check-input'
              type='checkbox'
              role='switch'
              checked={activeUsers}
              id='activeUsers'
              onChange={() => setActiveUsers(!activeUsers)}
            />
            <label className='form-check-label' htmlFor='activeUsers'>
              Active users
            </label>
          </div>
<<<<<<< HEAD
          <DownloadTableExcel
            filename='Customers'
            sheet='Customers-list'
            currentTableRef={tableRef.current}>
            <button className='exportBtn'> Export</button>
          </DownloadTableExcel>
          <Link to={'/add-customer'} className='infoBtn'>
=======
          <Link to={"/add-customer"} className="infoBtn addCustomerBtn">
>>>>>>> 2c04beee565efeca35c604812ce70cb2020556d6
            Add Customer
          </Link>
          <button
            className='sortBtn'
            onClick={() => setDisplayFilterDropdown(!displayFilterDropdown)}>
            <RiArrowUpDownLine color='#878282' strikeWidth={2} size={16} />
          </button>
          {displayFilterDropdown && (
<<<<<<< HEAD
            <div className='dropDown'>
              <p>Sort by</p>
              <div className='form-check'>
                <input
                  className='form-check-input'
                  type='radio'
                  name='filterSec'
                  id='totalorder'
                  value='totalorder'
=======
            <div className="filterDropdown filterSec">
              <p style={{ marginLeft: "-1.4rem" }}>Sort by</p>
              <div className="form-check">
                <input
                  className="form-check-input filterInput"
                  type="radio"
                  name="filterSec"
                  id="totalorder"
                  value="totalorder"
>>>>>>> 2c04beee565efeca35c604812ce70cb2020556d6
                  onChange={handleFilters}
                  checked={'totalorder' === filteredVal}
                />
                <label className='form-check-label' htmlFor='totalorder'>
                  Total Order
                </label>
              </div>
              <div className='form-check'>
                <input
<<<<<<< HEAD
                  className='form-check-input'
                  type='radio'
                  name='filterSec'
                  id='totalamountspent'
                  value='totalamountspent'
=======
                  className="form-check-input filterInput"
                  type="radio"
                  name="filterSec"
                  id="totalamountspent"
                  value="totalamountspent"
>>>>>>> 2c04beee565efeca35c604812ce70cb2020556d6
                  onChange={handleFilters}
                  checked={'totalamountspent' === filteredVal}
                />
                <label className='form-check-label' htmlFor='totalamountspent'>
                  Total Amount Spent
                </label>
              </div>
              <div className='form-check'>
                <input
<<<<<<< HEAD
                  className='form-check-input'
                  type='radio'
                  name='filterSec'
                  id='lastupdated'
                  value='lastupdated'
=======
                  className="form-check-input filterInput"
                  type="radio"
                  name="filterSec"
                  id="lastupdated"
                  value="lastupdated"
>>>>>>> 2c04beee565efeca35c604812ce70cb2020556d6
                  onChange={handleFilters}
                  checked={'lastupdated' === filteredVal}
                />
                <label className='form-check-label' htmlFor='lastupdated'>
                  Last updated
                </label>
              </div>
              <div className='form-check'>
                <input
<<<<<<< HEAD
                  className='form-check-input'
                  type='radio'
                  name='filterSec'
                  id='registeredon'
                  value='registeredon'
=======
                  className="form-check-input filterInput"
                  type="radio"
                  name="filterSec"
                  id="registeredon"
                  value="registeredon"
>>>>>>> 2c04beee565efeca35c604812ce70cb2020556d6
                  onChange={handleFilters}
                  checked={'registeredon' === filteredVal}
                />
                <label className='form-check-label' htmlFor='registeredon'>
                  Registered on
                </label>
              </div>
<<<<<<< HEAD
              <div className='mt-1'>
                <GoArrowUp />
                <small
                  className={filtersOrder === 'ASC' && 'active'}
                  onClick={() => handleFiltersOrder('ASC')}>
=======
              <div
                className="mt-1"
                style={{ marginLeft: "-1.4rem", cursor: "pointer" }}
              >
                <GoArrowUp size={14} style={{ marginRight: "0.8rem" }} />
                <label
                  className={filtersOrder === "ASC" && "active"}
                  onClick={() => handleFiltersOrder("ASC")}
                >
>>>>>>> 2c04beee565efeca35c604812ce70cb2020556d6
                  Oldest to newest
                </label>
              </div>
<<<<<<< HEAD
              <div className='mt-1'>
                <GoArrowDown />
                <small
                  className={filtersOrder === 'DESC' && 'active'}
                  onClick={() => handleFiltersOrder('DESC')}>
=======
              <div
                className="mt-1"
                style={{ marginLeft: "-1.4rem", cursor: "pointer" }}
              >
                <GoArrowDown size={14} style={{ marginRight: "0.8rem" }} />
                <label
                  className={filtersOrder === "DESC" && "active"}
                  onClick={() => handleFiltersOrder("DESC")}
                >
>>>>>>> 2c04beee565efeca35c604812ce70cb2020556d6
                  Newest to oldest
                </label>
              </div>
            </div>
          )}
        </div>
        <div className='tableCont'>
          <table
            ref={tableRef}
            className='table table-hover'
            style={{ minWidth: '1000px' }}>
            <thead>
              <tr>
                <th>S.No</th>
                <th>Customer name</th>
                <th>Email subscription</th>
                <th>Location</th>
                <th>Orders</th>
                <th>Amount spent</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((each, i) => (
                <tr key={i}>
                  <td>{(currentPage - 1) * logsPerPage + i + 1}</td>
                  <td>
                    <Link
                      to={`/customer/${each.azst_customer_id}`}
                      style={{ textDecoration: 'none' }}>
                      {each.azst_customer_name}
                    </Link>
                  </td>
                  <td>
                    <span
                      className={
<<<<<<< HEAD
                        each?.azst_customer_acceptemail_marketing.toLowerCase() ===
                        'yes'
                          ? 'subscribed'
                          : 'notsubscribed'
                      }>
                      {each?.azst_customer_acceptemail_marketing.toLowerCase() ===
                      'yes'
                        ? 'Subscribed'
                        : 'Not Subscribed'}
=======
                        each?.azst_customer_acceptemail_marketing?.toLowerCase() ===
                        "yes"
                          ? "subscribed"
                          : "notsubscribed"
                      }
                    >
                      {each?.azst_customer_acceptemail_marketing?.toLowerCase() ===
                      "yes"
                        ? "Subscribed"
                        : "Not Subscribed"}
>>>>>>> 2c04beee565efeca35c604812ce70cb2020556d6
                    </span>
                  </td>
                  <td>
                    {getStringData([
                      each?.azst_customer_state,
                      each?.azst_customer_country,
                    ])}
                  </td>
                  <td>
                    {each.azst_customer_totalorders &&
                      each.azst_customer_totalorders}
                  </td>
                  <td>
                    <BiRupee />
                    {each.azst_customer_totalspent}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination
          logsPerPage={logsPerPage}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalItems={totalCustomers}
          listOfItems={customersData}
          setFilteredItemsList={setFilteredCustomers}
        />
      </div>
    </div>
  );
};

export default CustomersListing;
