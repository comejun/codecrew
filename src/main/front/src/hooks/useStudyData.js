import { useEffect, useState } from "react";
import { getOne } from "../api/studyAPI";
import { useNavigate } from "react-router-dom";
import { API_SERVER_HOST } from "../api/memberAPI";

const useStudyData = (id, refresh) => {
  // 스터디 저장값 초기화
  const initState = {
    id: "",
    thImg: "",
    title: "제목",
    content: "설명글",
    memberEmail: "",
    memberNickname: "작성자닉네임",
    memberPhone: "작성자연락처",
    location: "주소",
    studyDate: "날짜",
    maxPeople: 2,
    category: "", // 빈 배열로 초기화
    disabled: "",
    isConfirmed: "",
    studyMemberList: [],
  };
  const refresh1 = refresh;
  const [study, setStudy] = useState(initState);
  const navigate = useNavigate();
  const [imgStudySrc, setStudyImgSrc] = useState("");
  const host = API_SERVER_HOST;

  // 스터디 데이터 가져오기
  useEffect(() => {
    getOne(id)
      .then((data) => {
        if (data && data.disabled !== "1") {
          // data가 유효한지 확인
          setStudyImgSrc(`${host}/api/image/view/${data.thImg}`);
          setStudy({ ...data, id: id });
        } else {
          // data가 없을 경우
          alert("해당 페이지는 없는 페이지 입니다.");
          navigate("/"); // 메인 페이지로 리다이렉트
        }
      })
      .catch((error) => {
        console.error("데이터 불러오는 중...", error);
      });
  }, [id, host, navigate, refresh1]); // host를 의존성 배열에 추가

  // 리턴
  return { study, imgStudySrc };
};

export default useStudyData;
