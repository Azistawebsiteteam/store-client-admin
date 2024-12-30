import React, { useState } from "react";
import axios from "axios";
import AdminSideBar from "../Pages/AdminSideBar";
import InventoryFrom from "./inventoryFrom";
import Cookies from "js-cookie";
import ErrorHandler from "../Pages/ErrorHandler";
import { handleValidationErrors } from "./validations";

const InventoryAdd = () => {
  const [locationData, setLocationData] = useState({
    inventoryId: "",
    inventoryName: "",
    inventoryLocation: "",
    inventoryLongitude: "",
    inventoryLatitude: "",
    inventoryAddress: "",
    inventoryEmail: "",
    inventoryPhone: "",
    pinCode: "",
  });
  const [validationErrors, setValidationErrors] = useState({});

  const baseUrl = process.env.REACT_APP_API_URL;
  const jwtToken = process.env.REACT_APP_ADMIN_JWT_TOKEN;
  const token = Cookies.get(jwtToken);

  const onSubmitInvtDetails = async () => {
    const validationsMsgs = handleValidationErrors(locationData);
    if (Object.keys(validationsMsgs).length > 0) {
      setValidationErrors(validationsMsgs);
      return;
    }
    try {
      const url = `${baseUrl}/inventory/add-location`;
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      ErrorHandler.onLoading();
      const response = await axios.post(url, locationData, { headers });
      console.log(response);
      ErrorHandler.onSuccess("Added Successfully");
      ErrorHandler.onLoadingClose();
    } catch (error) {
      ErrorHandler.onLoadingClose();
      ErrorHandler.onError(error);
    }
  };
  return (
    <div className="adminSec">
      <AdminSideBar />
      <div className="commonSec">
        <div className="addCustomerSection">
          <InventoryFrom
            locationData={locationData}
            setLocationData={setLocationData}
            validationErrors={validationErrors}
            setValidationErrors={setValidationErrors}
          />
          <div className="d-flex justify-content-end mb-5">
            <button onClick={onSubmitInvtDetails} className="adminBtn">
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryAdd;
