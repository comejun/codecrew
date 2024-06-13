import "../../scss/partials/StudyBlock.scss";
import { API_SERVER_HOST } from "../../api/memberAPI";
import React from "react";
import useCustomMove from "../../hooks/useCustomMove";

const StudyBlockMy = ({ study }) => {
  const host = API_SERVER_HOST;
  // 페이지 이동 관련 커스텀 훅 사용
  const { moveToReadPage } = useCustomMove();

  // 이미지 URL 생성 함수
  const getImageUrl = () => {
    return study.thImg.startsWith("http:")
      ? study.thImg
      : `${host}/api/image/view/${study.thImg}`;
  };

  // 카카오 맵 URL 생성 함수
  const getKakaoMapUrl = () => {
    const encodedLocation = encodeURIComponent(study.location);
    return `https://map.kakao.com/?q=${encodedLocation}`;
  };

  return (
    // 이동 추가
    <div className="studyBlockWrap">
      <div
        className="studyBlockImg"
        style={{
          cursor: "pointer", // 커서 스타일 추가
          backgroundImage: `url(${getImageUrl()})`,
        }}
      ></div>
      <div className="studyBlockTitle">
        <h3 onClick={() => moveToReadPage(study.id)}>{study.title}</h3>
        <p
          onClick={() => {
            const confirmOpen = window.confirm("카카오지도를 여시겠습니까?");
            if (confirmOpen) {
              window.open(getKakaoMapUrl(), "_blank");
            }
          }}
          style={{ cursor: "pointer" }}
        >
          {study.location}
        </p>
      </div>
      <div className="studyBlockBtn">
        <button
          onClick={() => moveToReadPage(study.id)}
          className="btnMediumPoint"
        >
          상세보기
        </button>
      </div>
    </div>
  );
};
export default StudyBlockMy;
