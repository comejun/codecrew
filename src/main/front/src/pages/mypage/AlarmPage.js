import React, { useEffect, useState } from "react";
import "../../scss/pages/AlarmPage.scss";
import "../../scss/partials/NonePage.scss";
import BasicLayoutPage from "../../layouts/BasicLayoutPage";
import AlarmBlock from "../../components/study/AlarmBlock";
import { useSelector } from "react-redux";
import { getNoticeList } from "../../api/noticeAPI";
import InfiniteScroll from "react-infinite-scroll-component";

const AlarmPage = () => {
  // 현재 로그인 된 회원의 이메일 가져오기
  const loginState = useSelector((state) => state.loginSlice);
  const userEmail = loginState.email;
  const [refresh, setRefresh] = useState(false);
  const reRender = () => {
    setRefresh(!refresh);
  };
  const [items, setItems] = useState(Array.from({ length: 20 }));
  const [noticeList, setNoticeList] = useState(null);

  // 페이지 로딩시 알림 목록 가져오기
  useEffect(() => {
    const loadInitialData = async () => {
      const data = await getNoticeList(userEmail);
      console.log(data);
      setNoticeList(data);
    };
    loadInitialData();
  }, [refresh]);

  return (
    <BasicLayoutPage headerTitle="알림">
      {noticeList === null ? (
        <div className="nonePage">
          <img src="../assets/imgs/icon/ic_none.png" />
          <h2>아직 도착한 알림이 없어요</h2>
          <p>새로운 소식이 도착하면 알려드릴께요.</p>
        </div>
      ) : (
        <InfiniteScroll
          dataLength={items.length}
          next={() => {}}
          hasMore={false}
          loader={<h4>Loading...</h4>}
        >
          {noticeList.map((notice, index) => (
            <AlarmBlock key={index} notice={notice} refresh={reRender} />
          ))}
        </InfiniteScroll>
      )}
    </BasicLayoutPage>
  );
};

export default AlarmPage;
