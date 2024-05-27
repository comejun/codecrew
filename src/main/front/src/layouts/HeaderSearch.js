import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../scss/partials/header.scss";

export default function HeaderSearch() {
  const navigate = useNavigate();

  // 뒤로가기 버튼
  const onclickBtn = () => {
    navigate(-1);
  };

  // 검색창 길이제한
  const handleInput = (e) => {
    if (e.target.value.length > e.target.maxLength) {
      alert("입력한 텍스트가 너무 깁니다. 20자 이내로 입력해주세요.");
    }
  };

  // 검색 버튼
  const searchBtn = () => {};

  return (
    <header>
      <div className="headerWrap">
        {/* 검색페이지 헤더 */}
        <div className="headerBackContnent">
          <div onClick={onclickBtn}>
            <img src="../assets/imgs/icon/ic_ar_bk.svg" alt="backBtn" height="36px" />
          </div>
        </div>
        <div className="headerSearchContent">
          <input type="text" name="search" maxlength="20" placeholder="검색어를 입력해주세요." onInput={handleInput} />
          <img src="../assets/imgs/icon/ic_serch_gr.svg" onClick={searchBtn} />
        </div>
      </div>
    </header>
  );
}
// http://192.168.219.101:3000
//http://localhost:3000/
