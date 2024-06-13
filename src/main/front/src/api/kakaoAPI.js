import axios from "axios";
import { API_SERVER_HOST } from "./memberAPI";

// ToDo 카카오에서 발급 받은 내 REST API 키
const rest_api_key = `dcb40de2e6ff14c5d5862f9b01cc3b84`;
// RedirectURI
const redirect_uri = `http://localhost:3000/member/kakao`;

// 카카오 인가코드 요청 경로
const auth_code_path = `https://kauth.kakao.com/oauth/authorize`;
// 카카오 Access Token 요청 경로
const access_token_path = `https://kauth.kakao.com/oauth/token`;

// 카카오 인가코드 요청경로 생성함수
export const getKakaoLoginLink = () => {
  const kakaoURL = `${auth_code_path}?
client_id=${rest_api_key}&redirect_uri=${redirect_uri}&response_type=code`;
  return kakaoURL;
};

// Access Token 요청 함수 : 카카오 서버에 요청 -> 비동기 요청
export const getAccessToken = async (authCode) => {
  const header = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
    },
  };
  const params = {
    grant_type: "authorization_code",
    client_id: rest_api_key,
    redirect_uri: redirect_uri,
    code: authCode,
  };

  const response = await axios.post(access_token_path, params, header);
  console.log(response);
  const accessToken = response.data.access_token;

  return accessToken;
};

// Access Token으로 API 서버 호출 함수
export const getMemberWithAccessToken = async (accessToken) => {
  const response = await axios.get(
    `${API_SERVER_HOST}/api/member/kakao?accessToken=${accessToken}`,
  );
  return response.data;
};
