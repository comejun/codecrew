import React, { useEffect, useState } from "react";
import useCustomMove from "../../hooks/useCustomMove";
import { useSelector } from "react-redux";
import useHandleStudyMember from "../../hooks/useHandleStudyMember";
import useHandleStudy from "../../hooks/useHandleStudy";

const StudyDetailPopup = ({ study, setPopup, popup }) => {
  const { moveToProfilePage, moveToModifyPage, moveToReadPage } =
    useCustomMove();

  const { handleParticipate, handleParticipateCancel } = useHandleStudyMember();
  const { handleStart, handleDelete } = useHandleStudy();

  // 현재 로그인 된 회원의 이메일 가져오기
  const loginState = useSelector((state) => state.loginSlice);
  const userEmail = loginState.email;

  const [isCurrentUserAMember, setIsCurrentUserAMember] = useState(false);

  useEffect(() => {
    if (popup && study && study.studyMemberList) {
      const isMember = study.studyMemberList.some(
        (member) => member.email === userEmail,
      );
      console.log("set!");
      setIsCurrentUserAMember(isMember);
    }
  }, [study, userEmail, popup]);

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
        <div
          className="stPopupImg"
          onClick={() => moveToReadPage(study.id)}
          style={{
            backgroundImage: `url(${study.thImg})`,
            cursor: "pointer",
          }}
        ></div>
        <div className="stPopupTitle">
          <h3
            onClick={() => moveToReadPage(study.id)}
            style={{ cursor: "pointer" }}
          >
            {study.title}
          </h3>
          <p
            onClick={() => {
              const confirmOpen = window.confirm("카카오지도를 여시겠습니까?");
              if (confirmOpen) {
                const encodedLocation = encodeURIComponent(study.location);
                const kakaoMapUrl = `https://map.kakao.com/?q=${encodedLocation}`;
                window.open(kakaoMapUrl, "_blank");
              }
            }}
            style={{ cursor: "pointer" }}
          >
            {study.location}
          </p>
        </div>
        <div className="stPopupBtn">
          {!userEmail || userEmail !== study.memberEmail ? (
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
          ) : (
            <>
              <button
                className="btnSmallPoint"
                onClick={() => moveToModifyPage(study.id)}
              >
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
          )}
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
            <p
              onClick={() =>
                (window.location.href = `mailto:${study.memberEmail}`)
              }
            >
              {study.memberEmail}
            </p>
          </div>
        </div>
        <div>
          <h4>참여일자 : </h4>
          <p>{study.studyDate}</p>
        </div>
        <div>
          <h4>참여확정 : </h4>
          <p
            style={{
              color:
                (study.studyMemberList
                  ? study.studyMemberList.filter((member) => member.checked)
                      .length
                  : 0) +
                  1 >
                study.maxPeople
                  ? "#FF3333"
                  : (study.studyMemberList
                        ? study.studyMemberList.filter(
                            (member) => member.checked,
                          ).length
                        : 0) +
                        1 ===
                      study.maxPeople
                    ? "#007BFF"
                    : "inherit", // 기본 색상
            }}
          >
            {(study.studyMemberList
              ? study.studyMemberList.filter((member) => member.checked).length
              : 0) + 1}
            <span>/</span>
            {study.maxPeople}
          </p>
        </div>
      </div>
      <div className="stPopupContentButton">
        {!userEmail ||
        (userEmail !== study.memberEmail && !isCurrentUserAMember) ? (
          <button
            className="btnLargePoint"
            onClick={() => handleParticipate(study.id)}
          >
            스터디참가
          </button>
        ) : null}
        {userEmail &&
          userEmail !== study.memberEmail &&
          isCurrentUserAMember && (
            <button
              className="btnLargeBlack"
              onClick={() => handleParticipateCancel(study.id)}
            >
              스터디탈퇴
            </button>
          )}
        {userEmail === study.memberEmail && (
          <button
            className="btnLargePoint"
            onClick={() => {
              handleStart(study);
            }}
          >
            스터디시작
          </button>
        )}
      </div>
    </div>
  );
};
export default StudyDetailPopup;
