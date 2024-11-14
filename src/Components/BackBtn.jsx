import React from "react";
import { useNavigate } from "react-router-dom";
import { TiArrowLeft } from "react-icons/ti";

const BackBtn = () => {
  const navigate = useNavigate();
  return (
    <div>
      <TiArrowLeft
        style={{ fontSize: "30px", cursor: "pointer", marginRight: "4px" }}
        onClick={() => navigate(-1)}
      />
    </div>
  );
};

export default BackBtn;
