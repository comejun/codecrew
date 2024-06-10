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
import axios from "axios";

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
  // 유저 스터디 가져오기
  const [myStudyCount, setMyStudyCount] = useState(0);

  useEffect(() => {
    const fetchMyStudyCount = async () => {
      try {
        const response = await axios.get(`${host}/api/study/countmy`, {
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
        {/*TODO 관심스택 마진 변경 필요*/}
        {/* <div className="MyReadTextWrap">
          <div className="MyReadText">
            <h3>관심스택 : </h3>
            <div>
              {Object.entries(categories).length > 0 &&
                Object.entries(categories).map(([key, value], index) => (
                  <React.Fragment key={index}>
                    {member.favoriteList.includes(key) ? (
                      <span>{value} </span>
                    ) : null}
                  </React.Fragment>
                ))}
              {member.favoriteList.length === 0 ? (
                <p>설정한 관심스택이 없습니다.</p>
              ) : null}
            </div>
          </div>
          <div className="MyReadText">
            <h3>링 크 : </h3>
            {member.memberLink ? (
              <p>{member.memberLink}</p>
            ) : (
              <p>등록한 링크가 없습니다.</p>
            )}
          </div>
          <div className="MyReadText">
            <h3>모임횟수 : </h3>
            <p>
              20<span>회</span>
            </p>
          </div>
        </div> */}
        <div className="MyReadUserStack">
          <h2>관심스택</h2>
          <div className="checkboxWrap">
            {Object.entries(categories).length > 0 &&
              Object.entries(categories).map(([key, value], index) => (
                <React.Fragment key={index}>
                  <input id={key} type="checkbox" checked={member.favoriteList.includes(key)} />
                  <label htmlFor={key}>{value}</label>
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
            <p style={{ color: "#555", cursor: "pointer" }} onClick={() => window.open(member.memberLink, "_blank")}>
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
            <span>(9,999)</span>
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
            <span>(9,999)</span>
          </Link>
        </div>
        <div onClick={handleClickLogout} className="MenuWrap">
          <Link>
            <h3>🔑 로그아웃</h3>
            <span></span>
          </Link>
        </div>
        <div className="MenuWrap">
          <Link>
            <h3>🗑️ 회원탈퇴</h3>
            <span>(고객정보가 모두 삭제됩니다.)</span>
          </Link>
        </div>
      </div>
    </BasicLayoutPage>
  );
};

export default ReadPage;
