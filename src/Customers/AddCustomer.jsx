import React, { useState } from "react";
import Cookies from "js-cookie";
import CustomerForm from "./CustomerForm";
import AdminSideBar from "../Pages/AdminSideBar";
import axios from "axios";
import ErrorHandler from "../Pages/ErrorHandler";
import { useNavigate } from "react-router-dom";

const AddCustomer = () => {
  const [customerData, setCustomerData] = useState({
    customerMobileNum: "",
    customerEmail: "",
    customerFirstName: "",
    customerLastName: "",
    password: "",
    DOB: "",
    gender: "",
    wtsupNum: "",
    notes: "",
    tags: "",
  });

  const baseUrl = process.env.REACT_APP_API_URL;
  const token = Cookies.get(process.env.REACT_APP_ADMIN_JWT_TOKEN);

  const navigate = useNavigate();

  const onSubmitCustDetails = async () => {
    try {
      const url = `${baseUrl}/auth/register`;
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const body = {
        customerMobileNum: customerData.customerMobileNum,
        customerEmail: customerData.customerEmail,
        customerFirstName: customerData.customerFirstName,
        customerLastName: customerData.customerLastName,
        customerPassword: customerData.password,
        DOB: customerData.DOB,
        gender: customerData.gender,
        wtsupNum: customerData.wtsupNum,
        notes: customerData.notes,
        tags: customerData.tags,
      };
      console.log(body);
      ErrorHandler.onLoading();
      const response = await axios.post(url, body, { headers });
      if (response.status === 200) {
        navigate(-1);
      }
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
          <CustomerForm
            customerData={customerData}
            setCustomerData={setCustomerData}
          />
          <div className="text-end me-3 mt-2">
            <button onClick={onSubmitCustDetails} className="btn btn-success">
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCustomer;
