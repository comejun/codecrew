import React, { useState } from "react";
import "../scss/partials/header.scss";
import CategoryFilterList from "./CategoryFilterList";
import useCustomMove from "../hooks/useCustomMove";
import { useDispatch } from "react-redux";
import { filterStudyLocationList } from "../slices/categorySlice";

export default function HeaderList() {
  const { moveToMain } = useCustomMove();
  const dispatch = useDispatch();
  const [searchText, setSearchText] = useState("");

  // 뒤로가기 버튼
  const onclickBtn = () => {
    moveToMain();
  };

  // 검색창 길이제한
  const handleInput = (e) => {
    if (e.target.value.length > e.target.maxLength) {
      alert("입력한 텍스트가 너무 깁니다. 20자 이내로 입력해주세요.");
    } else {
      setSearchText(e.target.value);
    }
  };

  // 검색 버튼
  const searchFromList = () => {
    dispatch(filterStudyLocationList(searchText));
  };

  return (
    <header>
      <div className="headerWrapList">
        {/* 검색페이지 헤더 */}
        <div className="headerBackContnent">
          <div onClick={onclickBtn}>
            <img
              src="../assets/imgs/icon/ic_map.svg"
              alt="backBtn"
              height="36px"
            />
          </div>
        </div>
        <div className="headerSearchContent">
          <input
            type="text"
            name="search"
            maxLength="20"
            placeholder="검색어를 입력해주세요."
            onInput={handleInput}
          />
          <img
            src={process.env.PUBLIC_URL + "/assets/imgs/icon/ic_serch_gr.svg"}
            onClick={searchFromList}
          />
        </div>
      </div>
      <CategoryFilterList />
    </header>
  );
}
