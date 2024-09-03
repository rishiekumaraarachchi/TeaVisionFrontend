import React, { useContext, useState } from "react";
import "../Style/Header.css";
import { Link, useNavigate } from "react-router-dom";
import teaLogo from "../Assets/Images/tea.jpg"; // Make sure the path to the image is correct

function Header() {
  const navigate = useNavigate();

  const ToHome = () => {
    navigate("/");
  };

  return (
    <div className="header-wrapper">
      <div
        className="header-left"
        onClick={ToHome}
        style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
      >
        <span style={{ color: "green" }}>Tea</span>Vision
        <img src={teaLogo} alt="Tea Logo" style={{ marginLeft: "10px", width: "30px", height: "30px" }} />
      </div>
      <div className="header-right">
        <div className="menu">
          <Link to='/category' className="menu-items">
            Category
          </Link>
          <Link to='/fiber' className="menu-items">
            Fiber
          </Link>
          <Link to='/strock' className="menu-items">
            Strocks
          </Link>
          <Link to='/report' className="menu-items">
            Report
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Header;
