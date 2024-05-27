import React, { useState } from "react";
import BasicLayoutPage from "../../layouts/BasicLayoutPage";
import "../../scss/pages/MyModifyPage.scss";

const ModifyPage = () => {
  const [imgSrc, setImgSrc] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImgSrc(URL.createObjectURL(file));
    }
  };

  return (
    <BasicLayoutPage headerTitle="정보수정">
      <form>
        <div className="MyModifyWrap">
          <div className="MyModifyImg" style={{ backgroundImage: `url(${imgSrc})` }}>
            <label htmlFor="fileInput">
              편집
              <input id="fileInput" type="file" onChange={handleFileChange} />
            </label>
          </div>
          <div>
            <h3>닉네임</h3>
            <input type="text" placeholder="닉네임을 입력해주세요." />
          </div>
          <div>
            <h3>관심스택</h3>
            <div className="checkboxWrap">
              <input id="check1" type="checkbox" />
              <label htmlFor="check1">웹개발</label>
              <input id="check2" type="checkbox" />
              <label htmlFor="check2">프론트엔드</label>
            </div>
          </div>
          <div>
            <h3>링크</h3>
            <input type="text" placeholder="링크를 입력해주세요." />
          </div>
          <div>
            <h3>사용자 소개</h3>
            <textarea placeholder="사용자소개를 입력해주세요."></textarea>
          </div>
          <div className="MyModifyBtn">
            <button className="btnLargePoint">저장</button>
          </div>
        </div>
      </form>
    </BasicLayoutPage>
  );
};

export default ModifyPage;
