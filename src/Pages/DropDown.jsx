import Cookies from "js-cookie";
import "./Admin.css";

function BasicButtonExample() {
  const adminToken = process.env.REACT_APP_ADMIN_JWT_TOKEN;
  const handleUserLogout = () => {
    window.location.replace("/adminLoginPage");
    Cookies.remove(adminToken);
  };
  return (
    <div className="dropdown-center">
      <button
        className="btn btn-secondary dropdown-toggle"
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        User
      </button>
      <ul className="dropdown-menu customDropDown">
        <li>
          <a className="dropdown-item" href="ManageAccount">
            Manage Accounts
          </a>
        </li>
        <li>
          <a className="dropdown-item" href="#/action-2">
            User Activities
          </a>
        </li>
        <li>
          <a
            className="dropdown-item"
            onClick={handleUserLogout}
            href="/adminLoginPage"
          >
            Logout
          </a>
        </li>
      </ul>
    </div>
  );
}

export default BasicButtonExample;
