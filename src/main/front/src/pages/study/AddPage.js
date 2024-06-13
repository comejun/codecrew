import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { postAdd } from "../../api/studyAPI";
import BasicLayoutPage from "../../layouts/BasicLayoutPage";
import "../../scss/pages/AddPage.scss";
import { API_SERVER_HOST } from "../../api/memberAPI";
import DaumPostcode from "react-daum-postcode";
import useCategories from "../../hooks/useCategories";
import useProfileImage from "../../hooks/useProfileImage";
import useCharacterCheck from "../../hooks/useCharactercheck";
import useCustomMove from "../../hooks/useCustomMove";
import { useParams } from "react-router-dom";

const { kakao } = window;

const host = API_SERVER_HOST;

// 스터디 저장값 초기화
const initState = {
  thImg: "",
  title: "",
  content: "",
  memberEmail: "",
  location: "",
  studyDate: "",
  studyDeadLineDate: 0,
  maxPeople: 2,
  category: "",
  locationX: "",
  locationY: "",
  studyMemberList: [],
};
const AddPage = () => {
  const { lat, lng } = useParams();

  useEffect(() => {
    const fetchAddress = async () => {
      let roadAddress = "";
      if (lat > 0 && lng > 0) {
        const geocoder = new kakao.maps.services.Geocoder();
        const result = await new Promise((resolve, reject) => {
          geocoder.coord2Address(lng, lat, function (result, status) {
            if (status === kakao.maps.services.Status.OK) {
              console.log(result);
              if (result[0].road_address === null) {
                roadAddress = result[0].address.address_name;
              } else {
                roadAddress = result[0].road_address.address_name;
              }
              setStudy((prevStudy) => ({
                ...prevStudy,
                location: roadAddress,
                locationX: lat,
                locationY: lng,
              }));
              resolve(result);
            } else {
              reject(status);
            }
          });
        });
      }
    };

    fetchAddress();
  }, []);

  // 전체 관심스택 가져오기
  const categories = useCategories(host);
  // 현재 로그인 된 회원의 이메일 가져오기
  const userEmail = useSelector((state) => state.loginSlice.email);
  // 사진 수정용 CustomHook 사용하기
  const { imgSrc, handleFileChange, saveFile } = useProfileImage(null, "http:");

  // 페이지 이동 관련 CustomHook 사용하기
  const { moveToMain } = useCustomMove();

  // 특수 문자 입력 관련 방지
  const { checkSpecialCharacters } = useCharacterCheck();

  //주소입력 모달
  const [modalState, setModalState] = useState(false);
  const [inputAddressValue, setInputAddressValue] = useState("");

  // 스터디 저장값 state
  const [study, setStudy] = useState(initState);

  // 모달 표시용
  const handleAddressSearchClick = () => {
    setModalState(true); // 모달을 표시하도록 상태 변경
  };

  // 모달 닫기용
  const onCompletePost = (data) => {
    setModalState(false); // 모달을 숨기도록 상태 변경
    setInputAddressValue(data.address); // 주소 값을 설정

    // study 객체의 location 필드를 업데이트합니다.
    setStudy((prevStudy) => ({
      ...prevStudy,
      location: data.address,
    }));
  };

  const handleChangeStudy = (e) => {
    study[e.target.name] = e.target.value;
    setStudy({ ...study });
    console.log(study);
  };

  // 주소-좌표 변환 함수
  const handleChangeLocation = async () => {
    let location = study.location;

    // 주소-좌표 변환 객체를 생성합니다
    let geocoder = new kakao.maps.services.Geocoder();

    // 주소로 좌표를 검색합니다
    await new Promise((resolve, reject) => {
      geocoder.addressSearch(location, function (result, status) {
        // 정상적으로 검색이 완료됐으면
        if (status === kakao.maps.services.Status.OK) {
          study.locationX = result[0].x;
          study.locationY = result[0].y;
          setStudy({ ...study });
          console.log(study);
          resolve();
        } else {
          reject(new Error("Failed to search address"));
        }
      });
    });
  };

  // 저장 버튼 클릭시 예외처리용 함수
  const handleClickAdd = (e) => {
    e.preventDefault(); // 이벤트의 기본 동작을 방지합니다.

    // 확인 처리
    if (imgSrc === null) {
      alert("이미지가 등록되지 않았습니다.");
      const imageDiv = document.querySelector(".StudyAddImg");
      imageDiv.setAttribute("tabindex", "0");
      imageDiv.focus();
      return; // 함수 실행을 여기서 중단합니다.
    }
    if (study.title === "") {
      alert("제목이 입력되지 않았습니다.");
      document.getElementsByName("title")[0].focus();
      return; // 함수 실행을 여기서 중단합니다.
    }
    if (study.location === "") {
      alert("위치정보가 입력되지 않았습니다.");
      document.getElementsByName("location")[0].focus();
      return; // 함수 실행을 여기서 중단합니다.
    }
    if (study.studyDate === "") {
      alert("참여날짜가 입력되지 않았습니다.");
      document.getElementsByName("studyDate")[0].focus();
      return; // 함수 실행을 여기서 중단합니다.
    }
    // 참여 날짜가 현재시간으로 부터 24시간이후 보다 전이면 중단
    if (new Date(study.studyDate).getTime() < new Date().getTime() + 86400000) {
      alert("참여날짜는 현재시간으로부터 24시간 이후로 설정해주세요.");
      document.getElementsByName("studyDate")[0].focus();
      return;
    }
    if (study.category === "카테고리 선택" || study.category === "") {
      alert("카테고리가 입력되지 않았습니다.");
      document.getElementsByName("category")[0].focus();
      return; // 함수 실행을 여기서 중단합니다.
    }
    if (study.content === "") {
      alert("소개글이 입력되지 않았습니다.");
      document.getElementsByName("content")[0].focus();
      return; // 함수 실행을 여기서 중단합니다.
    }
    if (study.studyDeadLineDate === 0) {
      alert("모집 마감 날짜가 입력되지 않았습니다.");
      document.getElementsByName("studyDeadLineDate")[0].focus();
      return; // 함수 실행을 여기서 중단합니다.
    }

    saveAdd();
  };

  // 입력값 예외 처리 후 실제 저장 함수
  const saveAdd = async () => {
    await handleChangeLocation();

    study.thImg = await saveFile();

    const formData = new FormData();
    formData.append("thImg", study.thImg);
    formData.append("title", study.title);
    formData.append("content", study.content);
    formData.append("memberEmail", userEmail);
    formData.append("location", study.location);
    formData.append("strStudyDate", study.studyDate);
    formData.append("strStudyDeadlineDate", study.studyDeadLineDate);
    formData.append("maxPeople", parseInt(study.maxPeople) - 1);
    formData.append("category", study.category);
    formData.append("locationX", study.locationX);
    formData.append("locationY", study.locationY);
    console.log(formData);

    // 여기에 서버로 데이터를 전송하는 코드를 추가합니다.
    postAdd(formData).then((data) => {
      console.log("postAdd result : ", data);
      alert("저장완료");
      moveToMain();
    });
  };

  // 타이핑 체크
  const [titleLength, setTitleLength] = useState(0);
  const [contentLength, setContentLength] = useState(0);

  const handleTitleChange = (e) => {
    const inputLenght = e.target.value.length;
    if (inputLenght <= 24) {
      handleChangeStudy(e);
      setTitleLength(inputLenght);
    }
  };

  const handleContentChange = (e) => {
    const inputLenght = e.target.value.length;
    if (inputLenght <= 200) {
      handleChangeStudy(e);
      setContentLength(inputLenght);
    }
  };

  const renderStudyDeadLineDate = () => {
    if (study.studyDate === "") {
      return (
        <select disabled>
          <option>참여날짜를 먼저 입력해주세요.</option>
        </select>
      );
    } else {
      return (
        <select
          id="studyDeadLineDate"
          name="studyDeadLineDate"
          value={study.studyDeadLineDate}
          onChange={handleChangeStudy}
          style={{ backgroundColor: "rgba(0, 0, 0, 0)" }}
        >
          {calculateDeadLineDate()}
        </select>
      );
    }
  };

  const calculateDeadLineDate = () => {
    // studyDate에서 10일 전까지 날짜중 현재 날짜보다 이후의 날짜에 모집 마감 날짜를 설정할 수 있도록 합니다.
    const studyDate = new Date(study.studyDate);
    const currentDate = new Date();

    const deadLineDate = [];
    for (let i = 1; i <= 10; i++) {
      const date = new Date(studyDate.getTime() - 86400000 * i);
      // 현재 날짜보다 24시간 이후의 날짜만 선택할 수 있도록 합니다.
      if (date.getTime() > currentDate.getTime() + 86400000) {
        deadLineDate.push(
          <option key={i} value={date.getTime()}>
            {date.toLocaleDateString()}
          </option>,
        );
      }
    }
    return deadLineDate;
  };

  return (
    <>
      {/* 모달창입니다. */}
      {modalState && (
        <div
          style={{
            position: "fixed",
            zIndex: "99999",
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
          onClick={() => onCompletePost({ address: "" })}
        >
          <div
            style={{
              width: "100vw",
              maxWidth: "400px",
              minWidth: "320px",
              margin: "0 auto",
              marginTop: "20vh",
            }}
          >
            <DaumPostcode onComplete={onCompletePost} />
          </div>
        </div>
      )}
      {/* 모달창입니다. */}
      <BasicLayoutPage headerTitle="스터디추가">
        <form>
          <div className="StudyAddWrap">
            <div
              className="StudyAddImg"
              style={{ backgroundImage: `url(${imgSrc})` }}
            >
              <label htmlFor="fileInput">
                추가
                <input id="fileInput" type="file" onChange={handleFileChange} />
              </label>
            </div>
            <div>
              <h3>스터디명</h3>
              <input
                name="title"
                value={study.title}
                maxLength={24}
                type="text"
                placeholder="스터디명을 입력해주세요."
                onKeyUp={checkSpecialCharacters}
                onKeyDown={checkSpecialCharacters}
                onChange={handleTitleChange}
              />
              <span
                style={{
                  color: "#dcdcdc",
                  fontSize: "12px",
                  textAlign: "right",
                  display: "block",
                }}
              >
                {titleLength} / 24
              </span>
            </div>
            <div onClick={lat ? () => {} : handleAddressSearchClick}>
              <h3>주소</h3>
              <input
                name="location"
                type="text"
                value={study.location}
                placeholder="주소를 입력해주세요."
                readOnly
              />

              <img
                className="AdressSearch"
                src={
                  process.env.PUBLIC_URL + "/assets/imgs/icon/ic_serch_gr.svg"
                }
                alt="searchIcon"
              />
            </div>
            <div className="reWrap">
              <h3>참여날짜</h3>
              <input
                id="studyDate"
                name="studyDate"
                value={study.studyDate}
                type="datetime-local"
                placeholder="참여일을 입력해주세요."
                onChange={handleChangeStudy}
                min={new Date().toISOString().substring(0, 16)}
                max={new Date(new Date().getTime() + 12096e5)
                  .toISOString()
                  .substring(0, 16)}
              />
            </div>
            <div>
              <h3>모집 마감 날짜</h3>
              {renderStudyDeadLineDate()}
            </div>
            <div>
              <h3>참여인원</h3>
              <select
                id="maxPeople"
                name="maxPeople"
                value={study.maxPeople}
                onChange={handleChangeStudy}
                style={{ backgroundColor: "rgba(0, 0, 0, 0)" }}
              >
                {Array.from({ length: 9 }, (_, index) => (
                  <option key={index} value={index + 2}>
                    {index + 2}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <h3>카테고리</h3>
              <select
                id="category"
                name="category"
                value={study.category}
                onChange={handleChangeStudy}
              >
                <option hidden>카테고리 선택</option>
                {Object.entries(categories).length > 0 &&
                  Object.entries(categories).map(([key, value], index) => (
                    <React.Fragment key={index}>
                      <option id={key} value={key}>
                        {value}
                      </option>
                    </React.Fragment>
                  ))}
              </select>
            </div>
            <div>
              <h3>스터디 소개</h3>
              <textarea
                name="content"
                value={study.content}
                maxLength={200}
                placeholder="스터디소개를 입력해주세요."
                onChange={handleContentChange}
                onKeyUp={checkSpecialCharacters}
                onKeyDown={checkSpecialCharacters}
              ></textarea>
              <span
                style={{
                  color: "#dcdcdc",
                  fontSize: "12px",
                  textAlign: "right",
                  display: "block",
                }}
              >
                {contentLength} / 200
              </span>
            </div>
          </div>
          <div className="bottomBtnWrap">
            <button onClick={handleClickAdd} className="btnLargePoint">
              스터디추가
            </button>
          </div>
        </form>
      </BasicLayoutPage>
    </>
  );
};

export default AddPage;
