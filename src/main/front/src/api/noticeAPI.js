import { API_SERVER_HOST } from "./memberAPI";
import jwtAxios from "../util/jwtUtil";

const host = `${API_SERVER_HOST}/api/notice`;

// 알람 갯수 조회
export const getNoticeCount = async (email) => {
  const response = await jwtAxios.get(`${host}/count/${email}`);
  return response.data;
};

//  알람 목록조회 요청
export const getNoticeList = async (email) => {
  const response = await jwtAxios.get(`${host}/list/${email}`);
  return response.data;
};

// 알람 삭제 요청
export const deleteNotice = async (noticeId, email) => {
  const response = await jwtAxios.delete(`${host}/${email}/${noticeId}`);
  return response.data;
};
