import React, { useEffect, useRef, useState } from "react";

import { Link } from "react-router-dom";

import axios from "axios";
import Cookies from "js-cookie";

import ErrorHandler from "../Pages/ErrorHandler";
import Pagination from "../Components/Pagination";
import { DownloadTableExcel } from "react-export-table-to-excel";
import AdminSideBar from "../Pages/AdminSideBar";

const InventoryLocations = () => {
  const [inventoryList, setInventoryList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalInventories, setTotalInventories] = useState(0);
  const [filteredInventories, setFilteredInventories] = useState([]);
  const tableRef = useRef(null);

  const baseUrl = process.env.REACT_APP_API_URL;
  const token = Cookies.get(process.env.REACT_APP_ADMIN_JWT_TOKEN);

  const logsPerPage = 10;

  useEffect(() => {
    const getInventories = async () => {
      try {
        const url = `${baseUrl}/inventory/locations/details`;
        const headers = {
          Authorization: `Bearer ${token} `,
        };
        ErrorHandler.onLoading();
        const response = await axios.get(url, { headers });
        ErrorHandler.onLoadingClose();
        const totalItems = response.data;
        setInventoryList(totalItems);
        setTotalInventories(totalItems.length);
        setFilteredInventories(totalItems);
      } catch (error) {
        ErrorHandler.onLoadingClose();
        ErrorHandler.onError(error);
      }
    };
    getInventories();
  }, [token, baseUrl]);

  return (
    <div className="adminSec">
      <AdminSideBar />
      <div className="commonSec">
        <div className="container">
          <div className="row">
            <div className="commonTopSec">
              <h4>Inventories</h4>
              <DownloadTableExcel
                filename="inventory table"
                sheet="inventories"
                currentTableRef={tableRef.current}
              >
                <button className="exportBtn"> Export</button>
              </DownloadTableExcel>
              <Link to="/inventory/create" className="infoBtn">
                Add Inventory
              </Link>
            </div>

            <div className="middleSec">
              <div className="tableCont">
                <table
                  ref={tableRef}
                  className="table table-hover"
                  style={{ minWidth: "1200px" }}
                >
                  <thead>
                    <tr className="tableHeader">
                      <th
                        className="sticky-column"
                        scope="col"
                        style={{ width: "15%" }}
                      >
                        Name
                      </th>
                      <th scope="col" style={{ width: "10%" }}>
                        Location
                      </th>
                      <th scope="col">Latitude</th>
                      <th scope="col">Longitude</th>
                      <th scope="col">Address</th>
                      <th scope="col" style={{ width: "10%" }}>
                        Phone
                      </th>
                      <th scope="col">Email</th>
                      <th scope="col">Pincode</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredInventories.map((i) => (
                      <tr key={i.inventory_id}>
                        <td
                          className="sticky-column"
                          style={{ width: "120px" }}
                        >
                          {i.inventory_name}
                        </td>
                        <td>{i.inventory_location}</td>
                        <td>{i.inventory_latitude}</td>
                        <td>{i.inventory_longitude}</td>
                        <td>{i.inventory_address}</td>
                        <td>{i.inventory_phone}</td>
                        <td>{i.inventory_mail}</td>{" "}
                        <td>{i.inventory_pin_code}</td>
                        <td>
                          {i.inventory_status === 1 ? (
                            <span className="activeProduct">Active</span>
                          ) : (
                            <span className="draftProduct">InActive</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <Pagination
              logsPerPage={logsPerPage}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalItems={totalInventories}
              listOfItems={inventoryList}
              setFilteredItemsList={setFilteredInventories}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryLocations;
