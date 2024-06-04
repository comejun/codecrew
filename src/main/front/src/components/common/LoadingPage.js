import React from "react";
import BasicLayout from "../../layouts/BasicLayout";

const LoadingPage = () => {
  const outerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh", // 전체 뷰포트 높이
    width: "100vw", // 전체 뷰포트 넓이
  };

  const innerStyle = {
    maxWidth: "500px",
    fontSize: "18px",
    textAlign: "center", // 텍스트 중앙 정렬
  };

  const imageStyle = {
    marginTop: "36px",
    maxWidth: "280px",
    Width: "100%", // 부모 요소의 최대 너비에 맞춤
    marginBottom: "36px",
  };

  return (
    <div style={outerStyle}>
      <div style={innerStyle}>
        <h4>로딩 중..</h4>
        {/*TODO 로딩 이미지 변경 */}
        <img
          style={imageStyle}
          src={process.env.PUBLIC_URL + "/assets/imgs/spinner.gif"}
          alt="loading"
        />
      </div>
    </div>
  );
};

export default LoadingPage;
