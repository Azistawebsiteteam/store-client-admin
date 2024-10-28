import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Typography,
  useMediaQuery,
} from '@mui/material';

import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import axios from 'axios';
import Cookies from 'js-cookie';

import ErrorHandler from './ErrorHandler';

import { useNavigate } from 'react-router-dom';
import AdminSideBar from './AdminSideBar';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showError, setShowError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const baseUrl = process.env.REACT_APP_API_URL;
  const adminTokenKey = process.env.REACT_APP_ADMIN_JWT_TOKEN;
  let token = Cookies.get(adminTokenKey);

  const isMobile = useMediaQuery('(max-width: 600px)');

  const onChangeValue = (e) => {
    setInputs({ ...inputs, [e.target.id]: e.target.value });
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const onChangePassword = async (e) => {
    e.preventDefault();
    try {
      const { newPassword, confirmPassword, currentPassword } = inputs;

      if (newPassword !== confirmPassword) {
        setShowError(true);
        setErrorMsg("Password didn't match");
        alert("Password didn't match");
        return;
      }
      ErrorHandler.onLoading();
      const url = `${baseUrl}/adminauth/reset-password`;
      const body = {
        currentPassword,
        newPassword,
      };
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-type': `application/json`,
      };
      const response = await axios.post(url, body, { headers });
      const { jwtToken } = response.data;
      Cookies.set(adminTokenKey, jwtToken);
      ErrorHandler.onLoadingClose();
      navigate('/');
    } catch (err) {
      console.error(err);
      ErrorHandler.onLoadingClose();
      setShowError(true);
      const errorMessage = err.response
        ? err.response.data.message
          ? err.response.data.message
          : err.response.statusText
        : 'opps something went wrong';
      setErrorMsg(errorMessage);
    }
  };

  return (
    <div className='adminSec'>
      <AdminSideBar />
      <div className='commonSec'>
        <div className='reset-password-container'>
          <div className={`${isMobile ? 'w-100' : 'w-50'} mt-5`}>
            <Box component='form' onSubmit={onChangePassword}>
              <FormControl
                fullWidth
                required
                sx={{ my: 2 }}
                variant='outlined'
                autoComplete='email'>
                <InputLabel htmlFor='currentPassword'>
                  currentPassword
                </InputLabel>
                <OutlinedInput
                  id='currentPassword'
                  label='CurrentPassword'
                  required
                  value={inputs.currentPassword}
                  onChange={onChangeValue}
                  autoComplete='false'
                  inputProps={{
                    minLength: 5, // Minimum length allowed
                    maxLength: 16, // Maximum length allowed
                  }}
                  autoFocus
                />
              </FormControl>
              <FormControl fullWidth sx={{ my: 2 }} variant='outlined'>
                <InputLabel htmlFor='newPassword'>NewPassword</InputLabel>
                <OutlinedInput
                  id='newPassword'
                  type={showPassword ? 'text' : 'password'}
                  label='Password'
                  value={inputs.newPassword}
                  required
                  onChange={onChangeValue}
                  autoComplete='false'
                  inputProps={{
                    minLength: 8, // Minimum length allowed
                    maxLength: 16, // Maximum length allowed
                  }}
                  endAdornment={
                    <InputAdornment position='end'>
                      <IconButton
                        aria-label='toggle password visibility'
                        onClick={handleClickShowPassword}
                        edge='end'>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>
              <FormControl fullWidth sx={{ my: 2 }} variant='outlined'>
                <InputLabel htmlFor='outlined-adornment-password'>
                  ConfirmPassword
                </InputLabel>
                <OutlinedInput
                  id='confirmPassword'
                  type='password'
                  label='ConfirmPassword'
                  value={inputs.confirmPassword}
                  required
                  onChange={onChangeValue}
                  autoComplete='false'
                  inputProps={{
                    minLength: 8, // Minimum length allowed
                    maxLength: 16, // Maximum length allowed
                  }}
                />
              </FormControl>

              <Button type='submit' fullWidth variant='contained'>
                Submit
              </Button>
              <p className='mt-3 text-danger fs-5'>
                {showError ? `* ${errorMsg}` : ''}
              </p>
              <Typography
                variant='body2'
                color='text.secondary'
                align='center'
                sx={{ mt: 2, mb: 4 }}>
                {'Copyright © '}
                <a target='__blanck' href='https://www.azistaindustries.com/'>
                  Azista Industries Pvt Ltd.
                </a>{' '}
                {new Date().getFullYear()}
                {'.'}
              </Typography>
            </Box>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
