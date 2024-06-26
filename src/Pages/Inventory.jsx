import React from "react";
import Dropdown from "react-bootstrap/Dropdown";
import AdminSideBar from "./AdminSideBar";
import { FaCaretDown } from "react-icons/fa";
import Table from "react-bootstrap/Table";
import "./Admin.css";

const Inventory = () => {
  return (
    <div className="adminSec">
      <AdminSideBar />
      <div className="commonSec">
        <div className="actions">
          <Dropdown>
            <Dropdown.Toggle
              className="inventoryDropdownBtn"
              variant="transparent"
              id="dropdown-basic"
            >
              Inventory
              <FaCaretDown className="downArr" />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item href="#/action-1">
                Corporate Office Hyderabad
              </Dropdown.Item>
              <Dropdown.Item href="#/action-2">Merge customer</Dropdown.Item>
              <Dropdown.Item href="#/action-3">Delete account</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <div className="bgStyle">
          <Table hover responsive size="lg">
            <thead>
              <tr>
                <th>
                  <input type="checkbox" />
                </th>
                <th className="col">Product</th>
                <th className="col" width={"20%"}>
                  SKU
                </th>
                <th className="col">Unavailable</th>
                <th className="col">Committed</th>
                <th className="col">Available</th>
                <th className="col">On hand</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="col">
                  <input type="checkbox" />
                </td>
                <td className="col">
                  DEFEND99 Single Color Self Sanitizing Reusable - Washable Face
                  Mask
                </td>
                <td className="col">DSTSS-WFM</td>
                <td className="col">0</td>
                <td className="col">0</td>
                <td className="col">
                  <input type="number" className="inventoryInput" />
                </td>
                <td className="col">
                  <input type="number" className="inventoryInput" />
                </td>
              </tr>
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
