import axios from "axios";
import jwtAxios from "../util/jwtUtil";
import { API_SERVER_HOST } from "./memberAPI";

const host = `${API_SERVER_HOST}/api/study`;

// API 등록 요청
export const postAdd = async (study) => {
  const header = { headers: { "Content-Type": "multipart/form-data" } };
  const response = await jwtAxios.post(`${host}/`, study, header);
  return response.data;
};

// API 스터디 조회 요청
export const getOne = async (id) => {
  console.log(`${host}/${id}`);
  const response = await axios.get(`${host}/${id}`);
  console.log(response.data);
  return response.data;
};

// API 스터디 수정 요청
export const modifyStudy = async (id, study) => {
  console.log(`${host}/modify/${id}`);
  const response = await jwtAxios.put(`${host}/modify/${id}`, study);
  return response.data;
};

// API 스터디 목록조회 요청
export const getList = async (pageParam, email) => {
  const { page, size } = pageParam;
  const response = await jwtAxios.get(`${host}/list/${email}`, {
    params: { page, size }, // 여기서 page와 size를 동적으로 설정
  });
  return response.data;
};
