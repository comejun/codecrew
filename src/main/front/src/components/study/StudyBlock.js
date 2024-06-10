import React from "react";
import "../../scss/partials/StudyBlock.scss";
import { API_SERVER_HOST } from "../../api/memberAPI";
import useCustomMove from "../../hooks/useCustomMove";
import { useSelector } from "react-redux";
import useHandleStudyMember from "../../hooks/useHandleStudyMember";
import useHandleStudy from "../../hooks/useHandleStudy";

// StudyBlock 컴포넌트 정의
const StudyBlock = ({ studyLocation }) => {
  // API 서버 호스트 주소 가져오기
  const host = API_SERVER_HOST;
  // 페이지 이동 관련 커스텀 훅 사용
  const { moveToReadPage } = useCustomMove();
  // 로그인 상태 가져오기
  const loginState = useSelector((state) => state.loginSlice);

  // 현재 로그인한 사용자의 이메일 가져오기
  const userEmail = loginState.email;
  // 스터디 위치 정보에서 스터디 생성자의 이메일 가져오기
  const studyUserEmail = studyLocation.memberEmail;

  // 스터디 참가 처리를 위한 커스텀 훅 사용
  const { handleParticipate } = useHandleStudyMember();

  // 스터디 시작 처리를 위한 커스텀 훅 사용
  const handleStart = useHandleStudy();

  // 이미지 URL 생성 함수
  const getImageUrl = () => {
    return studyLocation.thImg.startsWith("http:")
      ? studyLocation.thImg
      : `${host}/api/image/view/${studyLocation.thImg}`;
  };

  // 카카오 맵 URL 생성 함수
  const getKakaoMapUrl = () => {
    const encodedLocation = encodeURIComponent(studyLocation.location);
    return `https://map.kakao.com/?q=${encodedLocation}`;
  };

  // 버튼 렌더링 함수
  const renderButton = () => {
    if (!userEmail || userEmail !== studyUserEmail) {
      return (
        <button
          className="btnMediumPoint"
          onClick={() => handleParticipate(studyLocation.id)}
        >
          스터디참가
        </button>
      );
    } else {
      return (
        <button
          className="btnMediumPoint"
          onClick={() => handleStart(studyLocation.id)}
        >
          스터디시작
        </button>
      );
    }
  };

  // 컴포넌트 렌더링
  return (
    <div className="studyBlockWrap">
      <div
        className="studyBlockImg"
        style={{
          cursor: "pointer", // 커서 스타일 추가
          backgroundImage: `url(${getImageUrl()})`,
        }}
      ></div>

      <div className="studyBlockTitle" style={{ cursor: "pointer" }}>
        <h3 onClick={() => moveToReadPage(studyLocation.id)}>
          {studyLocation.title}
        </h3>
        <p
          onClick={() => {
            const confirmOpen = window.confirm("카카오지도를 여시겠습니까?");
            if (confirmOpen) {
              window.open(getKakaoMapUrl(), "_blank");
            }
          }}
          style={{ cursor: "pointer" }}
        >
          {studyLocation.location}
        </p>
      </div>
      <div className="studyBlockBtn">{renderButton()}</div>
    </div>
  );
};

export default StudyBlock;
