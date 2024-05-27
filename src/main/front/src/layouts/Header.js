import React from "react";
import { Link } from "react-router-dom";
import "../scss/partials/header.scss";
import CategoryFilter from "./CategoryFilter";

export default function Header() {
  return (
    <header>
      <div className="headerWrap headerShadow">
        {/* 메인페이지 헤더 */}
        <div className="headerLogoContent">
          <Link to="/">
            <img src="../assets/imgs/logo.png" alt="logo" height="17px" />
          </Link>
        </div>
        <div className="headerNavContent">
          <Link to="/search">
            <img src="../assets/imgs/icon/ic_serch_bk.svg" alt="searchIcon" />
          </Link>
          <Link to="/list">
            <img src="../assets/imgs/icon/ic_li_bk.svg" alt="listIcon" />
          </Link>
        </div>
      </div>
      <CategoryFilter />
    </header>
  );
}
