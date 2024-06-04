import BasicLayoutPage from "../../layouts/BasicLayoutPage";
import "../../scss/pages/StudyReadPage.scss";
import "../../components/study/StudyMemberBlock";
import React, { useEffect } from "react";
import { API_SERVER_HOST } from "../../api/studyAPI";
import useCustomMove from "../../hooks/useCustomMove";
import useStudyData from "../../hooks/useStudyData";
import useMemberProfile from "../../hooks/useMemberProfile";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

const host = API_SERVER_HOST;

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
  const { member: studyMember, imgSrc: studyMemberImgSrc } = useMemberProfile(studyUserEmail);

  // const studyUserEmail = study.memberEmail;
  // console.log(studyUserEmail);
  // const { member, imgSrc } = useMemberProfile(userEmail);

  // 클릭 이동관련
  const { moveToProfilePage } = useCustomMove();
  const { moveToModifyPage } = useCustomMove();
  const { moveToLogin } = useCustomMove();

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

  // handleParticipate 참가하기 구현
  const handleParticipate = async () => {
    if (userEmail) {
      try {
        // 백엔드 서버에 참가 요청을 보냄
        const response = await axios.post(`${host}/api/study/${id}/participate`, {
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
    <BasicLayoutPage headerTitle="스터디">
      <div>
        <div className="ReadContent">
          <div className="ReadImg" style={imgStudySrc !== "" ? { backgroundImage: `url(${imgStudySrc})` } : null}></div>
          <div className="ReadTitle">
            <h3>{study.title}</h3>
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

          <div className="ReadBtn">
            {!userEmail || userEmail !== studyUserEmail ? (
              <>
                <button className="btnSmallPoint" onClick={() => (window.location.href = `tel:${study.memberPhone}`)}>
                  연락하기
                </button>
                <button className="btnSmallBlack" onClick={handleShareClick}>
                  공유하기
                </button>
              </>
            ) : (
              <>
                <button className="btnSmallPoint" onClick={() => moveToModifyPage(id)}>
                  수정하기
                </button>
                <button className="btnSmallBlack">삭제하기</button>
              </>
            )}
          </div>
        </div>

        <div className="ReadTextWrap">
          <div className="ReadText">
            <h3>작성자 : </h3>
            <div>
              <p>{study.memberNickname}</p>
              <p>{study.memberEmail}</p>
            </div>
          </div>
          <div className="ReadText">
            <h3>참여일자 : </h3>
            <p>{study.studyDate}</p>
          </div>
          <div className="ReadText">
            <h3>참여인원 : </h3>
            <p>
              {(study.studyMemberList ? study.studyMemberList.length : 0) + 1}
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
          <h2>참가자 리스트</h2>
          {/* 생성자 디폴트 */}
          <div className="studyMemberBlockWrap" onClick={moveToProfilePage}>
            {/* <div className="studyMemberBlockImg"></div> */}
            <div className="studyMemberBlockImg" style={studyMemberImgSrc ? { backgroundImage: `url(${studyMemberImgSrc})` } : null}></div>
            <div className="studyMemberBlockTitle">
              <h3>{study.memberNickname}</h3>
              <p>{study.memberEmail}</p>
            </div>
            <div className="studyMemberBlockBtn"></div>
          </div>
          {/* 생성자 디폴트 */}
          {/* 참가자 리스트 - 컴포넌트 */}
          {/* <StudyMemberBlock /> */}
        </div>

        {/* 기본 */}
        <div className="StudyJoinBtn">
          {!userEmail || userEmail !== studyUserEmail ? (
            <button className="btnLargePoint" onClick={handleParticipate}>
              스터디참가
            </button>
          ) : (
            <button className="btnLargePoint">스터디시작</button>
          )}
        </div>
      </div>
    </BasicLayoutPage>
  );
};

export default ReadPage;
