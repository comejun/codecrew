package com.react.project2.service;


import com.react.project2.domain.MemberStatus;
import com.react.project2.domain.NoticeType;
import com.react.project2.domain.Study;
import com.react.project2.dto.PageRequestDTO;
import com.react.project2.dto.PageResponseDTO;
import com.react.project2.dto.StudyDTO;
import com.react.project2.dto.StudyMarkerDTO;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Transactional
public interface StudyService {

    // 스터디 등록
    void add(StudyDTO studyDTO);

    // 스터디 조회(1개)
    StudyDTO get(Long id);

    // 스터디 엔티티 조회
    Study getEntity(Long id);

    // 스터디 수정
    void modifyStudy(StudyDTO studyDTO);

    // 스터디 삭제
    boolean delete(Long id);

    // 스터디 참가신청
    boolean participate(Long id, String userEmail);

    // 스터디 멤버 상태 변경
    void changeMemberStatus(Long id, String userEmail, MemberStatus status);

    // 스터디 시작
    boolean startStudy(Long id);

    // 사용자 이메일로 생성한 스터디 개수 조회
    int countStudy(String email);

    // 사용자 이메일로 참가한 스터디 개수 조회
    int countJoinStudy(String email);

    // 알람 생성 기능
    void createNotice(Long id, String userEmail, boolean creator,NoticeType type);


    // 마커용 스터디 카테고리별 전체 조회
    List<StudyDTO> getStudyMarkerByCategory(String category);


}
