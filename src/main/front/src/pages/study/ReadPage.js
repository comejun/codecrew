import BasicLayoutPage from "../../layouts/BasicLayoutPage";
import "../../scss/pages/StudyReadPage.scss";
import React, { useEffect, useState } from "react";
import useCustomMove from "../../hooks/useCustomMove";
import useStudyData from "../../hooks/useStudyData";
import useMemberProfile from "../../hooks/useMemberProfile";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import StudyMemberBlock from "../../components/study/StudyMemberBlock";
import useHandleStudyMember from "../../hooks/useHandleStudyMember";
import useHandleStudy from "../../hooks/useHandleStudy";

const ReadPage = () => {
  const [refresh, setRefresh] = useState(false);

  const reRender = () => {
    setRefresh(!refresh);
  };
  const { id } = useParams();
  console.log(id);

  // 스터디 정보 가져오기
  const { study, imgStudySrc } = useStudyData(id, refresh);
  console.log(study);

  // 현재 로그인 된 회원의 이메일 가져오기
  const userEmail = useSelector((state) => state.loginSlice.email);
  console.log(userEmail);

  // 스터디 생성자의 이메일 주소 가져오기
  const studyUserEmail = study.memberEmail;

  // 스터디 생성자의 회원 정보 가져오기
  const { member: studyMember, imgSrc: studyMemberImgSrc } = useMemberProfile(studyUserEmail);

  // 참가자 리스트 로그인 사용자 확인용
  const isCurrentUserAMember = study.studyMemberList.some((member) => member.email === userEmail);

  // 클릭 이동관련
  const { moveToProfilePage, moveToModifyPage } = useCustomMove();

  const { handleParticipate, handleParticipateCancel, handleArrive } = useHandleStudyMember();
  const { handleStart, handleDelete } = useHandleStudy();

  // 날짜 체크관련
  const isToday = (date) => {
    const today = new Date();
    const studyDate = new Date(date);
    return studyDate.toDateString() === today.toDateString();
  };

  // 참가하기, 참가취소 버튼
  const participateButtonCheck = () => {
    // 모임 생성자일경우
    if (userEmail === studyUserEmail && !study.confirmed) {
      const onStudyStartClick = async () => {
        await handleStart(study);
        reRender();
      };

      return (
        <button className="btnLargePoint" onClick={() => onStudyStartClick()}>
          스터디시작
        </button>
      );
    } else if (userEmail === studyUserEmail && study.confirmed) {
      if (!isToday(study.studyDate)) {
        return (
          <button
            className="btnLargeGrey"
            onClick={() => {
              alert("스터디당일에만 수정가능합니다.");
            }}
          >
            출석관리
          </button>
        );
      } else {
        return (
          <button
            className="btnLargePoint"
            onClick={() => {
              alert("수정가능");
            }}
          >
            출석관리
          </button>
        );
      }
    } else if (isCurrentUserAMember && study.studyMemberList.some((member) => member.email === userEmail && member.status === "HOLD")) {
      const onWithdrawClick = async () => {
        await handleParticipateCancel(study.id);
        reRender();
      };

      return (
        <button className="btnLargeBlack" onClick={() => onWithdrawClick()}>
          스터디탈퇴
        </button>
      );
    } else if (isCurrentUserAMember && study.studyMemberList.some((member) => member.email === userEmail && member.status === "ACCEPT")) {
      if (!study.confirmed) {
        return <button className="btnLargeBlack">참가확정</button>;
      } else {
        if (!isToday(study.studyDate)) {
          return (
            <button
              className="btnLargeGrey"
              onClick={() => {
                alert("스터디당일에만 출석이 가능합니다.");
              }}
            >
              출석체크
            </button>
          );
        } else {
          const onArriveClick = async () => {
            await handleArrive(study.id);
            reRender();
          };

          return (
            <button className="btnLargePoint" onClick={() => onArriveClick()}>
              출석체크
            </button>
          );
        }
      }
    } else if (isCurrentUserAMember && study.studyMemberList.some((member) => member.email === userEmail && (member.status === "WITHDRAW" || member.status === "DECLINE"))) {
      return <button className="btnLargeBlack">참가불가</button>;
    } else {
      // 스터디 참가 버튼 클릭 핸들러
      const onParticipateClick = async () => {
        await handleParticipate(study.id);
        reRender();
      };

      return (
        <button className="btnLargePoint" onClick={() => onParticipateClick()}>
          스터디참가
        </button>
      );
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
    } else if (userEmail !== studyUserEmail && !study.confirmed) {
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
    } else if (userEmail !== studyUserEmail && study.confirmed) {
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
          <button className="btnSmallBlack" onClick={openKakaoMap}>
            찾아오기
          </button>
        </>
      );
    }
    return null;
  };

  // 수정, 삭제 버튼
  const renderEditAndDeleteButtons = () => {
    if (userEmail && userEmail === studyUserEmail && study.confirmed) {
      return <></>;
    } else if (userEmail && userEmail === studyUserEmail && !study.confirmed) {
      return (
        <>
          <button className="btnSmallPoint" onClick={() => moveToModifyPage(id)}>
            수정하기
          </button>
          <button className="btnSmallBlack" onClick={() => handleDelete(study.id, study.memberEmail)}>
            삭제하기
          </button>
        </>
      );
    }
    return null;
  };

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

  // 카카오지도 열기
  const openKakaoMap = () => {
    const confirmOpen = window.confirm("카카오지도를 여시겠습니까?");
    if (confirmOpen) {
      const encodedLocation = encodeURIComponent(study.location);
      const kakaoMapUrl = `https://map.kakao.com/?q=${encodedLocation}`;
      window.open(kakaoMapUrl, "_blank");
    }
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

  // 참가자 리스트 렌더링
  const renderStudyMemberBlockList = () => {
    let newStudyMemberList = study.studyMemberList;
    console.log("참가자 리스트 : ", newStudyMemberList);
    // 모임 생성자인 경우
    if (userEmail === studyUserEmail) {
      // 상태가 수락된 참가자들은 배열 제일 뒤로
      newStudyMemberList = newStudyMemberList.sort((a, b) => {
        if (a.status === "HOLD") return -1;
        if (b.status === "HOLD") return 1;
        return 0;
      });
    }
    // 모임 참가자인 경우
    else if (isCurrentUserAMember) {
      newStudyMemberList = newStudyMemberList.filter((member) => member.status === "ACCEPT" && member.email !== userEmail);
      console.log("본인 제외 확정 인원 : ", newStudyMemberList);
      const member = study.studyMemberList.filter((member) => member.email === userEmail);
      console.log("본인 추가 : ", member);
      newStudyMemberList.unshift(member[0]);
      console.log("본인 추가 확정 인원 : ", newStudyMemberList);
    }
    // 그외
    else {
      newStudyMemberList = newStudyMemberList.filter((member) => member.status === "ACCEPT");
    }
    return newStudyMemberList.map((member, index) => (
      <StudyMemberBlock key={index} memberData={member} currentUserEmail={userEmail} studyCreatorEmail={studyUserEmail} studyId={study.id} reRender={reRender} />
    ));
  };

  return (
    <BasicLayoutPage headerTitle="스터디">
      <div>
        {/*스터디 이미지*/}
        <div className="ReadContent">
          <div className="ReadImg" style={imgStudySrc !== "" ? { backgroundImage: `url(${imgStudySrc})` } : null}></div>

          {/*스터디 제목, 위치*/}
          <div className="ReadTitle">
            <h3>{study.title}</h3>
            <p onClick={openKakaoMap} style={{ cursor: "pointer" }}>
              {study.location}
            </p>
          </div>

          {/*수정,삭제 & 연락하기, 공유하기 버튼*/}
          <div className="ReadBtn">
            {renderContactAndShareButtons()}
            {renderEditAndDeleteButtons()}
          </div>
        </div>

        <div className="ReadTextWrap">
          {/*작성자 닉네임, 이메일*/}
          <div className="ReadText">
            <h3>작성자 : </h3>
            <div>
              <p onClick={() => moveToProfilePage(study.memberEmail)} style={{ fontSize: "15px", color: "#000", cursor: "pointer" }}>
                {study.memberNickname}
              </p>
              <p onClick={() => (window.location.href = `mailto:${study.memberEmail}`)} style={{ cursor: "pointer" }}>
                {study.memberEmail}
              </p>
            </div>
          </div>

          {/*참여일자*/}
          <div className="ReadText">
            <h3>참여일자 : </h3>
            <p>{study.studyDate}</p>
          </div>

          {/*참여확정 인원*/}
          <div className="ReadText">
            <h3>참여확정 : </h3>
            {renderStudyMemberCount(study)}
          </div>
        </div>

        {/*스터디 소개*/}
        <div className="ReadStudyText">
          <h2>스터디 소개</h2>
          <p>{study.content}</p>
        </div>

        <div className="ReadStudyText">
          {/*참가자 리스트 텍스트*/}
          <div className="ReadUserCheck">
            <h2>참가자 리스트</h2>
            {renderStudyMemberCount(study)}
          </div>

          {/* 모임 주최자 프로필 */}
          <div className="studyMemberBlockWrap">
            <div className="studyMemberBlockImg" style={studyMemberImgSrc ? { backgroundImage: `url(${studyMemberImgSrc})` } : null} onClick={() => moveToProfilePage(study.memberEmail)}></div>
            <div className="studyMemberBlockTitle">
              <h3 onClick={() => moveToProfilePage(study.memberEmail)}>{study.memberNickname}</h3>
              <p onClick={() => (window.location.href = `mailto:${study.memberEmail}`)}>{study.memberEmail}</p>
            </div>
            <div className="studyMemberBlockBtn"></div>
          </div>

          {/* 생성자 디폴트 */}
          {/* 참가자 리스트 조건에 따라 출력 - 컴포넌트 */}
          {renderStudyMemberBlockList()}
        </div>

        {/* 기본 */}
        <div className="StudyJoinBtn">{participateButtonCheck()}</div>
      </div>
    </BasicLayoutPage>
  );
};

export default ReadPage;
