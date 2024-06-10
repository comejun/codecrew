import React, { useState } from "react";
import "../../scss/partials/StudyBlock.scss";
const StudyBlockMy = ({ study }) => {
  return (
    // 이동 추가
    <div className="studyBlockWrap">
      <div className="studyBlockImg"></div>
      <div className="studyBlockTitle">
        <h3>{study.title}</h3>
        <p>{study.location}</p>
      </div>
      <div className="studyBlockBtn">
        <button className="btnMediumPoint">상세보기</button>
      </div>
    </div>
  );
};
export default StudyBlockMy;
