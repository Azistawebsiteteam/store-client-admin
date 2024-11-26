import React from "react";
import { useNavigate } from "react-router-dom";
import { TiArrowLeft } from "react-icons/ti";

const BackBtn = () => {
  const navigate = useNavigate();
  return (
    <div className="backArrow">
      <TiArrowLeft
        style={{ fontSize: "26px", cursor: "pointer" }}
        onClick={() => navigate(-1)}
      />
    </div>
  );
};

export default BackBtn;
