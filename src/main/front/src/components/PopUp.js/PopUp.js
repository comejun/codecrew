import React from "react";
import "../../scss/partials/PopUp.scss";

const PopUp = () => {
  return (
    <>
      <div className="newPopupWrap">
        <div className="newPopupContent">
          <h2>🧑🏻‍💻 스터디 참가</h2>
          <p>스터디에 참가하시겠습니까?</p>
          <div className="newPopupBtnWrap">
            <button className="btnMediumPoint">예</button>
            <button className="btnMediumPointLine">아니오</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PopUp;
