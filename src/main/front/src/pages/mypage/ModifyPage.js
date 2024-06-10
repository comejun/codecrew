import React, { useEffect, useState } from "react";
import BasicLayoutPage from "../../layouts/BasicLayoutPage";
import "../../scss/pages/MyModifyPage.scss";
import { useSelector } from "react-redux";
import { API_SERVER_HOST, modifyMember } from "../../api/memberAPI";
import useCustomLogin from "../../hooks/useCustomLogin";
import useCustomMove from "../../hooks/useCustomMove";
import { checkPhone } from "../../api/checkAPI";
import useMemberProfile from "../../hooks/useMemberProfile";
import useCategories from "../../hooks/useCategories";
import useProfileImage from "../../hooks/useProfileImage";
import useCharacterCheck from "../../hooks/useCharactercheck";
import Modal from "../../components/common/Modal";

const host = API_SERVER_HOST;

const ModifyPage = () => {
  // 이동 관련 CustomHook 사용하기
  const { moveToMypage } = useCustomMove();

  // 현재 로그인 된 회원의 이메일 가져오기
  const userEmail = useSelector((state) => state.loginSlice.email);

  // 수정이 필요한 회원 정보 가져오기
  const [member, setMember] = useState({});
  const memberProfile = useMemberProfile(userEmail).member;
  const memberProfileImg = useMemberProfile(userEmail).imgSrc;

  // 모달창 위한 state 생성
  const [result, setResult] = useState(null);

  useEffect(() => {
    setMember(memberProfile);
  }, [memberProfile]);

  // 사진 수정용 CustomHook 사용하기
  const { imgSrc, handleFileChange, saveFile } = useProfileImage(memberProfileImg, memberProfile.profileImg);

  // 전체 관심스택 가져오기
  const categories = useCategories(host);

  // 입력관련 방지 함수
  const { checkSpecialCharacters, checkNumericInput } = useCharacterCheck();

  const { exceptionHandle } = useCustomLogin();

  const handleChange = (e) => {
    member[e.target.name] = e.target.value;
    setMember({ ...member });
    console.log(member);
  };
  const handleCheckChange = (e) => {
    console.log(member.favoriteList);
    let newFavorite = [...member.favoriteList];
    if (newFavorite.includes(e.target.id)) {
      newFavorite = newFavorite.filter((item) => item !== e.target.id);
    } else {
      newFavorite.push(e.target.id);
    }
    member.favoriteList = newFavorite;
    setMember({ ...member });
  };

  // 저장 클릭시 입력값 예외 처리용 함수
  const handleClickModify = (e) => {
    e.preventDefault(); // 이벤트의 기본 동작을 방지합니다.

    // 닉네임 입력 안했을 때
    if (member.nickname === "") {
      alert("닉네임을 입력해주세요.");
      return;
    }
    // 닉네임 입력 안했을 때
    if (member.nickname === "SocialMember") {
      alert("닉네임을 변경해주세요.");
      return;
    }
    // 연락처 중복 확인 함수
    // 아무것도 입력이 안되어있을 때
    if (member.phone === "" || member.phone === null) {
      saveModify();
    }
    // 11자리가 아닐 때
    else if (member.phone.length < 11) {
      alert("연락처를 11자리로 입력해주세요.");
      return;
    }
    // 010으로 시작하지 않을 때
    else if (!member.phone.startsWith("01")) {
      alert("올바른 연락처 형식을 입력해주세요.");
      return;
    } else {
      checkPhone(member.phone)
        .then((res) => {
          console.log(res);
          if (res === userEmail || res === "not exist") {
            saveModify();
          } else {
            alert("이미 등록된 연락처입니다.");
          }
        })
        .catch((err) => exceptionHandle(err));
    }
  };

  // 입력값 예외 처리후 실제 회원 정보 실제 저장 하는 함수
  const saveModify = async () => {
    if (!imgSrc.includes(member.profileImg)) {
      member.profileImg = await saveFile();
    }

    try {
      const res = await modifyMember(member);
      console.log(res);
      setResult("수정 완료");
    } catch (err) {
      exceptionHandle(err);
    }
    // moveToMypage();
  };

  const closeModal = () => {
    setResult(null);
    moveToMypage();
  };

  // 사용자 소개 글자 수 상태
  const [nicknameLength, setNicknameLength] = useState(0);
  const [introductionLength, setIntroductionLength] = useState(0);

  // 닉네임 변경 핸들러
  const handleNicknameChange = (e) => {
    const inputLength = e.target.value.length;
    if (inputLength <= 20) {
      handleChange(e); // 원래의 handleChange 함수 호출
      setNicknameLength(inputLength); // 글자 수 상태 업데이트
    }
  };

  // 사용자 소개 변경 핸들러
  const handleIntroductionChange = (e) => {
    const inputLength = e.target.value.length;
    if (inputLength <= 2000) {
      handleChange(e); // 원래의 handleChange 함수 호출
      setIntroductionLength(inputLength); // 글자 수 상태 업데이트
    }
  };

  return (
  <>
        {result && (
          <Modal title={"회원정보"} content={result} callbackFn={closeModal} />
        )}
    <BasicLayoutPage headerTitle="정보수정">
      <form>
        <div className="MyModifyWrap">
          <div className="MyModifyImg" style={member.profileImg !== "" ? { backgroundImage: `url(${imgSrc})` } : null}>
            <label htmlFor="fileInput">
              편집
              <input id="fileInput" type="file" onChange={handleFileChange} />
            </label>
          </div>
          <div>
            <h3>닉네임</h3>
            <input
              type="text"
              name="nickname"
              maxLength={20}
              value={member.nickname}
              onKeyUp={checkSpecialCharacters}
              onKeyDown={checkSpecialCharacters}
              onChange={handleNicknameChange}
              placeholder="닉네임을 입력해주세요."
            />
            <span style={{ color: "#dcdcdc", fontSize: "12px", textAlign: "right", display: "block" }}>{nicknameLength} / 20</span>
          </div>
          <div>
            <h3>관심스택</h3>
            <div className="checkboxWrap">
              {Object.entries(categories).length > 0 &&
                Object.entries(categories).map(([key, value], index) => (
                  <React.Fragment key={index}>
                    <input onChange={handleCheckChange} id={key} type="checkbox" checked={member.favoriteList.includes(key)} />
                    <label htmlFor={key}>{value}</label>
                  </React.Fragment>
                ))}
            </div>
          </div>
          <div>
            {/*TODO 연락처 중복 방지 기능 추가*/}
            <h3>연락처</h3>
            <input
              type="text"
              placeholder="입력예시 : 01098761234"
              maxLength={11}
              name="phone"
              value={member.phone}
              onKeyUp={checkNumericInput}
              onKeyDown={checkNumericInput}
              onChange={handleChange}
            />
          </div>
          <div>
            <h3>링크</h3>
            <input type="text" name="memberLink" value={member.memberLink} onChange={handleChange} placeholder="입력예시 : www.example.com" />
          </div>
          <div>
            <h3>사용자 소개</h3>
            <textarea
              placeholder="사용자소개를 입력해주세요."
              name="introduction"
              value={member.introduction}
              maxLength={200}
              onChange={handleIntroductionChange}
              onKeyUp={checkSpecialCharacters}
              onKeyDown={checkSpecialCharacters}
            ></textarea>
            <span style={{ color: "#dcdcdc", fontSize: "12px", textAlign: "right", display: "block" }}>{introductionLength} / 200</span>
          </div>
        </div>
      </form>
      <div className="MyModifyBtn">
        <button onClick={handleClickModify} className="btnLargePoint">
          저장
        </button>
      </div>
    </BasicLayoutPage>
    </>
  );
};

export default ModifyPage;
