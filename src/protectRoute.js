import Cookies from "js-cookie";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const ProtectedRoute = (props) => {
  const navigate = useNavigate();
  const jwt_token = process.env.REACT_APP_ADMIN_JWT_TOKEN;
  const jwtToken = Cookies.get(jwt_token);

  useEffect(() => {
    if (jwtToken === undefined) {
      return navigate("/adminLoginPage");
    }
  }, [jwt_token, jwtToken, navigate]);

  if (jwtToken === undefined) {
    return null;
  }

  return props.children;
};

export default ProtectedRoute;
