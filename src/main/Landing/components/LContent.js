import React from "react";
import stockimage from "../../../img/logo/classvector.png";
import { CheckCircleOutlined } from "@ant-design/icons";
import "antd/dist/antd.css";
import "./lcont.css";
import { Button } from "antd";
import RatingDiv from "./Rating";

const LContent = () => {
  return (
    <div className="lcontent-container">
      <div className="content-wrapper">
        <div className="text-wrapper">
          <h1 className="heading">
            Flames - The virtual classrooms for interactive learning
          </h1>
          <Button
            onClick={() => (window.location.href = "/Login")}
            className="custom-btn btn-14"
          >
            Try Now
          </Button>
          <RatingDiv className="rating"></RatingDiv>
        </div>
        <img className="image" src={stockimage} alt="Stock Image" />
      </div>
    </div>
  );
};

export default LContent;
