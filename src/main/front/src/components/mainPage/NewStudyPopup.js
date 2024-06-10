import React from "react";
import useCustomMove from "../../hooks/useCustomMove";

const NewStudyPopup = ({ overlayState, changeOverlayState }) => {
  const { moveToAddPageWithData } = useCustomMove();

  return (
    <div
      className="addPopupWrap"
      onClick={() => {
        changeOverlayState(0, 0, false);
      }}
    >
      <div className="stPopupWrap popupActive">
        {/* 닫기버튼 */}
        <img
          className="stPopupClose"
          onClick={() => {
            changeOverlayState(0, 0, false);
          }}
          src="/assets/imgs/icon/ic_popup_cl.svg"
          alt="닫기버튼"
        />
        {/* 컨텐츠 */}
        <div className="stPopupContentBottom">
          <h3 className="addPopuph3">🧑🏻‍💻 스터디 추가</h3>
          <p className="addPopupp">해당 위치에 스터디를 추가하시겠습니까?</p>
        </div>
        <div className="stPopupContentButton addPopupBtn">
          <button
            className="btnLargePoint"
            onClick={() => {
              moveToAddPageWithData(overlayState.lat, overlayState.lng);
            }}
          >
            예
          </button>
          <button
            className="btnLargePointLine"
            onClick={() => {
              changeOverlayState(0, 0, false);
            }}
          >
            아니요
          </button>
        </div>
      </div>
    </div>
  );
};
export default NewStudyPopup;
