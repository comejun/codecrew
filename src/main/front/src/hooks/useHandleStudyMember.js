import { useSelector } from "react-redux";
import jwtAxios from "../util/jwtUtil";
import { API_SERVER_HOST } from "../api/memberAPI";
import useCustomMove from "../hooks/useCustomMove";
// import useCustomMap from "../hooks/useCustomMap";

// 스터디 멤버 관련 훅
const useHandleStudyMember = () => {
  // 로그인 상태를 가져옴
  const loginState = useSelector((state) => state.loginSlice);
  const userEmail = loginState.email;
  const host = API_SERVER_HOST;
  // 페이지 이동을 위한 함수들
  const { moveToLogin } = useCustomMove();
  // const { myLocation } = useCustomMap();
  // 공통 로직: 사용자가 로그인 상태인지 확인하고, confirm 팝업을 통해 사용자의 확인을 받는 함수
  const confirmAction = async (message, action) => {
    // 사용자가 로그인 상태인지 확인
    if (userEmail) {
      // 사용자에게 확인을 요청하는 팝업
      const confirmMessage = window.confirm(message);
      // 사용자가 '확인'을 클릭한 경우에만 로직을 실행
      if (confirmMessage) {
        try {
          const response = await action();
          console.log(response.data);
          return response;
        } catch (error) {
          console.error(error);
        }
      }
    } else {
      // 사용자가 로그인 상태가 아닌 경우 로그인 페이지로 이동
      moveToLogin();
    }
  };

  // 스터디 참가 처리 함수
  const handleParticipate = (studyId) =>
    confirmAction("스터디 참가신청을 하시겠습니까?", () =>
      jwtAxios.post(`${host}/api/study/${studyId}/participate`, {
        email: userEmail,
      })
    );

  // 스터디 참가 취소 처리 함수
  const handleParticipateCancel = (studyId) =>
    confirmAction("스터디 참가를 취소하시겠습니까?", () =>
      jwtAxios.post(`${host}/api/study/${studyId}/cancelParticipation`, {
        email: userEmail,
      })
    );

  // 스터디 출석 체크 함수
  const handleArrive = (studyId) =>
    confirmAction("스터디 출석체크를 하시겠습니까?", () =>
      jwtAxios.post(`${host}/api/study/${studyId}/arrive`, {
        email: userEmail,
      })
    );

  // 스터디 참가 수락 처리 함수
  const handleJoinAccept = (studyId, memberEmail) =>
    confirmAction(`"${memberEmail}"님의 참가를 수락하시겠습니까?`, () =>
      jwtAxios.post(`${host}/api/study/${studyId}/acceptJoin`, {
        email: memberEmail,
      })
    );

  // 스터디 참가 거절 처리 함수
  const handleJoinDecline = (studyId, memberEmail) =>
    confirmAction(`"${memberEmail}"님의 참가를 거절하시겠습니까?`, () =>
      jwtAxios.post(`${host}/api/study/${studyId}/declineJoin`, {
        email: memberEmail,
      })
    );

  // 각 함수를 반환
  return {
    handleParticipate,
    handleParticipateCancel,
    handleArrive,
    handleJoinAccept,
    handleJoinDecline,
  };
};

export default useHandleStudyMember;
