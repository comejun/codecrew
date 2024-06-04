import "../scss/partials/button.scss";
import "../scss/pages/AboutPage.css";
import useCustomMove from "../hooks/useCustomMove";

const AboutPage = () => {
  const { moveToMain } = useCustomMove();
  const onclickBtn = () => {
    moveToMain();
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column", // 수직 방향으로 정렬
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <img
          src={process.env.PUBLIC_URL + "/assets/imgs/icon/about.png"}
          alt="about"
          style={{
            width: "100%", // 이미지의 너비를 부모 요소에 맞춰 전체 너비로 설정
            height: "auto", // 이미지의 높이를 자동으로 설정하여 비율 유지
          }}
        />
        <div onClick={onclickBtn}>
          <button className="btnAboutLargePoint">메인으로 가기</button>
        </div>
      </div>
    </>
  );
};

export default AboutPage;
