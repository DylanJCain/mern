import React from "react";
import { FaSignInAlt, FaSignOutAlt, FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";

function header() {
  return (
    <header className="header">
      <div className="logo">
        <Link to="/">GoalSetter</Link>
      </div>
      <ul>
        <li>
          <Link to="/login">
            <FaSignInAlt />
            Login
          </Link>
        </li>
        <li>
          <Link to="/Register">
            <FaUser />
            Register
          </Link>
        </li>
      </ul>
    </header>
  );
}

export default header;
