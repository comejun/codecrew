import { API_SERVER_HOST } from "./memberAPI";
import axios from "axios";

const host = `${API_SERVER_HOST}/api/map`;

// 이미지 업로드 요청
export const getAllStudyLocation = async (category) => {
  // console.log("카테고리별 표시할 마커들 위치와 id값 가져오기");
  // console.log("category : ", category);
  // console.log(`${host}/${category}`);
  const response = await axios.get(`${host}/${category}`);
  // console.log("response : ", response.data);
  // response.data의 데이터 타입 확인
  return response.data;
};
