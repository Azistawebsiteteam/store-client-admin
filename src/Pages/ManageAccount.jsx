import axios from 'axios';
import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';
import AdminSideBar from './AdminSideBar';
import ErrorHandler from './ErrorHandler';

const ManageAccount = () => {
  const baseUrl = process.env.REACT_APP_API_URL;
  const adminToken = process.env.REACT_APP_ADMIN_JWT_TOKEN;
  let token = Cookies.get(adminToken);

  const [inputValues, setInputValue] = useState({
    fullName: '',
    email: '',
    mobileNumber: '',
    profilePic: '',
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
          setInputValue({
            fullName: userDetails.azst_admin_details_fname,
            userName: userDetails.azst_admin_details_admin_id,
            email: userDetails.azst_admin_details_email,
            mobileNumber: userDetails.azst_admin_details_mobile,
            profilePic: userDetails.azst_admin_details_profile_photo,
          });
        }
      } catch (error) {
        ErrorHandler.onError(error);
      }
    };
    getDetails();
  }, [baseUrl, token]);

  const handleUserInfo = (e) => {
    const { id, value } = e.target;
    if (id === 'profilePic') {
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
        'Content-type': 'multipart/form-data',
      };
      const formData = new FormData();

      formData.append('fullName', inputValues.fullName);
      formData.append('email', inputValues.email);
      formData.append('mobileNumber', inputValues.mobileNumber);
      formData.append('profilePic', inputValues.profilePic);

      // eslint-disable-next-line no-unused-vars
      const response = await axios.post(url, formData, { headers });
      window.location.reload();
    } catch (error) {
      ErrorHandler.onError(error);
    }
  };

  return (
    <div className='adminSec'>
      <AdminSideBar />
      <div className='commonSec'>
        <div className='manageAccountSec'>
          <div className='container'>
            <div className='row'>
              <div className='col-md-12'>
                <h5 className='mb-4'>Manage Account</h5>
              </div>
              <div className='col-12'>
                <div className='bgStyle'>
                  {inputValues.profilePic ? (
                    <img
                      className='userProfile'
                      src={inputValues.profilePic}
                      alt='Profile Pic'
                    />
                  ) : (
                    ''
                  )}
                  <input
                    type='file'
                    id='profilePic'
                    onChange={handleUserInfo}
                  />
                  <hr />
                  <div className='row'>
                    <div className='col'>
                      <label htmlFor='fullName'>Full name</label>
                      <input
                        type='text'
                        className='form-control'
                        id='fullName'
                        onChange={handleUserInfo}
                        value={inputValues.fullName}
                        placeholder='Full name'
                      />
                    </div>
                    <div className='col'>
                      <label htmlFor='userName'>User name</label>
                      <input
                        type='text'
                        className='form-control'
                        id='userName'
                        value={inputValues.userName}
                        placeholder='User name'
                        disabled
                      />
                    </div>
                    <p>
                      <strong>Note:</strong> Use your first and last name as
                      they appear on your government-issued ID.
                    </p>
                  </div>
                  <hr />
                  <div className='row'>
                    <div className='col'>
                      <label htmlFor='email'>Email</label>
                      <input
                        type='email'
                        className='form-control'
                        onChange={handleUserInfo}
                        id='email'
                        value={inputValues.email}
                        placeholder='Email'
                      />
                    </div>
                  </div>
                  <hr />
                  <div className='row'>
                    <div className='col'>
                      <label htmlFor='mobileNumber'>Phone</label>
                      <input
                        type='text'
                        className='form-control'
                        onChange={handleUserInfo}
                        id='mobileNumber'
                        value={inputValues.mobileNumber}
                        placeholder='Contact Number'
                      />
                    </div>
                  </div>
                  <div className='text-end mt-3'>
                    <button className='adminBtn' onClick={onSaveDetails}>
                      Save Details
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
