import React, { useEffect, useState } from "react";
import BasicLayoutList from "../../layouts/BasicLayoutList";
import "../../scss/pages/listPage.scss";
import StudyBlock from "../../components/study/StudyBlock";
import { useSelector, useDispatch } from "react-redux";
import {
  getStudyLocationList,
  setMyLocation,
  sortStudyLocationList,
} from "../../slices/categorySlice";
import InfiniteScroll from "react-infinite-scroll-component";

const ListPage = () => {
  // 셀렉터로 카테고리 필터링 데이터 가져오기
  const categoryFilter = useSelector((state) => state.categorySlice.category);
  const studyLocationList = useSelector(
    (state) => state.categorySlice.studyLocationList,
  );
  const myLocation = useSelector((state) => state.categorySlice.myLocation);
  const dispatch = useDispatch();
  const stduyLocationList = useSelector(
    (state) => state.categorySlice.studyLocationList,
  );
  // 카테고리 필터링데이터 가져오기
  useEffect(() => {
    dispatch(getStudyLocationList(categoryFilter)).then(() => {
      console.log("studyLocationList 가져오기");
    });
  }, [categoryFilter]);

  const [items, setItems] = useState(Array.from({ length: 20 }));

  // 현재 위치를 설정하고, 위치가 설정된 후에 스터디 위치 목록을 정렬합니다.
  useEffect(() => {
    console.log("위치정보 받아오기");

    dispatch(setMyLocation()).then(() => {
      // console.log("거리순 정렬");
      // dispatch(sortStudyLocationList());
    });
  }, [dispatch]);

  // studyLocationList가 변경되면 거리순 정렬
  useEffect(() => {
    console.log("거리순 정렬");
    dispatch(sortStudyLocationList());
  }, [studyLocationList]);

  return (
    <BasicLayoutList>
      <div className="listContentWrap">
        <InfiniteScroll
          dataLength={items.length}
          next={() => {}}
          hasMore={false}
          loader={<h4>Loading...</h4>}
        >
          {studyLocationList.map((studyLocation, index) => (
            <StudyBlock key={index} studyLocation={studyLocation} />
          ))}
        </InfiniteScroll>
      </div>
    </BasicLayoutList>
  );
};

export default ListPage;
