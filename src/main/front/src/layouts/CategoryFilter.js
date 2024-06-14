import React from "react";
import "../scss/partials/CategoryFilter.scss";
import useCategories from "../hooks/useCategories";
import { API_SERVER_HOST } from "../api/memberAPI";
import { useDispatch, useSelector } from "react-redux";
import { setCategory } from "../slices/categorySlice";

const host = API_SERVER_HOST;

export default function CategoryFilter() {
  const categories = useCategories(host);
  const dispatch = useDispatch();

  // 셀렉터로 카테고리 가져오기
  const categoryFilter = useSelector((state) => state.categorySlice);
  const handleCategoryFilter = (e) => {
    // setCategoty 로 카테고리 변경하기
    dispatch(setCategory(e.target.dataset.value));
    console.log(categoryFilter);
  };

  return (
    <div className="filterWrap">
      <div className="filterContainer">
        <ul>
          <li onClick={handleCategoryFilter} data-value={"ALL"} className={categoryFilter.category === "ALL" ? "activeFilter" : ""}>
            전체
          </li>
          {Object.entries(categories).length > 0 &&
            Object.entries(categories).map(([key, value], index) => (
              <React.Fragment key={index}>
                <li onClick={handleCategoryFilter} data-value={key} className={categoryFilter.category === key ? "activeFilter" : ""}>
                  {value}
                </li>
              </React.Fragment>
            ))}
        </ul>
      </div>
    </div>
  );
}
