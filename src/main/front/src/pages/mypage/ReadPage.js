import BasicLayoutPage from "../../layouts/BasicLayoutPage";
import "../../scss/pages/MyReadPage.scss";
import { Link } from "react-router-dom";
import useCustomMove from "../../hooks/useCustomMove";
import { useSelector } from "react-redux";
import useCustomLogin from "../../hooks/useCustomLogin";
import useMemberProfile from "../../hooks/useMemberProfile";
import { API_SERVER_HOST } from "../../api/memberAPI";
import useCategories from "../../hooks/useCategories";
import React, { useEffect, useState } from "react";
import jwtAxios from "../../util/jwtUtil";

const host = API_SERVER_HOST;

const ReadPage = () => {
  const { moveToModify } = useCustomMove();
  const { execLogout, moveToPath } = useCustomLogin();

  // 현재 로그인 된 회원의 이메일 가져오기
  const userEmail = useSelector((state) => state.loginSlice.email);

  // 수정이 필요없는 조회용 회원 정보 가져오기
  const { member, imgSrc } = useMemberProfile(userEmail);
  // 전체 관심스택 가져오기
  const categories = useCategories(host);

  // 유저 카운팅 가져오기

  const [myStudyCount, setMyStudyCount] = useState(0);
  const [myStudyJoinCount, setMyStudyJoinCount] = useState(0);

  useEffect(() => {
    const fetchMyStudyCount = async () => {
      try {
        const response = await jwtAxios.get(`${host}/api/study/countmy`, {
          params: { email: userEmail },
        });
        setMyStudyCount(response.data.count);
      } catch (error) {
        console.error("스터디 개수를 가져오는데 실패했습니다.", error);
        setMyStudyCount(0);
      }
    };

    if (userEmail) {
      fetchMyStudyCount();
    }
  }, [userEmail, host]);

  useEffect(() => {
    const fetchMyStudyJoinCount = async () => {
      try {
        const response = await jwtAxios.get(`${host}/api/study/countmyJoin`, {
          params: { email: userEmail },
        });
        setMyStudyJoinCount(response.data.count);
      } catch (error) {
        console.error("스터디 개수를 가져오는데 실패했습니다.", error);
        setMyStudyJoinCount(0);
      }
    };

    if (userEmail) {
      fetchMyStudyJoinCount();
    }
  }, [userEmail, host]);

  const handleClickLogout = () => {
    execLogout();
    moveToPath("/");
  };

  return (
    <BasicLayoutPage headerTitle="마이페이지">
      <div>
        <div className="MyBlockWrap">
          <div className="MyReadImg" style={imgSrc !== "" ? { backgroundImage: `url(${imgSrc})` } : null}></div>
          <div className="MyReadTitle">
            <h3>{member.nickname}</h3>
            <p>{member.email}</p>
          </div>
          <div className="MyReadBtn">
            <button className="btnMediumBlack" onClick={moveToModify}>
              정보수정
            </button>
          </div>
        </div>
        <div className="MyReadUserStack">
          <h2>관심스택</h2>
          <div className="checkboxWrap">
            {Object.entries(categories).length > 0 &&
              Object.entries(categories).map(([key, value], index) => (
                <React.Fragment key={index}>
                  <div id={key} className={member.favoriteList.includes(key) ? "checkCate" : ""}>
                    {value}
                  </div>
                </React.Fragment>
              ))}
          </div>
        </div>
        <div className="MyReadUserText">
          <h2>사용자 소개</h2>
          {member.introduction ? <p>{member.introduction}</p> : <p>사용자 소개가 없습니다.</p>}
        </div>
        <div className="MyReadUserText">
          <h2>사용자 링크</h2>
          {member.memberLink ? (
            <p style={{ color: "#555", cursor: "pointer" }} onClick={() => window.open(`https://${member.memberLink}`, "_blank")}>
              {member.memberLink}
            </p>
          ) : (
            <p style={{ color: "#555" }}>아직 등록한 링크가 없습니다.</p>
          )}
        </div>
      </div>
      <div className="MyReadUserMenu">
        <h2>나의 어플</h2>
        <div className="MenuWrap">
          <Link to="/mypage/alarm">
            <h3>📡 나의 알림</h3>
            <span>0 건</span>
          </Link>
        </div>
        <div className="MenuWrap">
          <Link to="/mypage/createstudy">
            <h3>🧑🏻‍💻 나의 스터디</h3>
            <span>{myStudyCount} 건</span>
          </Link>
        </div>
        <div className="MenuWrap">
          <Link to="/mypage/joinstudy">
            <h3>🏃🏻 참가 스터디</h3>
            <span>{myStudyJoinCount} 건</span>
          </Link>
        </div>
      </div>
      <div className="MyReadUserMenu">
        <h2>개인/보안</h2>
        <div onClick={handleClickLogout} className="MenuWrap">
          <Link>
            <h3>🔑 로그아웃</h3>
            <span></span>
          </Link>
        </div>
        <div className="MenuWrap">
          <Link>
            <h3>🗑️ 회원탈퇴</h3>
            <span></span>
          </Link>
        </div>
      </div>
      <div className="myFooter">
        <span>Copyright © 2024 Codecrew. All rights reserved.</span>
      </div>
    </BasicLayoutPage>
  );
};

export default ReadPage;
