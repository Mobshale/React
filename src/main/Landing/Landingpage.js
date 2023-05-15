import React from "react";
import LHeader from "./components/Lheader";
import LContent from "./components/LContent";

const App = () => {
  return (
    <div style={{ overflowY: "auto", height: "100vh" }}>
      <LHeader></LHeader>
      <LContent></LContent>
    </div>
  );
};

export default App;
