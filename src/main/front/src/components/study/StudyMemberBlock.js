import React from "react";
import "../../scss/partials/StudyMemberBlock.scss";
import useCustomMove from "../../hooks/useCustomMove";
import useMemberProfile from "../../hooks/useMemberProfile";
import useHandleStudyMember from "../../hooks/useHandleStudyMember";

// StudyMemberBlock 컴포넌트 정의
const StudyMemberBlock = ({
  email,
  currentUserEmail,
  studyCreatorEmail,
  studyId,
  studyMemberList,
}) => {
  // 멤버 프로필 정보와 이미지 URL을 가져오는 커스텀 훅 사용
  const { member, imgSrc } = useMemberProfile(email);
  // 페이지 이동 관련 커스텀 훅 사용
  const { moveToProfilePage } = useCustomMove();

  // 스터디 참가 수락,거절 처리를 위한 커스텀 훅 사용
  const { handleJoinDecline, handleJoinAccept } = useHandleStudyMember();

  // 현재 멤버의 참가 상태 확인
  const isMemberChecked = studyMemberList.some(
    (memberItem) => memberItem.email === member.email && memberItem.checked,
  );

  // 수락 버튼 클릭 핸들러
  const onAcceptClick = () => {
    handleJoinAccept(studyId, member.email);
  };
  // 거절 버튼 클릭 핸들러
  const onDeclineClick = () => {
    handleJoinDecline(studyId, member.email);
  };

  // 버튼 렌더링 함수
  const renderButton = () => {
    if (currentUserEmail === studyCreatorEmail && !isMemberChecked) {
      return (
        <>
          <button className="btnSmallPoint" onClick={onAcceptClick}>
            수락
          </button>
          <button className="btnSmallBlack" onClick={onDeclineClick}>
            거절
          </button>
        </>
      );
    } else if (isMemberChecked) {
      return (
        <button
          className="btnSmallGrey"
          style={{ marginTop: "16px", cursor: "default" }}
        >
          참가완료
        </button>
      );
    }
    return null;
  };

  // 컴포넌트 렌더링
  return (
    <div className="studyMemberBlockWrap">
      <div
        className="studyMemberBlockImg"
        style={imgSrc ? { backgroundImage: `url(${imgSrc})` } : null}
        onClick={() => moveToProfilePage(member.email)}
      ></div>
      <div className="studyMemberBlockTitle">
        <h3 onClick={() => moveToProfilePage(member.email)}>
          {member.nickname}
        </h3>
        <p onClick={() => (window.location.href = `mailto:${member.email}`)}>
          {member.email}
        </p>
      </div>
      <div className="studyMemberBlockBtn">{renderButton()}</div>
    </div>
  );
};

export default StudyMemberBlock;
