import React from "react";
import LHeader from "./components/Lheader";
import LContent from "./components/LContent";
import Price from "./components/price";

const Pricing = () => {
  return (
    <div style={{ overflowY: "auto", height: "100vh" }}>
      <LHeader></LHeader>
      <Price></Price>
    </div>
  );
};

export default Pricing;
