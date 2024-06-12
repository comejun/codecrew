import React from "react";

// 알람 종류에 따라 알람 텍스트를 반환하는 함수

const UseNoticeText = (notice) => {
  // 알람 종류 확인
  const noticeTypeCheck = (notice) => {
    // 스터디 삭제 알람
    if (notice.noticeType === "STUDY_DELETE") {
      return renderStudyDeleteNoticeText(notice);
    }
    // 스터디 수정 알람
    else if (notice.noticeType === "STUDY_MODIFY") {
      return renderStudyModifyNoticeText(notice);
    }
    // 스터디 참가신청 알람
    else if (notice.noticeType === "STUDY_PARTICIPATION") {
      return renderStudyParticipationNoticeText(notice);
    }
    // 스터디 탈퇴 알람
    else if (notice.noticeType === "STUDY_WITHDRAWAL") {
      return renderStudyWithdrawalNoticeText(notice);
    }
    // 스터디 참가승인 알람
    else if (notice.noticeType === "STUDY_APPROVAL") {
      return renderStudyApprovalNoticeText(notice);
    }
    // 스터디 참가거절 알람
    else if (notice.noticeType === "STUDY_REJECTION") {
      return renderStudyRejectionNoticeText(notice);
    }
    // 스터디 시작 알람
    else if (notice.noticeType === "STUDY_START") {
      return renderStudyStartNoticeText(notice);
    }
    // 스터디 종료 알람
    else if (notice.noticeType === "STUDY_END") {
      return renderStudyEndNoticeText(notice);
    }
    // 참가일 1일전 알람
    else if (notice.noticeType === "PRE_PARTICIPATION_DATE") {
      return renderPreParticipationDateNoticeText(notice);
    }
    // 참가일 당일 알람
    else if (notice.noticeType === "PARTICIPATION_DATE") {
      return renderParticipationDateNoticeText(notice);
    }
    // 장소 도착 알람
    else if (notice.noticeType === "LOCATION_ARRIVAL") {
      return renderLocationArrivalNoticeText(notice);
    }
    // 출석 완료 알람
    else if (notice.noticeType === "ATTENDANCE_COMPLETE") {
      return renderAttendanceCompleteNoticeText(notice);
    }
    // 지각 알람
    else if (notice.noticeType === "TARDINESS") {
      return renderTardinessNoticeText(notice);
    }
    // 결석 알람
    else if (notice.noticeType === "ABSENCE") {
      return renderAbsenceNoticeText(notice);
    }
    // 회원 정지 알람
    else if (notice.noticeType === "BLACK_USER") {
      return renderBlackUserNoticeText(notice);
    }
  };

  // 스터디 삭제 알람 텍스트
  const renderStudyDeleteNoticeText = (notice) => {
    return <h3>{notice.studyTitle}가 삭제 되었습니다.</h3>;
  };

  // 스터디 수정 알람 텍스트
  const renderStudyModifyNoticeText = (notice) => {
    return <h3>{notice.studyTitle}가 수정 되었습니다.</h3>;
  };

  // 스터디 참가신청 알람 텍스트
  const renderStudyParticipationNoticeText = (notice) => {
    return (
      <h3>
        {notice.memberNickname} 님이 {notice.studyTitle}에 참가 신청 하였습니다.
      </h3>
    );
  };

  // 스터디 탈퇴 알람 텍스트
  const renderStudyWithdrawalNoticeText = (notice) => {
    return <h3>{notice.studyTitle}에서 탈퇴 하였습니다.</h3>;
  };

  // 스터디 참가승인 알람 텍스트
  const renderStudyApprovalNoticeText = (notice) => {
    return <h3>{notice.studyTitle} 참가 신청이 승인 되었습니다.</h3>;
  };

  // 스터디 참가거절 알람 텍스트
  const renderStudyRejectionNoticeText = (notice) => {
    return <h3>{notice.studyTitle} 참가 신청이 거절 되었습니다.</h3>;
  };

  // 스터디 시작 알람 텍스트
  const renderStudyStartNoticeText = (notice) => {
    return <h3>{notice.studyTitle}가 시작 되었습니다.</h3>;
  };

  // 스터디 종료 알람 텍스트
  const renderStudyEndNoticeText = (notice) => {
    return <h3>{notice.studyTitle}가 종료 되었습니다.</h3>;
  };

  // 참가일 1일전 알람 텍스트
  const renderPreParticipationDateNoticeText = (notice) => {
    return <h3>{notice.studyTitle} 참가일이 1일 남았습니다.</h3>;
  };

  // 참가일 당일 알람 텍스트
  const renderParticipationDateNoticeText = (notice) => {
    return <h3>{notice.studyTitle} 참가일이 오늘 입니다.</h3>;
  };

  // 장소 도착 알람 텍스트
  const renderLocationArrivalNoticeText = (notice) => {
    return <h3>{notice.studyTitle} 장소에 도착 하였습니다.</h3>;
  };

  // 출석 완료 알람 텍스트
  const renderAttendanceCompleteNoticeText = (notice) => {
    return <h3>{notice.studyTitle} 출석이 완료 되었습니다.</h3>;
  };

  // 지각 알람 텍스트
  const renderTardinessNoticeText = (notice) => {
    return <h3>{notice.studyTitle} 지각 하였습니다.</h3>;
  };

  // 결석 알람 텍스트
  const renderAbsenceNoticeText = (notice) => {
    return <h3>{notice.studyTitle} 결석 하였습니다.</h3>;
  };

  // 회원 정지 알람 텍스트
  const renderBlackUserNoticeText = (notice) => {
    // TODO: 회원 정지 알람 텍스트 수정
    return <h3>회원님은 정지 되었습니다.</h3>;
  };

  return noticeTypeCheck(notice);
};
export default UseNoticeText;
