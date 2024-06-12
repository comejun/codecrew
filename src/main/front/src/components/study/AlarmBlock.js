import React from "react";
import "../../scss/partials/AlarmBlock.scss";
import useNoticeText from "../../hooks/useNoticeText";
import { deleteNotice } from "../../api/noticeAPI";
import { useSelector } from "react-redux";
const AlarmBlock = ({ notice, refresh }) => {
  console.log(notice);
  const loginState = useSelector((state) => state.loginSlice);
  const userEmail = loginState.email;

  const handleDeleteClick = async () => {
    try {
      await deleteNotice(notice.noticeId, userEmail);
      refresh(); // 알림 목록을 다시 불러옵니다.
    } catch (error) {
      console.error("Failed to delete notice:", error);
    }
  };

  return (
    // 이동 추가
    <div className="AlBlockWrap">
      <div className="AlBlockImg"></div>
      <div className="AlBlockTitle">
        {useNoticeText(notice)}
        <p>{notice.createdDate}</p>
      </div>
      <div className="AlBlockBtn">
        <button onClick={handleDeleteClick}>
          <img src="/assets/imgs/icon/ic_del.png" alt="Delete" />
        </button>
      </div>
    </div>
  );
};
export default AlarmBlock;
