import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

import logo from '../images/azista_logo.svg';

import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';

import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import './index.css';
import Swal from 'sweetalert2';

const AdminLoginPage = () => {
  const [inputValues, setInputValues] = useState({
    userName: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [hidePassword, setHidePassword] = useState(true);

  const navigate = useNavigate();
  const baseUrl = process.env.REACT_APP_API_URL;
  const jwt_token = process.env.REACT_APP_ADMIN_JWT_TOKEN;

  // Check if JWT token is already present and navigate to home if logged in
  useEffect(() => {
    const jwt = Cookies.get(jwt_token);
    if (jwt) {
      navigate('/');
    }
  }, [jwt_token, navigate]);

  // Handle input change
  const handleOnChangeInput = (e) => {
    setInputValues({
      ...inputValues,
      [e.target.id]: e.target.value,
    });
    setError(''); // Clear error message when user types
  };

  // On successful login, store the JWT and admin details
  const onSubmitSuccess = (userDetails, jwtToken) => {
    localStorage.setItem('adminDetails', JSON.stringify(userDetails));
    Cookies.set(jwt_token, jwtToken, { expires: 365 });
    Swal.fire({
      icon: 'success',
      title: 'Please Wait Redirecting to Dashboard ...',
      showConfirmButton: false,
      timer: 3000,
    });
    window.location.replace('/');
  };

  // Handle form submission
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = `${baseUrl}/adminauth/login`;
      const response = await axios.post(url, inputValues);

      if (response.status === 200) {
        const { admin_details, jwtToken } = response.data;
        onSubmitSuccess(admin_details, jwtToken);
      }
    } catch (error) {
      let errorMessage = 'Internal Server Error';
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      setError(errorMessage);
    }
  };

  const defaultTheme = createTheme();

  return (
    <ThemeProvider theme={defaultTheme}>
      <div className='container'>
        <div className='row'>
          <div className='col-12'>
            <Container component='main' maxWidth='xs'>
              <CssBaseline />
              <Box
                sx={{
                  marginTop: 8,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}>
                <Box className='mt-2'>
                  <img
                    alt='logo'
                    src={logo}
                    style={{ width: 80, margin: '3px' }}
                  />
                </Box>
                <Box component='form' onSubmit={handleLoginSubmit}>
                  <FormControl
                    fullWidth
                    required
                    sx={{ my: 2 }}
                    variant='outlined'
                    autoComplete='email'>
                    <InputLabel htmlFor='userName'>Username</InputLabel>
                    <OutlinedInput
                      id='userName'
                      label='Username'
                      required
                      value={inputValues.userName}
                      onChange={handleOnChangeInput}
                      autoComplete='email'
                      inputProps={{
                        minLength: 3, // Minimum length allowed
                        maxLength: 20, // Maximum length allowed
                      }}
                      autoFocus
                    />
                  </FormControl>
                  <FormControl fullWidth sx={{ my: 2 }} variant='outlined'>
                    <InputLabel htmlFor='password'>Password</InputLabel>
                    <OutlinedInput
                      id='password'
                      type={hidePassword ? 'password' : 'text'}
                      label='Password'
                      value={inputValues.password}
                      required
                      onChange={handleOnChangeInput}
                      inputProps={{
                        minLength: 5, // Minimum length allowed
                        maxLength: 16, // Maximum length allowed
                      }}
                      endAdornment={
                        <InputAdornment position='end'>
                          <IconButton
                            aria-label='toggle password visibility'
                            onClick={() => setHidePassword(!hidePassword)}
                            edge='end'>
                            {hidePassword ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  </FormControl>

                  {error && <Typography color='error'>{error}</Typography>}

                  <Button type='submit' fullWidth variant='contained'>
                    Sign In
                  </Button>
                </Box>
              </Box>
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
            </Container>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default AdminLoginPage;
