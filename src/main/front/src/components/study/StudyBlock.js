import React from "react";
import "../../scss/partials/StudyBlock.scss";
const StudyBlock = ({ studyLocation }) => {
  return (
    // 이동 추가
    <div className="studyBlockWrap">
      <div className="studyBlockImg"></div>
      <div className="studyBlockTitle">
        <h3>{studyLocation.title}</h3>
        <p>{studyLocation.location}</p>
      </div>
      <div className="studyBlockBtn">
        <button className="btnMediumPoint">스터디참가</button>
      </div>
    </div>
  );
};
export default StudyBlock;
