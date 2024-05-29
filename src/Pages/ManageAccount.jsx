import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import AdminSideBar from "./AdminSideBar";

const ManageAccount = () => {
  const baseUrl = process.env.REACT_APP_API_URL;
  const adminToken = process.env.REACT_APP_ADMIN_JWT_TOKEN;
  let token = Cookies.get(adminToken);

  const [inputValues, setInputValue] = useState({
    fullName: "",
    email: "",
    mobileNumber: "",
    profilePic: "",
  });

  const [userCredential, setUserCredential] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const getDetails = async () => {
      try {
        const url = `${baseUrl}/adminauth/get/admin`;
        const headers = {
          Authorization: `Bearer ${token}`,
        };
        const response = await axios.post(url, {}, { headers });
        if (response.status === 200) {
          const userDetails = response.data.admin_details;
          console.log(userDetails.azst_admin_details_profile_photo);
          setInputValue({
            fullName: userDetails.azst_admin_details_fname,
            userName: userDetails.azst_admin_details_admin_id,
            email: userDetails.azst_admin_details_email,
            mobileNumber: userDetails.azst_admin_details_mobile,
            profilePic: userDetails.azst_admin_details_profile_photo,
          });
        }
      } catch (error) {
        console.log(error);
      }
    };
    getDetails();
  }, [baseUrl, token]);

  const handleUserInfo = (e) => {
    const { id, value } = e.target;
    if (id === "profilePic") {
      setInputValue((prevState) => ({
        ...prevState,
        profilePic: e.target.files[0],
      }));
    } else {
      setInputValue((prevState) => ({
        ...prevState,
        [id]: value,
      }));
    }
  };

  const onSaveDetails = async () => {
    try {
      const url = `${baseUrl}/adminauth/update/details`;
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-type": "multipart/form-data",
      };
      const formData = new FormData();

      formData.append("fullName", inputValues.fullName);
      formData.append("email", inputValues.email);
      formData.append("mobileNumber", inputValues.mobileNumber);
      formData.append("profilePic", inputValues.profilePic);

      const response = await axios.post(url, formData, { headers });
      window.location.reload();
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUserCredential = (e) => {
    const { id, value } = e.target;
    setUserCredential({ ...userCredential, [id]: value });
  };

  const onResetPassword = async () => {
    const { newPassword, confirmPassword, currentPassword } = userCredential;
    if (newPassword !== confirmPassword) {
      alert("Password didn't match");
      return;
    }
    try {
      const url = `${baseUrl}/adminauth/reset-password`;
      const body = {
        currentPassword,
        newPassword,
      };
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-type": `application/json`,
      };

      const response = await axios.post(url, body, { headers });
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="adminSec">
      <AdminSideBar />
      <div className="commonSec">
        <div className="manageAccountSec">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <h5 className="mb-4">Manage Account</h5>
              </div>
              <div className="col-md-4">
                <h6>Details</h6>
              </div>
              <div className="col-md-8">
                <div className="bgStyle">
                  {inputValues.profilePic ? (
                    <img
                      className="userProfile"
                      src={inputValues.profilePic}
                      alt="Profile Pic"
                    />
                  ) : (
                    ""
                  )}
                  <input
                    type="file"
                    id="profilePic"
                    onChange={handleUserInfo}
                  />
                  <hr />
                  <div className="row">
                    <div className="col">
                      <label htmlFor="fullName">Full name</label>
                      <input
                        type="text"
                        className="form-control"
                        id="fullName"
                        onChange={handleUserInfo}
                        value={inputValues.fullName}
                        placeholder="Full name"
                      />
                    </div>
                    <div className="col">
                      <label htmlFor="userName">User name</label>
                      <input
                        type="text"
                        className="form-control"
                        id="userName"
                        value={inputValues.userName}
                        placeholder="User name"
                        disabled
                      />
                    </div>
                    <p>
                      <strong>Note:</strong> Use your first and last name as
                      they appear on your government-issued ID.
                    </p>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col">
                      <label htmlFor="email">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        onChange={handleUserInfo}
                        id="email"
                        value={inputValues.email}
                        placeholder="Email"
                      />
                    </div>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col">
                      <label htmlFor="mobileNumber">Phone</label>
                      <input
                        type="text"
                        className="form-control"
                        onChange={handleUserInfo}
                        id="mobileNumber"
                        value={inputValues.mobileNumber}
                        placeholder="Contact Number"
                      />
                    </div>
                  </div>
                  <div className="text-end mt-3">
                    <button className="adminBtn" onClick={onSaveDetails}>
                      Save Details
                    </button>
                  </div>
                </div>
              </div>
              <hr className="mt-3 mb-3" />
              <div className="col-md-4">
                <h6>Change your password</h6>
              </div>
              <div className="col-md-8">
                <div className="bgStyle">
                  <div className="col">
                    <label htmlFor="currentPassword">Current password</label>
                    <input
                      type="text"
                      className="form-control"
                      id="currentPassword"
                      onChange={handleUserCredential}
                      value={userCredential.currentPassword}
                    />
                  </div>
                  <div className="col">
                    <label htmlFor="newPassword">New password</label>
                    <input
                      type="text"
                      className="form-control"
                      id="newPassword"
                      onChange={handleUserCredential}
                      value={userCredential.newPassword}
                    />
                  </div>
                  <div className="col">
                    <label htmlFor="confirmPassword">Confirm password</label>
                    <input
                      type="text"
                      className="form-control"
                      id="confirmPassword"
                      onChange={handleUserCredential}
                      value={userCredential.confirmPassword}
                    />
                  </div>
                  <div className="text-end mt-3">
                    <button className="adminBtn" onClick={onResetPassword}>
                      Reset Password
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageAccount;
