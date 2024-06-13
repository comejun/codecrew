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
// import PopUp from "../../components/PopUp.js/PopUp";

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
  const { moveToProfilePage, moveToModifyPage, moveToMain } = useCustomMove();

  const { handleParticipate, handleParticipateCancel, handleArrive } = useHandleStudyMember();
  const { handleStart, handleDelete, handleFinish } = useHandleStudy();

  // 날짜 체크관련
  const isToday = (date) => {
    const today = new Date();
    const studyDate = new Date(date);
    return studyDate.toDateString() === today.toDateString();
  };
  console.log(study);

  const isFinishHour = (studyDate) => {
    const finishTime = new Date(studyDate);
    finishTime.setHours(finishTime.getHours() + 2); // 스터디 종료 시간 2시간 후로 설정
    const currentTime = new Date();
    return currentTime >= finishTime; // 현재 시간이 스터디 종료 시간 2시간 후보다 크거나 같은지 반환
  };

  // 위치 값 구하기
  const calculateDistance = (userLocation, studyLocation) => {
    const R = 6371; // 지구의 반지름 (km)
    const dLat = ((studyLocation.lat - userLocation.lat) * Math.PI) / 180;
    const dLng = ((studyLocation.lng - userLocation.lng) * Math.PI) / 180;

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos((userLocation.lat * Math.PI) / 180) * Math.cos((studyLocation.lat * Math.PI) / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    console.log(distance);
    return distance;
  };

  // 참가하기, 참가취소 버튼
  const participateButtonCheck = () => {
    // studyDeadlineDate이 현재날짜보다 이전인지 체크
    const isStudyDeadlineDatePassed =
      new Date(study.studyDeadlineDate) < new Date();
    console.log(isStudyDeadlineDatePassed);

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
    } else if (study.finished) {
      return (
        <button className="btnLargeGrey" onClick={() => moveToMain()}>
          스터디종료
        </button>
      );
    } else if (userEmail === studyUserEmail && study.confirmed) {
      if (!isToday(study.studyDate)) {
        return (
          <button
            className="btnLargeGrey"
            onClick={() => {
              alert("스터디당일에만 종료가 가능합니다.");
            }}
          >
            스터디종료
          </button>
        );
      } else {
        const onStudyFinishClick = async () => {
          await handleFinish(study);
          reRender();
        };
        if (!isFinishHour(study.studyDate)) {
          return (
            <button
              className="btnLargePoint"
              onClick={() => {
                alert("스터디시작 2시간 이후부터 종료가 가능합니다.");
              }}
            >
              스터디종료
            </button>
          );
        } else {
          return (
            <button className="btnLargePoint" onClick={() => onStudyFinishClick()}>
              스터디종료
            </button>
          );
        }
      }
    } else if (
      isCurrentUserAMember &&
      study.studyMemberList.some(
        (member) => member.email === userEmail && member.status === "HOLD",
      )
    ) {
      const onWithdrawClick = async () => {
        await handleParticipateCancel(study.id);
        reRender();
      };

      return (
        <button className="btnLargeBlack" onClick={() => onWithdrawClick()}>
          스터디탈퇴
        </button>
      );
    } else if (
      isCurrentUserAMember &&
      study.studyMemberList.some(
        (member) => member.email === userEmail && member.status === "ARRIVE",
      )
    ) {
      return <button className="btnLargeGrey">출석완료</button>;
    } else if (
      isCurrentUserAMember &&
      study.studyMemberList.some(
        (member) => member.email === userEmail && member.status === "ACCEPT",
      )
    ) {
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
            // 사용자의 현재 위치를 가져옵니다.
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(
                async (position) => {
                  const userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                  };

                  // 스터디 위치를 가져옵니다.
                  const studyLocation = {
                    lat: study.locationY,
                    lng: study.locationX,
                  }; // 스터디의 위도와 경도

                  console.log(userLocation);
                  console.log(studyLocation);
                  // 사용자 위치와 스터디 위치 사이의 거리를 계산합니다.
                  const distance = calculateDistance(
                    userLocation,
                    studyLocation,
                  );

                  // 거리가 200m 이내인지 확인합니다.
                  if (distance <= 0.2) {
                    // 출석체크 로직을 실행합니다.
                    await handleArrive(study.id);
                    reRender();
                  } else {
                    // 사용자에게 경고 메시지를 표시합니다.
                    alert("스터디 장소에서 출석체크 버튼을 눌러주세요.");
                  }
                },
                (error) => {
                  // 위치 정보를 가져오는데 실패한 경우
                  alert("위치 정보를 가져올 수 없습니다.");
                },
              );
            } else {
              alert("Geolocation is not supported by this browser.");
            }
          };

          return (
            <button className="btnLargePoint" onClick={() => onArriveClick()}>
              출석체크
            </button>
          );
        }
      }
    } else if (
      (isCurrentUserAMember &&
        study.studyMemberList.some(
          (member) =>
            member.email === userEmail &&
            (member.status === "WITHDRAW" || member.status === "DECLINE"),
        )) ||
      study.studyMemberList.length >= study.maxPeople ||
      isStudyDeadlineDatePassed
    ) {
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
    } else if (study.finished) {
      <></>;
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
    const currentMembers = study.studyMemberList ? study.studyMemberList.filter((member) => member.status === "ACCEPT" || member.status === "ARRIVE" || member.status === "ABSENCE").length : 0;

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
        {(study.studyMemberList ? study.studyMemberList.filter((member) => member.status === "ACCEPT" || member.status === "ARRIVE" || member.status === "ABSENCE").length : 0) + 1}

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
      // 확정된 참가자들만 배열에 남기기
      if (study.confirmed) {
        newStudyMemberList = newStudyMemberList.filter(
          (member) =>
            member.status === "ACCEPT" ||
            member.status === "ARRIVE" ||
            member.status === "ABSENCE" ||
            member.status === "LATE",
        );
        // ACCEPT, ARRIVE, LATE, ABSENCE 순으로 정렬
        newStudyMemberList = newStudyMemberList.sort((a, b) => {
          if (a.status === "ACCEPT") return -1;
          if (b.status === "ACCEPT") return 1;
          if (a.status === "ARRIVE") return -1;
          if (b.status === "ARRIVE") return 1;
          if (a.status === "LATE") return -1;
          if (b.status === "LATE") return 1;
          if (a.status === "ABSENCE") return -1;
          if (b.status === "ABSENCE") return 1;
          return 0;
        });
      } else {
        // 상태가 수락된 참가자들은 배열 제일 뒤로
        newStudyMemberList = newStudyMemberList.sort((a, b) => {
          if (a.status === "HOLD") return -1;
          if (b.status === "HOLD") return 1;
          return 0;
        });
      }
    }
    // 모임 참가자인 경우
    else if (isCurrentUserAMember) {
      newStudyMemberList = newStudyMemberList.filter(
        (member) =>
          (member.status === "ACCEPT" ||
            member.status === "ARRIVE" ||
            member.status === "ABSENCE") &&
          member.email !== userEmail,
      );
      console.log("본인 제외 확정 인원 : ", newStudyMemberList);
      const member = study.studyMemberList.filter(
        (member) => member.email === userEmail,
      );
      console.log("본인 추가 : ", member);
      newStudyMemberList.unshift(member[0]);
      console.log("본인 추가 확정 인원 : ", newStudyMemberList);
    }
    // 그외
    else {
      newStudyMemberList = newStudyMemberList.filter(
        (member) => member.status === "ACCEPT",
      );
    }
    return newStudyMemberList.map((member, index) => (
      <StudyMemberBlock
        key={index}
        memberData={member}
        currentUserEmail={userEmail}
        studyCreatorEmail={studyUserEmail}
        studyId={study.id}
        reRender={reRender}
        studyConfirmed={study.confirmed}
      />
    ));
  };

  return (
    <BasicLayoutPage headerTitle={study.finished ? "종료된 스터디" : "스터디"}>
      <div>
        {/*스터디 이미지*/}
        <div className="ReadContent">
          <div
            className="ReadImg"
            style={
              imgStudySrc !== ""
                ? { backgroundImage: `url(${imgStudySrc})` }
                : null
            }
          ></div>

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
            <div className="studyMemberBlockBtn">
              <button
                className="btnSmallBlack"
                style={{ marginTop: "16px", cursor: "default" }}
              >
                스터디장
              </button>
            </div>
          </div>

          {/* 생성자 디폴트 */}
          {/* 참가자 리스트 조건에 따라 출력 - 컴포넌트 */}
          {renderStudyMemberBlockList()}
        </div>

        {/* 기본 */}
        <div className="StudyJoinBtn">{participateButtonCheck()}</div>
      </div>
      {study.finished && <div className="endPageWrap"></div>}
      {/* <PopUp /> */}
    </BasicLayoutPage>
  );
};

export default ReadPage;
