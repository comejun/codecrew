import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import BasicLayoutPage from "../../layouts/BasicLayoutPage";
import StudyBlockMy from "../../components/study/StudyBlockMy";
import { getList } from "../../api/studyAPI";
import "../../scss/partials/NonePage.scss";
import "../../scss/pages/MySTListPage.scss";
import InfiniteScroll from "react-infinite-scroll-component";

const MyStudyJoinPage = () => {
  const [studies, setStudies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const email = "user@example.com"; // 실제 이메일을 사용

  useEffect(() => {
    fetch(`/api/study/memberList/${email}`)
      .then((response) => response.json())
      .then((data) => {
        setStudies(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching studies:", error);
        setIsLoading(false);
      });
  }, [email]);

  return (
    <BasicLayoutPage headerTitle="참가 스터디">
      {isLoading ? (
        <p>Loading...</p>
      ) : studies.length === 0 ? (
        <div className="nonePage">
          <img src="../assets/imgs/icon/ic_none.png" alt="No Studies" />
          <h2>아직 참가한 스터디가 없어요</h2>
          <p>새로운 스터디에 참가해보세요</p>
        </div>
      ) : (
        <>
          <div className="myStListFilter">
            <button>모집중</button>
            <button>종료</button>
          </div>
          <div className="listContentWrap">
            {studies.map((study) => (
              <div key={study.id} className="studyCard">
                <h3>{study.title}</h3>
                <p>{study.content}</p>
                <p>Location: {study.location}</p>
                <p>Date: {new Date(study.studyDate).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </BasicLayoutPage>
  );
};

export default MyStudyJoinPage;
