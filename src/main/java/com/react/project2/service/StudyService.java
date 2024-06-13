package com.react.project2.service;


import com.react.project2.domain.MemberStatus;
import com.react.project2.domain.NoticeType;
import com.react.project2.domain.Study;
import com.react.project2.domain.StudyMember;
import com.react.project2.dto.PageRequestDTO;
import com.react.project2.dto.PageResponseDTO;
import com.react.project2.dto.StudyDTO;
import com.react.project2.dto.StudyMarkerDTO;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Transactional
public interface StudyService {

    // ********** 스터디 등록, 조회, 수정, 삭제 **********

    // 스터디 등록
    void add(StudyDTO studyDTO);

    // 스터디 조회(목록)
    PageResponseDTO<StudyDTO> getList(PageRequestDTO pageRequestDTO);

    // 주최스터디 조회(이메일/목록)
    PageResponseDTO<StudyDTO> getListMember(PageRequestDTO pageRequestDTO, String memberEmail);
    // 참가스터디 조회
    PageResponseDTO<StudyDTO> getJoinStudy(PageRequestDTO pageRequestDTO, String email);

    // 스터디 조회(1개)
    StudyDTO get(Long id);

    // 스터디 수정
    void modifyStudy(StudyDTO studyDTO);

    // 스터디 삭제
    boolean delete(Long id);

    // *************** 스터디 조건으로 조회 ***************

    // 마커용 스터디 카테고리별 전체 조회
    List<StudyDTO> getStudyMarkerByCategory(String category);

    // 사용자 이메일로 생성한 스터디 개수 조회
    int countStudy(String email);

    // 사용자 이메일로 참가한 스터디 개수 조회
    int countJoinStudy(String email);

    // 현재 시간을 기준으로 마감기한이 지난 스터디를 찾는다.
    void checkStudyDeadline();

    // 현재 시간을 기준으로 isConfirmed가 false인 studyDate가 지난 스터디를 찾는다.
    void checkStudyDateAfterNow();

    // 현재 시간을 기준으로 하루 뒤의 studyDate를 가지고 있는 isConfirmed가 true고 disabled가 false인 스터디를 찾는다.
    void checkTomorrowStudyDate();

    // 현재 날짜의 studyDate를 가지고 있는 isConfirmed가 true이고 disabled가 false인 스터디를 찾는다.
    void checkTodayStudyDate();

    // *************** 스터디 참가, 시작, 참가자 삭제 ***************

    // 스터디 참가신청
    boolean participate(Long id, String userEmail);

    // 스터디 시작
    boolean startStudy(Long id);

    // 스터디 완료
    boolean finishedStudy(Long id);

    // DECLINE 상태인 참가자 삭제
    void deleteDeclineMember(Long id);










}
