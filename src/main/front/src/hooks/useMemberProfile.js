import { useEffect, useState } from "react";
import { API_SERVER_HOST, getMember } from "../api/memberAPI";
import useCustomLogin from "./useCustomLogin";

const useMemberProfile = (userEmail) => {
  const initState = {
    email: "",
    nickname: "",
    phone: "",
    profileImg: "",
    memberLink: "",
    introduction: "",
    favoriteList: [],
    noticeList: [],
    penalty: 0,
    blockedDate: "",
  };
  const [member, setMember] = useState(initState);
  const [imgSrc, setImgSrc] = useState("");
  const { exceptionHandle } = useCustomLogin();
  const host = API_SERVER_HOST;

  useEffect(() => {
    getMember(userEmail)
      .then((res) => {
        if (res.profileImg && res.profileImg.startsWith("http")) {
          setImgSrc(res.profileImg);
        } else if (res.profileImg) {
          setImgSrc(`${host}/api/image/view/${res.profileImg}`);
        }
        console.log("res", res);
        setMember(res);
      })
      .catch((err) => exceptionHandle(err));
  }, [userEmail]);

  // 회원 정보와 출력용 이미지 주소를 반환
  return { member, imgSrc };
};

export default useMemberProfile;
