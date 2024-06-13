import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import BasicLayoutPage from "../../layouts/BasicLayoutPage";
import StudyBlockMy from "../../components/study/StudyBlockMy";
import { getList } from "../../api/studyAPI";
import "../../scss/partials/NonePage.scss";
import "../../scss/pages/MySTListPage.scss";
import InfiniteScroll from "react-infinite-scroll-component";

const MyStudyJoinPage = () => {
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [studyList, setStudyList] = useState([]);
  const loginState = useSelector((state) => state.loginSlice);
  const userEmail = loginState.email;

  // 페이지 로딩 시 주최한 스터디 모임 목록을 불러옴
  useEffect(() => {
    const loadInitialData = async () => {
      const data = await getList({ page: 1, size: 10 }, userEmail);
      if (data.list.length > 0) {
        setStudyList(data.list);
        setPage(2); // 다음 페이지 요청을 위해 2로 설정
        setHasMore(data.list.length === 10); // 데이터가 10개 미만이면 더 이상 불러올 데이터가 없음
      } else {
        setHasMore(false); // 최초 호출에 데이터가 없는 경우
      }
    };
    loadInitialData();
  }, []);

  const [items, setItems] = useState(Array.from({ length: 20 }));

  const fetchData = () => {
    getList({ page: page, size: 10 }, userEmail).then((data) => {
      if (data.list.length > 0) {
        setStudyList((prevList) => [...prevList, ...data.list]);
        setPage((prevPage) => prevPage + 1);
      } else {
        setHasMore(false); // 더 이상 불러올 데이터가 없음
      }
    });
  };

  return (
    <BasicLayoutPage headerTitle="참가 스터디">
      {/* 컨텐츠 없을 경우 */}
      {/* <div className="nonePage">
        <img src="../assets/imgs/icon/ic_none.png" />
        <h2>아직 참가한 스터디가 없어요</h2>
        <p>새로운 스터디에 참가해보세요</p>
      </div> */}
      <div className="myStListFilter">
        <button>모집중</button>
        <button>종료</button>
      </div>
      <div className="listContentWrap">
        <InfiniteScroll
          dataLength={studyList.length}
          next={fetchData}
          hasMore={hasMore}
          loader={<h4>Loading...</h4>}
        >
          {/* 스터디 목록을 출력 */}
          {studyList.map((study, index) => (
            <StudyBlockMy key={index} study={study} />
          ))}
        </InfiniteScroll>
      </div>
    </BasicLayoutPage>
  );
};

export default MyStudyJoinPage;
