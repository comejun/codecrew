import React from "react";
import Header from "./Header";

const BasicLayoutMain = ({ children }) => {
  return (
    <>
      <div className="bodyWrapMain">
        <Header />
        <div className="contentWrap">{children}</div>
      </div>
    </>
  );
};

export default BasicLayoutMain;
