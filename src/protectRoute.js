// import Cookies from "js-cookie";
// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// export const ProtectedRoute = (props) => {
//   const navigate = useNavigate();
//   const jwt_token = process.env.REACT_APP_ADMIN_JWT_TOKEN;
//   const jwtToken = Cookies.get(jwt_token);

//   useEffect(() => {
//     if (jwtToken === undefined) {
//       return navigate("/adminLoginPage");
//     }
//   }, [jwt_token, jwtToken, navigate]);

//   if (jwtToken === undefined) {
//     return null;
//   }

//   return props.children;
// };

// export default ProtectedRoute;

import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const ProtectedRoute = ({ element: Component }) => {
  const navigate = useNavigate();
  const jwt_token = process.env.REACT_APP_ADMIN_JWT_TOKEN;
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const jwtToken = Cookies.get(jwt_token);

  useEffect(() => {
    if (!jwtToken) {
      navigate('/adminLoginPage');
    } else {
      setIsAuthChecked(true); // Set auth check flag once JWT token is validated
    }
  }, [jwtToken, navigate]);
  if (!isAuthChecked && !jwtToken) {
    // Show loading or nothing until the auth is checked
    return null;
  }
  // Render children (protected component) when authenticated
  return <Component />;
};

export default ProtectedRoute;
