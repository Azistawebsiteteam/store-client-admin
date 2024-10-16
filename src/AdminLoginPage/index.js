import axios from "axios";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { IoMdEye } from "react-icons/io";
import { IoIosEyeOff } from "react-icons/io";
import "./index.css";

const AdminLoginPage = () => {
  const [inputValues, setInputValues] = useState({
    userName: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [hidePassword, setHidePassword] = useState(true);

  const navigate = useNavigate();
  const baseUrl = process.env.REACT_APP_API_URL;
  const jwt_token = process.env.REACT_APP_ADMIN_JWT_TOKEN;

  useEffect(() => {
    const jwt = Cookies.get(jwt_token);
    if (jwt) {
      navigate("/");
    }
  });

  const handleOnChangeInput = (e) => {
    setInputValues({
      ...inputValues,
      [e.target.id]: e.target.value,
    });
    setError("");
  };

  const onSubmitSuccess = (userDetails, jwtToken) => {
    localStorage.setItem("adminDetails", JSON.stringify(userDetails));
    Cookies.set(jwt_token, jwtToken);
    window.location.replace("/");
  };

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
      let errorMessage = "";
      if (error.response) {
        if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        } else {
          errorMessage = "Internal Server Error";
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      setError(errorMessage);
    }
  };

  return (
    <div className="adminLoginPage">
      <h1>Admin Login</h1>
      <form onSubmit={handleLoginSubmit}>
        <div className="form-group">
          <label htmlFor="username">UserID</label>
          <input
            type="text"
            className="form-control"
            id="userName"
            value={inputValues.username}
            onChange={handleOnChangeInput}
            placeholder="UserID"
          />
        </div>
        <div className="form-group passwordField">
          <label htmlFor="password">Password</label>
          <input
            type={hidePassword ? "password" : "text"}
            autoComplete="off"
            className="form-control passwordInput"
            id="password"
            placeholder="Password"
            value={inputValues.password}
            onChange={handleOnChangeInput}
          />
          <div
            className="hideIcon"
            onClick={(e) => setHidePassword(!hidePassword)}
          >
            {hidePassword ? <IoMdEye /> : <IoIosEyeOff />}
          </div>
        </div>
        <span className="d-block text-danger">{error}</span>
        <input className="mt-3" type="submit" value="Submit" />
      </form>
    </div>
  );
};

export default AdminLoginPage;
