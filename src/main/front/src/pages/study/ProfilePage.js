import React from "react";
import "../../scss/pages/MyReadPage.scss";
import BasicLayoutPage from "../../layouts/BasicLayoutPage";
import useMemberProfile from "../../hooks/useMemberProfile";
import { API_SERVER_HOST } from "../../api/memberAPI";
import useCategories from "../../hooks/useCategories";
import { useParams } from "react-router-dom";

const host = API_SERVER_HOST;

const ProfilePage = () => {
  const { email } = useParams();
  // 수정이 필요없는 조회용 회원 정보 가져오기
  const { member, imgSrc } = useMemberProfile(email);
  // 전체 관심스택 가져오기
  const categories = useCategories(host);

  return (
    <BasicLayoutPage headerTitle="프로필">
      <div>
        <div className="MyBlockWrap">
          <div className="MyReadImg" style={imgSrc !== "" ? { backgroundImage: `url(${imgSrc})` } : null}></div>
          <div className="MyReadTitle">
            <h3>{member.nickname}</h3>
            <p>{member.email}</p>
          </div>
          <div className="MyReadBtn"></div>
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
          {member.introduction ? (
            <p>{member.introduction}</p>
          ) : (
            <p>
              안녕하세요. 크루 여러분 <br />
              {member.nickname}입니다.
            </p>
          )}
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
      <div className="myFooter">
        <span>Copyright © 2024 Codecrew. All rights reserved.</span>
      </div>
    </BasicLayoutPage>
  );
};

export default ProfilePage;
