import React, { useState } from "react";
import "../../scss/partials/StudyMemberBlock.scss";
import useCustomMove from "../../hooks/useCustomMove";
import useMemberProfile from "../../hooks/useMemberProfile";
import useHandleStudyMember from "../../hooks/useHandleStudyMember";

// StudyMemberBlock 컴포넌트 정의
const StudyMemberBlock = ({ memberData, currentUserEmail, studyCreatorEmail, studyId, reRender, studyConfirmed }) => {
  // 멤버 프로필 정보와 이미지 URL을 가져오는 커스텀 훅 사용
  const { member, imgSrc } = useMemberProfile(memberData.email);
  // 페이지 이동 관련 커스텀 훅 사용
  const { moveToProfilePage } = useCustomMove();

  // 스터디 참가 수락,거절 처리를 위한 커스텀 훅 사용
  const { handleJoinDecline, handleJoinAccept } = useHandleStudyMember();

  // 수락 버튼 클릭 핸들러
  const onAcceptClick = async () => {
    await handleJoinAccept(studyId, member.email);
    reRender();
  };
  // 거절 버튼 클릭 핸들러
  const onDeclineClick = async () => {
    await handleJoinDecline(studyId, member.email);
    reRender();
  };

  // 버튼 렌더링 함수
  const renderButtonCheck = () => {
    console.log(memberData.status);
    if (memberData.status === "HOLD") {
      if (currentUserEmail === studyCreatorEmail) {
        return renderSelectButton();
      } else {
        return renderHoldButton();
      }
    } else if (memberData.status === "ACCEPT") {
      if (!studyConfirmed) {
        return renderAcceptedButton();
      } else {
        return renderAcceptedStartButton();
      }
    } else if (memberData.status === "DECLINE") {
      return renderDeclinedButton();
    } else if (memberData.status === "WITHDRAW") {
      return renderWithdrawnButton();
    } else if (memberData.status === "ARRIVE") {
      return renderArriveButton();
    }
  };

  // 수락, 거절 버튼 렌더링 함수
  const renderSelectButton = () => {
    return (
      <>
        <button className="btnSmallPoint" onClick={onAcceptClick}>
          수락하기
        </button>
        <button className="btnSmallBlack" onClick={onDeclineClick}>
          거절하기
        </button>
      </>
    );
  };

  const renderAcceptedButton = () => {
    return (
      <>
        <button className="btnSmallGrey" style={{ marginTop: "16px", cursor: "default" }}>
          참가완료
        </button>
      </>
    );
  };

  const renderAcceptedStartButton = () => {
    return (
      <>
        <button className="btnSmallGrey" style={{ marginTop: "16px", cursor: "default" }}>
          도착예정
        </button>
      </>
    );
  };

  const renderDeclinedButton = () => {
    return (
      <>
        <button className="btnSmallBlack" style={{ marginTop: "16px", cursor: "default" }}>
          거절
        </button>
      </>
    );
  };
  const renderWithdrawnButton = () => {
    return (
      <>
        <button className="btnSmallBlack" style={{ marginTop: "16px", cursor: "default" }}>
          탈퇴
        </button>
      </>
    );
  };

  const renderArriveButton = () => {
    return (
      <>
        <button className="btnSmallPoint" style={{ marginTop: "16px", cursor: "default" }}>
          출석완료
        </button>
      </>
    );
  };

  const renderHoldButton = () => {
    return (
      <button className="btnSmallPoint" style={{ marginTop: "16px", cursor: "default" }}>
        참가대기
      </button>
    );
  };

  // 컴포넌트 렌더링
  return (
    <div className="studyMemberBlockWrap">
      <div className="studyMemberBlockImg" style={imgSrc ? { backgroundImage: `url(${imgSrc})` } : null} onClick={() => moveToProfilePage(member.email)}></div>
      <div className="studyMemberBlockTitle">
        <h3 onClick={() => moveToProfilePage(member.email)}>{member.nickname}</h3>
        <p onClick={() => (window.location.href = `mailto:${member.email}`)}>{member.email}</p>
      </div>
      <div className="studyMemberBlockBtn">{renderButtonCheck()}</div>
    </div>
  );
};

export default StudyMemberBlock;
