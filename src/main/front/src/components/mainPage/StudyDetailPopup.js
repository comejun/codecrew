import React, { useEffect, useState } from "react";
import useCustomMove from "../../hooks/useCustomMove";
import { useSelector } from "react-redux";
import useHandleStudyMember from "../../hooks/useHandleStudyMember";
import useHandleStudy from "../../hooks/useHandleStudy";

const StudyDetailPopup = ({ study, setPopup, popup, reRender }) => {
  const { moveToProfilePage, moveToModifyPage, moveToReadPage } = useCustomMove();

  const { handleParticipate, handleParticipateCancel } = useHandleStudyMember();
  const { handleStart, handleDelete } = useHandleStudy();

  // 현재 로그인 된 회원의 이메일 가져오기
  const loginState = useSelector((state) => state.loginSlice);
  const userEmail = loginState.email;

  const [isCurrentUserAMember, setIsCurrentUserAMember] = useState(false);

  useEffect(() => {
    if (popup && study && study.studyMemberList) {
      const isMember = study.studyMemberList.some((member) => member.email === userEmail);
      console.log("set!");
      setIsCurrentUserAMember(isMember);
    }
  }, [study, userEmail, popup]);

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
        title: study.title,
        description: study.content,
        imageUrl: study.thImg,
        link: {
          mobileWebUrl: window.location.href,
          webUrl: window.location.href,
        },
      },
    });
  };

  // 카카오지도 열기
  const openKakaoMap = () => {
    const confirmOpen = window.confirm("카카오지도를 여시겠습니까?");
    if (confirmOpen) {
      const encodedLocation = encodeURIComponent(study.location);
      const kakaoMapUrl = `https://map.kakao.com/?q=${encodedLocation}`;
      window.open(kakaoMapUrl, "_blank");
    }
  };

  // 카카오 공유하기
  useEffect(() => {
    // Kakao SDK 초기화
    if (window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init("a485d66609c6ba8d3f85dd817c4e295d");
    }
  }, []);

  // 연락하기, 공유하기 버튼
  const renderContactAndShareButtons = () => {
    if (!userEmail) {
      // 비로그인시
      return (
        <>
          <button className="btnMediumBlack" onClick={handleShareClick}>
            공유하기
          </button>
        </>
      );
    } else if (userEmail !== study.memberEmail) {
      // 로그인시(생성자 X)
      return (
        <>
          <button
            className="btnSmallPoint"
            onClick={() => {
              if (study.memberPhone) {
                window.location.href = `tel:${study.memberPhone}`;
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
      );
    }
    return null;
  };

  // 수정, 삭제 버튼
  const renderEditAndDeleteButtons = () => {
    if (userEmail && userEmail === study.memberEmail) {
      return (
        <>
          <button className="btnSmallPoint" onClick={() => moveToModifyPage(study.id)}>
            수정하기
          </button>
          <button
            className="btnSmallBlack"
            onClick={() => {
              handleDelete(study.id, study.memberEmail);
              setPopup(false); // 버튼 클릭 시 바로 팝업을 닫습니다.
            }}
          >
            삭제하기
          </button>
        </>
      );
    }
    return null;
  };

  // 참여인원 텍스트 색상
  const getStudyMemberColor = (study) => {
    const currentMembers = study.studyMemberList ? study.studyMemberList.filter((member) => member.status === "ACCEPT").length : 0;

    if (currentMembers === study.maxPeople) {
      return "#007BFF"; // 정원이 꽉 찼을 때 파란색
    } else {
      return "inherit"; // 기본 색상
    }
  };

  // 참여인원 텍스트 렌더링
  const renderStudyMemberCount = (study) => {
    return (
      <p
        style={{
          color: getStudyMemberColor(study),
        }}
      >
        {(study.studyMemberList ? study.studyMemberList.filter((member) => member.status === "ACCEPT").length : 0) + 1}
        <span>/</span>
        {study.maxPeople + 1}
      </p>
    );
  };

  // 참가하기, 참가취소 버튼
  const participateButtonCheck = () => {
    // 모임 생성자일경우
    if (userEmail === study.memberEmail) {
      const onStudyStartClick = async () => {
        await handleStart(study);
        reRender();
      };

      return (
        <button className="btnLargePoint" onClick={() => onStudyStartClick()}>
          스터디시작
        </button>
      );
    } else if (isCurrentUserAMember && study.studyMemberList.some((member) => member.email === userEmail && member.status === "HOLD")) {
      const onWithdrawClick = async () => {
        await handleParticipateCancel(study.id);
        setPopup(false); // 버튼 클릭 시 바로 팝업을 닫습니다.
        reRender();
      };

      return (
        <button className="btnLargeBlack" onClick={() => onWithdrawClick()}>
          스터디탈퇴
        </button>
      );
    } else if (isCurrentUserAMember && study.studyMemberList.some((member) => member.email === userEmail && member.status === "ACCEPT")) {
      return <button className="btnLargeBlack">참가 확정</button>;
    } else if (isCurrentUserAMember && study.studyMemberList.some((member) => member.email === userEmail && (member.status === "WITHDRAW" || member.status === "DECLINE"))) {
      return <button className="btnLargeBlack">참가 불가</button>;
    } else {
      // 스터디 참가 버튼 클릭 핸들러
      const onParticipateClick = async () => {
        await handleParticipate(study.id);
        setPopup(false); // 버튼 클릭 시 바로 팝업을 닫습니다.
        moveToReadPage(study.id);
        reRender();
      };

      return (
        <button className="btnLargePoint" onClick={() => onParticipateClick()}>
          스터디참가
        </button>
      );
    }
  };

  return (
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
        {/*스터디 이미지*/}
        <div
          className="stPopupImg"
          onClick={() => moveToReadPage(study.id)}
          style={{
            backgroundImage: `url(${study.thImg})`,
            cursor: "pointer",
          }}
        ></div>

        {/*스터디 제목, 주소*/}
        <div className="stPopupTitle">
          {/*스터디 제목*/}
          <h3 onClick={() => moveToReadPage(study.id)} style={{ cursor: "pointer" }}>
            {study.title}
          </h3>
          {/*스터디 주소*/}
          <p onClick={() => openKakaoMap} style={{ cursor: "pointer" }}>
            {study.location}
          </p>
        </div>

        {/*수정 삭제, 연락하기 공유하기 버튼*/}
        <div className="stPopupBtn">
          {renderContactAndShareButtons()}
          {renderEditAndDeleteButtons()}
        </div>
      </div>

      <div className="stPopupContentBottom">
        <div>
          <h4>작성자 : </h4>
          <div>
            <p
              onClick={() => moveToProfilePage(study.memberEmail)}
              style={{
                fontSize: "15px",
                color: "#000",
                fontWeight: "600",
              }}
            >
              {study.memberNickname}
            </p>
            <p onClick={() => (window.location.href = `mailto:${study.memberEmail}`)}>{study.memberEmail}</p>
          </div>
        </div>
        <div>
          <h4>참여일자 : </h4>
          <p>{study.studyDate}</p>
        </div>
        <div>
          <h4>참여확정 : </h4>
          {renderStudyMemberCount(study)}
        </div>
      </div>

      <div className="stPopupContentButton">{participateButtonCheck()}</div>
    </div>
  );
};
export default StudyDetailPopup;
