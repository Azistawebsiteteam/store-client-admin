import React, { useState } from "react";
import Cookies from "js-cookie";
import CustomerForm from "./CustomerForm";
import AdminSideBar from "../Pages/AdminSideBar";
import axios from "axios";
import ErrorHandler from "../Pages/ErrorHandler";
import { useNavigate } from "react-router-dom";

const AddCustomer = () => {
  const [customerData, setCustomerData] = useState({
    customerEmail: "",
    customerFirstName: "",
    customerLastName: "",
    password: "",
    DOB: "",
    gender: "",
    customerMobileNum: "",
    wtsupNum: "",
    notes: "",
    tags: "",
  });
  const [permissions, setPermissions] = useState({
    sameForWhatsapp: true,
    smsMarketing: false,
    emailMarketing: false,
  });

  const [errors, setErrors] = useState({});

  const baseUrl = process.env.REACT_APP_API_URL;
  const token = Cookies.get(process.env.REACT_APP_ADMIN_JWT_TOKEN);

  const navigate = useNavigate();

  const handleValidationError = (customerData) => {
    const validationError = {};
    if (!customerData.customerMobileNum.trim()) {
      validationError.customerMobileNum = "Mobile number is required";
    } else if (customerData.customerMobileNum.length < 10) {
      validationError.customerMobileNum =
        "Mobile number should not exceed 10 digits";
    }
    if (!customerData.customerEmail.trim()) {
      validationError.customerEmail = "Email is required";
    }
    if (!customerData.customerFirstName.trim()) {
      validationError.customerFirstName = "First name is required";
    }
    if (!customerData.customerLastName.trim()) {
      validationError.customerLastName = "Last name is required";
    }
    if (!customerData.DOB.trim()) {
      validationError.DOB = "Date of birth is required";
    }
    if (!customerData.gender.trim()) {
      validationError.gender = "Gender is required";
    }
    if (!customerData.wtsupNum.trim()) {
      validationError.wtsupNum = "WhatsApp number is required";
    } else if (customerData.wtsupNum.length < 10) {
      validationError.wtsupNum = "WhatsApp number should not exceed 10 digits";
    }
    return validationError;
  };

  const onSubmitCustDetails = async () => {
    const validationErrorMessage = handleValidationError(customerData);
    if (Object.keys(validationErrorMessage).length > 0) {
      window.scrollTo(0, 0);
      setErrors(validationErrorMessage);
      return;
    }
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
        DOB: customerData.DOB,
        gender: customerData.gender,
        wtsupNum: customerData.wtsupNum,
        notes: customerData.notes,
        tags: customerData.tags,
      };
      if (customerData.password !== "") {
        body.customerPassword = customerData.password;
      }
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
            permissions={permissions}
            setPermissions={setPermissions}
            errors={errors}
            setErrors={setErrors}
          />
          <div className="d-flex justify-content-end mb-5">
            <button onClick={onSubmitCustDetails} className="adminBtn">
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCustomer;
