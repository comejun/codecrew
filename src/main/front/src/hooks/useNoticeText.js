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
    // 스터디 방치 알람
    else if (notice.noticeType === "STUDY_DEAD") {
      return renderStudyDeadNoticeText(notice);
    }
    // 참가일 1일전 알람
    else if (notice.noticeType === "PRE_PARTICIPATION_DATE") {
      return renderPreParticipationDateNoticeText(notice);
    }
    // 참가일 당일 알람
    else if (notice.noticeType === "PARTICIPATION_DATE") {
      return renderParticipationDateNoticeText(notice);
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
    // 벌점 알람
    else if (notice.noticeType === "PENALTY") {
      return renderPenaltyNoticeText(notice);
    }
    // 벌점 삭제 알람
    else if (notice.noticeType === "PENALTY_DELETE") {
      return renderPenaltyDeleteNoticeText(notice);
    }
  };

  // *************** 알람 텍스트 함수 ***************

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

  // 스터디 방치 알람 텍스트
  const renderStudyDeadNoticeText = (notice) => {
    return <h3>{notice.studyTitle}가 취소 되었습니다.</h3>;
  };

  // 참가일 1일전 알람 텍스트
  const renderPreParticipationDateNoticeText = (notice) => {
    return <h3>{notice.studyTitle} 참가일이 1일 남았습니다.</h3>;
  };

  // 참가일 당일 알람 텍스트
  const renderParticipationDateNoticeText = (notice) => {
    return <h3>{notice.studyTitle} 참가일이 오늘 입니다.</h3>;
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
    return <h3>회원님의 활동이 3일 동안 정지 되었습니다.</h3>;
  };

  // 벌점 알람 텍스트
  const renderPenaltyNoticeText = (notice) => {
    return <h3>규칙 위반 으로 인해 벌점이 추가 되었습니다.</h3>;
  };

  // 벌점 삭제 알람 텍스트
  const renderPenaltyDeleteNoticeText = (notice) => {
    return <h3>회원님의 활동 정지가 해제되었습니다.</h3>;
  };

  return noticeTypeCheck(notice);
};
export default UseNoticeText;
