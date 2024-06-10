import BasicLayoutPage from "../../layouts/BasicLayoutPage";
import "../../scss/pages/StudyReadPage.scss";
import React, { useEffect } from "react";
import useCustomMove from "../../hooks/useCustomMove";
import useStudyData from "../../hooks/useStudyData";
import useMemberProfile from "../../hooks/useMemberProfile";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import StudyMemberBlock from "../../components/study/StudyMemberBlock";
import useHandleStudyMember from "../../hooks/useHandleStudyMember";
import useHandleStudy from "../../hooks/useHandleStudy";

const ReadPage = () => {
  const { id } = useParams();
  console.log(id);
  // 스터디 정보 가져오기
  const { study, imgStudySrc } = useStudyData(id);

  // 현재 로그인 된 회원의 이메일 가져오기
  const userEmail = useSelector((state) => state.loginSlice.email);
  console.log(userEmail);

  // 스터디 생성자의 이메일 주소 가져오기
  const studyUserEmail = study.memberEmail;

  // 스터디 생성자의 회원 정보 가져오기
  const { member: studyMember, imgSrc: studyMemberImgSrc } =
    useMemberProfile(studyUserEmail);

  // 참가자 리스트 로그인 사용자 확인용
  const isCurrentUserAMember = study.studyMemberList.some(
    (member) => member.email === userEmail,
  );

  // 클릭 이동관련
  const { moveToProfilePage, moveToModifyPage, moveToLogin } = useCustomMove();

  const { handleParticipate, handleParticipateCancel } = useHandleStudyMember();
  const { handleStart, handleDelete } = useHandleStudy();

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
        imageUrl: imgStudySrc,
        link: {
          mobileWebUrl: window.location.href,
          webUrl: window.location.href,
        },
      },
    });
  };

  return (
    <BasicLayoutPage headerTitle="스터디">
      <div>
        <div className="ReadContent">
          <div
            className="ReadImg"
            style={
              imgStudySrc !== ""
                ? { backgroundImage: `url(${imgStudySrc})` }
                : null
            }
          ></div>
          <div className="ReadTitle">
            <h3>{study.title}</h3>
            <p
              onClick={() => {
                const confirmOpen =
                  window.confirm("카카오지도를 여시겠습니까?");
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

          <div className="ReadBtn">
            {!userEmail || userEmail !== studyUserEmail ? (
              <>
                <button
                  className="btnSmallPoint"
                  onClick={() =>
                    (window.location.href = `tel:${study.memberPhone}`)
                  }
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
                  onClick={() => moveToModifyPage(id)}
                >
                  수정하기
                </button>
                <button
                  className="btnSmallBlack"
                  onClick={() => handleDelete(study.id, study.memberEmail)}
                >
                  삭제하기
                </button>
              </>
            )}
          </div>
        </div>

        <div className="ReadTextWrap">
          <div className="ReadText">
            <h3>작성자 : </h3>
            <div>
              <p
                onClick={() => moveToProfilePage(study.memberEmail)}
                style={{ fontSize: "15px", color: "#000", cursor: "pointer" }}
              >
                {study.memberNickname}
              </p>
              <p
                onClick={() =>
                  (window.location.href = `mailto:${study.memberEmail}`)
                }
                style={{ cursor: "pointer" }}
              >
                {study.memberEmail}
              </p>
            </div>
          </div>
          <div className="ReadText">
            <h3>참여일자 : </h3>
            <p>{study.studyDate}</p>
          </div>
          <div className="ReadText">
            <h3>참여확정 : </h3>
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
                ? study.studyMemberList.filter((member) => member.checked)
                    .length
                : 0) + 1}
              <span>/</span>
              {study.maxPeople}
            </p>
          </div>
        </div>

        <div className="ReadStudyText">
          <h2>스터디 소개</h2>
          <p>{study.content}</p>
        </div>

        <div className="ReadStudyText">
          <div className="ReadUserCheck">
            <h2>참가자 리스트</h2>
            <p
              style={{
                color:
                  (study.studyMemberList ? study.studyMemberList.length : 0) +
                    1 >
                  study.maxPeople
                    ? "#FF3333"
                    : (study.studyMemberList
                          ? study.studyMemberList.length
                          : 0) +
                          1 ===
                        study.maxPeople
                      ? "#007BFF"
                      : "inherit", // 기본 색상
              }}
            >
              {(study.studyMemberList ? study.studyMemberList.length : 0) + 1}
              <span>/</span>
              {study.maxPeople}
            </p>
          </div>
          {/* 생성자 디폴트 */}
          <div className="studyMemberBlockWrap">
            <div
              className="studyMemberBlockImg"
              style={
                studyMemberImgSrc
                  ? { backgroundImage: `url(${studyMemberImgSrc})` }
                  : null
              }
              onClick={() => moveToProfilePage(study.memberEmail)}
            ></div>
            <div className="studyMemberBlockTitle">
              <h3 onClick={() => moveToProfilePage(study.memberEmail)}>
                {study.memberNickname}
              </h3>
              <p
                onClick={() =>
                  (window.location.href = `mailto:${study.memberEmail}`)
                }
              >
                {study.memberEmail}
              </p>
            </div>
            <div className="studyMemberBlockBtn"></div>
          </div>
          {/* 생성자 디폴트 */}
          {/* 참가자 리스트 - 컴포넌트 */}
          {study.studyMemberList &&
            study.studyMemberList.map((member, index) => (
              <StudyMemberBlock
                key={index}
                email={member.email}
                currentUserEmail={userEmail}
                studyCreatorEmail={studyUserEmail}
                studyId={study.id}
                studyMemberList={study.studyMemberList}
              />
            ))}
        </div>

        {/* 기본 */}
        <div className="StudyJoinBtn">
          {!userEmail ||
          (userEmail !== studyUserEmail && !isCurrentUserAMember) ? (
            <button
              className="btnLargePoint"
              onClick={() => handleParticipate(study.id)}
            >
              스터디참가
            </button>
          ) : null}
          {userEmail &&
            userEmail !== studyUserEmail &&
            isCurrentUserAMember && (
              <button
                className="btnLargeBlack"
                onClick={() => handleParticipateCancel(study.id)}
              >
                스터디탈퇴
              </button>
            )}
          {userEmail === studyUserEmail && (
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
    </BasicLayoutPage>
  );
};

export default ReadPage;
