import React from "react";
import "../../scss/modal.css"; // 모달 스타일을 정의하는 CSS 파일

const Modal = ({ title, content, callbackFn }) => {
  const handleClose = () => {
    if (callbackFn) {
      callbackFn();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h5>{title}</h5>
        </div>
        <div className="modal-body">
          <p>{content}</p>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={handleClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
