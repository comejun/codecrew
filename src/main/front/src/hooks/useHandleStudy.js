import { useCallback } from "react";
import jwtAxios from "../util/jwtUtil";
import { API_SERVER_HOST } from "../api/memberAPI";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

// 스터디 관련 훅
const useHandleStudy = () => {
  const navigate = useNavigate();
  // 로그인 상태를 가져옴
  const loginState = useSelector((state) => state.loginSlice);
  const userEmail = loginState.email;
  const host = API_SERVER_HOST;

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
      // 사용자가 로그인 상태가 아닌 경우 알림 메시지 출력
      alert("로그인이 필요합니다.");
    }
  };

  // 스터디 시작 처리 함수
  const handleStart = useCallback(async (study) => {
    return confirmAction("정말로 시작하시겠습니까?", async () => {
      const updatedStudy = { ...study, isConfirmed: true };
      const response = await jwtAxios.put(
        `${API_SERVER_HOST}/api/study/${study.id}/start`,
        updatedStudy,
      );
      if (response.status === 200) {
        alert("스터디가 시작되었습니다.");
        return "SUCCESS";
      } else {
        console.error("스터디 시작에 실패했습니다.");
        alert("스터디 시작에 실패했습니다.");
        return "FAILURE";
      }
    });
  }, []);

  // 스터디 삭제 처리 함수
  const handleDelete = async (studyId, studyUserEmail) => {
    if (userEmail === studyUserEmail) {
      return confirmAction("정말로 삭제하시겠습니까?", async () => {
        const response = await jwtAxios.delete(`${host}/api/study/${studyId}`);
        console.log(response.data);
        alert("스터디 모임이 삭제되었습니다.");
        navigate("/"); // 메인 페이지로 리다이렉트
        return "success";
      });
    } else {
      // 본인이 작성한 글만 삭제할 수 있음을 알림
      alert("본인이 작성한 글만 삭제할 수 있습니다.");
    }
  };

  // 각 함수를 반환
  return { handleStart, handleDelete };
};

export default useHandleStudy;
