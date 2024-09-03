import React from "react";
import { useNavigate } from "react-router-dom";
import "../Style/HeroCss.css";
import teaLogo from "../Assets/Images/tea.gif"; // Make sure the path to the image is correct

function HeroPage() {
  const navigate = useNavigate();

  const handleCategoryClick = () => {
    navigate("/category");
  };
  const handleFiberClick = () => {
    navigate("/fiber");
  };
  const handleStrockClick = () => {
    navigate("/Strock");
  };

  const handleReportClick = () => {
    navigate("/report");
  };

  return (
    <div className="hero-section">
      <div className="hero-left">
        <div className="left-container">
          <div className="hero-header">
            Welcome to
            <br />{" "}
            <span style={{ fontSize: "4.5rem" }}>
              <span style={{ color: "green" }}>Tea</span>Vision
            </span>
          </div>
          <div className="hero-subheading">
            Analyze Tea Quality and Tea Variant Instantly
          </div>
          <div className="hero-subheading2">
          Upload your tea images, and we'll provide you with quality and variation analysis in seconds.
          </div>
          <div className="button-container">
  <div
    className="hero-button"
    onClick={handleCategoryClick}
    style={{ width: "150px", height: "50px", fontSize: "18px", padding: "10px" }}
  >
    Find Category
  </div>
  <div
    className="hero-button"
    onClick={handleFiberClick}
    style={{ width: "150px", height: "50px", fontSize: "18px", padding: "10px" }}
  >
    Fiber Analysis
  </div>
  <div
    className="hero-button"
    onClick={handleStrockClick}
    style={{ width: "150px", height: "50px", fontSize: "18px", padding: "10px" }}
  >
    Strocks Analysis
  </div>
  <div
    className="hero-button"
    onClick={handleReportClick}
    style={{ width: "150px", height: "50px", fontSize: "18px", padding: "10px" }}
  >
    Genarate Report
  </div>
</div>
</div>
      </div>
      <div className="hero-right"></div> 
    </div>
  );
}

export default HeroPage;
