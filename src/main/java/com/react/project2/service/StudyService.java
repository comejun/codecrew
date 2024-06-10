package com.react.project2.service;


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

    // 스터디 조회(목록)
    PageResponseDTO<StudyDTO> getList(PageRequestDTO pageRequestDTO);

    // 스터디 조회(이메일/목록)
    PageResponseDTO<StudyDTO> getListMember(PageRequestDTO pageRequestDTO, String memberEmail);

    // 스터디 조회(1개)
    StudyDTO get(Long id);

    // 스터디 수정
    void modifyStudy(StudyDTO studyDTO);

    // 스터디 삭제
    boolean delete(Long id);

    // 스터디 참가신청
    boolean participate(Long id, String userEmail);

    // 스터디 참가취소
    boolean participationCancel(Long id, String userEmail);

    // 스터디 참가 승인
    boolean acceptJoin(Long id, String memberEmail);

    // 스터디 참가 거절
    boolean declineJoin(Long id, String memberEmail);

    // 스터디 시작
    boolean startStudy(Long id);



    // 스터디 참가자 조회


    // 마커용 스터디 카테고리별 전체 조회
    List<StudyDTO> getStudyMarkerByCategory(String category);


}
