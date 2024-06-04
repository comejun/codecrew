import React, { useState, useEffect } from "react";
import BasicLayout from "../layouts/BasicLayout";
import "../scss/pages/mainPage.scss";
import { API_SERVER_HOST } from "../api/studyAPI";
import FinalKakaoMap from "../components/map/finalKakaoMap";
import { useSelector } from "react-redux";
import useCustomMove from "../hooks/useCustomMove";
import axios from "axios";

const host = API_SERVER_HOST;

const MainPage = () => {
  // 현재 로그인 된 회원의 이메일 가져오기
  const loginState = useSelector((state) => state.loginSlice);
  // 페이지 이동을 위한 함수들
  const { moveToLogin, moveToMypage, moveToAddPage, moveToModifyPage, moveToReadPage } = useCustomMove();

  // my 아이콘 클릭시 로그인 여부에 따라 마이페이지로 이동
  const handleLogin = (moveFunction) => {
    if (!loginState.email) {
      moveToLogin();
    } else {
      moveFunction();
    }
  };

  // 토스트팝업 상태
  const popupInit = {
    id: "",
    thImg: "",
    title: "프로젝트 모임",
    location: "서울 서대문구 신촌로 83",
    memberNickname: "김유저",
    memberEmail: "dbghtjs112@naver.com",
    memberPhone: "",
    studyDate: "2024.05.22",
    maxPeople: "1/10",
  };
  const [popup, setPopup] = useState(false);
  const [popupData, setPopupData] = useState(popupInit);
  const changePopup = (data) => {
    setPopupData(data);
    setPopup(true);
  };
  // 확인후 삭제
  useEffect(() => {
    console.log("popup:", popup);
    console.log("popupData:", popupData);
  }, [popup, popupData]);
  // 확인후 삭제

  // 본인 작성글 체크용
  const userEmail = loginState.email;
  const studyUserEmail = popupData.memberEmail;

  // 카카오 공유하기
  useEffect(() => {
    // Kakao SDK 초기화
    if (window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init("a485d66609c6ba8d3f85dd817c4e295d");
    }
  }, []);

  // 공유하기 버튼
  const handleShareClick = () => {
    window.Kakao.Link.sendDefault({
      objectType: "feed",
      content: {
        title: popupData.title,
        description: popupData.content,
        imageUrl: popupData.thImg,
        link: {
          mobileWebUrl: window.location.href,
          webUrl: window.location.href,
        },
      },
    });
  };

  // handleParticipate 참가하기 구현
  const handleParticipate = async () => {
    if (userEmail) {
      try {
        // 백엔드 서버에 참가 요청을 보냄
        const response = await axios.post(`${host}/api/study/${popupData.id}/participate`, {
          email: userEmail,
        });
        // 성공적으로 참가 처리되었을 때의 로직
        console.log(response.data);
        alert("스터디 참가신청이 완료되었습니다.");
      } catch (error) {
        // 에러 처리 로직
        console.error(error);
      }
    } else {
      moveToLogin();
    }
  };

  return (
    <BasicLayout className="MainPageSet">
      {/*<div id="map" className="Map"></div>*/}
      {/*<NewKakaoMap />*/}
      <FinalKakaoMap changePopup={changePopup} popupInit={popupInit} />

      <div className="bottomMainBtnWrap">
        <div className="mainBtnWrap">
          <button
            onClick={() => {
              handleLogin(moveToAddPage);
            }}
          >
            스터디추가
          </button>
          <button
            onClick={() => {
              handleLogin(moveToMypage);
            }}
          >
            MY
          </button>
        </div>

        {/* 토스트팝업 */}
        {/* popupActive <- 클래스 추가시 팝업 노출 */}
        {popup ? (
          <div className="stPopupWrap popupActive">
            {/* 닫기버튼 */}
            <img
              className="stPopupClose"
              onClick={() => {
                setPopup(false);
              }}
              src="/assets/imgs/icon/ic_popup_cl.svg"
              alt="닫기버튼"
            />
            {/* 컨텐츠 */}
            <div className="stPopupContentTop">
              <div className="stPopupImg" onClick={() => moveToReadPage(popupData.id)} style={{ backgroundImage: `url(${popupData.thImg})`, cursor: "pointer" }}></div>
              <div className="stPopupTitle">
                <h3 onClick={() => moveToReadPage(popupData.id)} style={{ cursor: "pointer" }}>
                  {popupData.title}
                </h3>
                <p
                  onClick={() => {
                    const confirmOpen = window.confirm("카카오지도를 여시겠습니까?");
                    if (confirmOpen) {
                      const encodedLocation = encodeURIComponent(popupData.location);
                      const kakaoMapUrl = `https://map.kakao.com/?q=${encodedLocation}`;
                      window.open(kakaoMapUrl, "_blank");
                    }
                  }}
                  style={{ cursor: "pointer" }}
                >
                  {popupData.location}
                </p>
              </div>
              <div className="stPopupBtn">
                {!userEmail || userEmail !== studyUserEmail ? (
                  <>
                    <button
                      className="btnSmallPoint"
                      onClick={() => {
                        if (popupData.memberPhone) {
                          window.location.href = `tel:${popupData.memberPhone}`;
                        } else {
                          alert("크루가 연락처를 공개하지 않았습니다.");
                        }
                      }}
                    >
                      연락하기
                    </button>

                    <button className="btnSmallBlack" onClick={handleShareClick}>
                      공유하기
                    </button>
                  </>
                ) : (
                  <>
                    <button className="btnSmallPoint" onClick={() => moveToModifyPage(popupData.id)}>
                      수정하기
                    </button>
                    <button className="btnSmallBlack">삭제하기</button>
                  </>
                )}
              </div>
            </div>
            <div className="stPopupContentBottom">
              <div>
                <h4>작성자 : </h4>
                <div>
                  <p>{popupData.memberNickname}</p>
                  <p className="contentEmail">{popupData.memberEmail}</p>
                </div>
              </div>
              <div>
                <h4>참여일자 : </h4>
                <p>{popupData.studyDate}</p>
              </div>
              <div>
                <h4>참여인원 : </h4>
                <p>
                  {(popupData.studyMemberList ? popupData.studyMemberList.length : 0) + 1}
                  <span>/</span>
                  {popupData.maxPeople}
                </p>
              </div>
            </div>
            <div className="stPopupContentButton">
              {!userEmail || userEmail !== studyUserEmail ? (
                <button className="btnLargePoint" onClick={handleParticipate}>
                  스터디참가
                </button>
              ) : (
                <button className="btnLargePoint">스터디시작</button>
              )}
            </div>
          </div>
        ) : (
          <></>
        )}
        <div className="stPopupWrap"></div>
      </div>
    </BasicLayout>
  );
};
export default MainPage;
