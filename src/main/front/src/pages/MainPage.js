import React, { useEffect, useState } from "react";
import BasicLayout from "../layouts/BasicLayoutMain";
import "../scss/pages/mainPage.scss";
import KakaoMap from "../components/map/KakaoMap";
import { useSelector } from "react-redux";
import useCustomMove from "../hooks/useCustomMove";
import NewStudyPopup from "../components/mainPage/NewStudyPopup";
import StudyDetailPopup from "../components/mainPage/StudyDetailPopup";
import CoMarkPopup from "../components/mainPage/CoMarkPopup";
import { getNoticeCount } from "../api/noticeAPI";

const MainPage = () => {
  // 현재 로그인 된 회원의 이메일 가져오기
  const loginState = useSelector((state) => state.loginSlice);
  // 페이지 이동을 위한 함수들
  const { moveToLogin, moveToMypage, moveToAddPage } = useCustomMove();
  const [refresh, setRefresh] = useState(false);
  const reRender = () => {
    setRefresh(!refresh);
  };

  const [overlayState, setOverlayState] = useState({
    overlayState: false,
    lat: 0,
    lng: 0,
  });

  const changeOverlayState = (lat, lng, check) => {
    setOverlayState({
      overlayState: check,
      lat: lat,
      lng: lng,
    });
  };

  // my 아이콘 클릭시 로그인 여부에 따라 마이페이지로 이동
  const handleLogin = (moveFunction) => {
    if (!loginState.email) {
      moveToLogin();
    } else {
      moveFunction();
    }
  };

  const [popup, setPopup] = useState(false);
  const [study, setStudy] = useState();

  const [noticeCount, setNoticeCount] = useState(0);

  useEffect(() => {
    // 서버에서 알림 갯수 가져오기
    if (loginState.email) {
      getNoticeCount(loginState.email).then((data) => {
        console.log("알림 갯수", data);
        setNoticeCount(data);
      });
    }
  }, [noticeCount, loginState]);

  const renderNoticeCount = () => {
    if (noticeCount > 0) {
      return (
        <div className="MyNoticeCount">
          <span>{noticeCount}</span>
        </div>
      );
    }
  };

  //popupData -> study로 명칭 변경
  const changePopup = (data) => {
    setStudy(data);
    setPopup(true);
  };

  return (
    <BasicLayout className="MainPageSet">
      <KakaoMap
        overlayState={overlayState}
        changeOverlayState={changeOverlayState}
        changePopup={changePopup}
        refresh={refresh}
      />

      <div className="bottomMainBtnWrap">
        <div className="mainBtnWrap">
          <button
            className="btnLargePoint"
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
            {renderNoticeCount()}
          </button>
        </div>
        {/* 코치마크 팝업 */}
        <CoMarkPopup />

        {/* 스터디 상세 정보 토스트팝업 */}
        {popup ? (
          <StudyDetailPopup
            study={study}
            popup={popup}
            setPopup={setPopup}
            reRender={reRender}
          />
        ) : (
          <></>
        )}
        {/* 지도 클릭 해서 스터디 추가 토스트팝업 */}
        {overlayState.overlayState ? (
          <NewStudyPopup
            overlayState={overlayState}
            changeOverlayState={changeOverlayState}
          />
        ) : (
          <></>
        )}
        <div className="stPopupWrap"></div>
      </div>
    </BasicLayout>
  );
};
export default MainPage;
