package com.react.project2.service;

import com.react.project2.domain.*;
import com.react.project2.dto.PageRequestDTO;
import com.react.project2.dto.PageResponseDTO;
import com.react.project2.dto.StudyDTO;
import com.react.project2.repository.MemberRepository;
import com.react.project2.repository.StudyRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class StudyServiceImpl implements StudyService {

    private final MemberRepository memberRepository;
    private final StudyRepository studyRepository;
    private final MemberStatusService memberStatusService;
    private final NoticeService noticeService;

    // *************** 스터디 등록, 조회, 수정, 삭제 ***************

    // 스터디 등록
    @Override
    public void add(StudyDTO studyDTO) {
        Study study = dtoToEntity(studyDTO);
        // 저장 처리
        Study saved = studyRepository.save(study);
    }

    @Override
    public PageResponseDTO<StudyDTO> getList(PageRequestDTO pageRequestDTO) {
        Pageable pageable = PageRequest.of(
                pageRequestDTO.getPage() - 1,
                pageRequestDTO.getSize(),
                Sort.by("id").descending());

        Page<Object[]> result = studyRepository.selectList(pageable);

        List<StudyDTO> list = result.getContent().stream().map(objArr -> {
            Study study = (Study) objArr[0];
            StudyDTO studyDTO = entityToDTO(study);
            return studyDTO;
        }).collect(Collectors.toList());

        long totalCount = result.getTotalElements();

        return PageResponseDTO.<StudyDTO>withList()
                .list(list)
                .totalCount(totalCount)
                .pageRequestDTO(pageRequestDTO)
                .build();
    }
    // 주최스터디 조회(이메일/목록)
    @Override
    public PageResponseDTO<StudyDTO> getListMember(PageRequestDTO pageRequestDTO, String memberEmail) {
        Pageable pageable = PageRequest.of(
                pageRequestDTO.getPage() - 1,
                pageRequestDTO.getSize(),
                Sort.by("id").descending());

        Page<Study> page = studyRepository.findAllByMemberEmail(memberEmail, pageable);

        List<StudyDTO> dtos = page.getContent().stream()
                .map(this::entityToDTO)
                .collect(Collectors.toList());

        return PageResponseDTO.<StudyDTO>withListHasMore()
                .list(dtos)
                .totalCount(page.getTotalElements())
                .pageRequestDTO(pageRequestDTO)
                .hasMoreList(page.hasNext())
                .build();
    }

    // 참가스터디 조회
    @Override
    public PageResponseDTO<StudyDTO> getJoinStudy(PageRequestDTO pageRequestDTO, String email) {
        Pageable pageable = PageRequest.of(
                pageRequestDTO.getPage() - 1,
                pageRequestDTO.getSize(),
                Sort.by("id").descending());


        Page<Study> page = studyRepository.findAllByMemberEmailAndStatus(email, pageable);

        List<StudyDTO> dtos = page.getContent().stream()
                .map(this::entityToDTO)
                .collect(Collectors.toList());

        return PageResponseDTO.<StudyDTO>withListHasMore()
                .list(dtos)
                .totalCount(page.getTotalElements())
                .pageRequestDTO(pageRequestDTO)
                .hasMoreList(page.hasNext())
                .build();
    }

    // 스터디 조회(1개)
    @Override
    public StudyDTO get(Long id) {
        Study study = studyRepository.findById(id).orElseThrow();
        StudyDTO StudyDTO = entityToDTO(study);
        log.info("Study-serviceImpl-----");
        log.info(StudyDTO.getTitle());
        return StudyDTO;
    }

    // 스터디 수정
    @Override
    public void modifyStudy(StudyDTO studyDTO) {
        log.info("modifyStudy, studyDTO : " + studyDTO);
        // ID를 사용하여 기존 스터디 엔티티를 조회합니다.
        Study study = studyRepository.findById(studyDTO.getId())
                .orElseThrow(() -> new IllegalArgumentException("해당 스터디가 존재하지 않습니다."));

        // DTO에서 받은 정보로 엔티티의 필드를 업데이트합니다.
        study.changeTitle(studyDTO.getTitle());
        study.changeThImg(studyDTO.getThImg());
        study.changeContent(studyDTO.getContent());
        study.changeLocation(studyDTO.getLocation());
        study.changeLocationX(studyDTO.getLocationX());
        study.changeLocationY(studyDTO.getLocationY());
        study.changeMaxPeople(studyDTO.getMaxPeople());
        study.changeCategory(studyDTO.getCategory());

        // 변경사항을 저장합니다.
        studyRepository.save(study);
    }

    // 스터디 삭제
    @Override
    public boolean delete(Long id) {
        Study study = studyRepository.findById(id).orElseThrow();

        study.changeDisabled(true);
        studyRepository.save(study);
        return true;

    }



    // *************** 스터디 조건으로 조회 ***************

    // 마커용 스터디 카테고리별 전체 조회
    @Override
    public List<StudyDTO> getStudyMarkerByCategory(String category) {

        Category categoryEnum;
        //List<Study> -> List<StudyDTO>
        List<Study> studyList = new ArrayList<>();
        if (category.equals("ALL")) {
            studyList = studyRepository.findAllCategory();
        } else {
            categoryEnum = Category.valueOf(category);
            studyList = studyRepository.findAllByCategory(categoryEnum);
        }
        List<StudyDTO> studyDTOList = new ArrayList<>();
        for (Study study : studyList) {
            StudyDTO studyDTO = entityToDTO(study);
            studyDTOList.add(studyDTO);
        }
        return studyDTOList;

    }

    // 사용자 이메일로 생성한 스터디 개수 조회
    @Override
    public int countStudy(String email) {
        return studyRepository.countStudy(email);
    }

    // 사용자 이메일로 참가한 스터디 개수 조회
    @Override
    public int countJoinStudy(String email) {
        return studyRepository.countJoinStudy(email);
    }

    // 현재 시간을 기준으로 마감기한이 지난 스터디를 찾는다.
    @Override
    public void checkStudyDeadline() {
        log.info("checkStudyDeadline");
        // 현재 시간을 기준으로 마감기한이 지난 isConfirmed가 false인 스터디 전체 조회
        List<Study> studyList = studyRepository.findAllByAfterDeadline();
        log.info("studyList.size() : " + studyList.size());
        for (Study study : studyList) {
            // 상태가 HOLD인 참가자 알람 생성
            log.info("study.getId() : " + study.getId());
            memberStatusService.getMemberStatusByStatus(study.getId(), MemberStatus.HOLD).forEach(email -> {
                log.info("email : " + email);
                noticeService.createNotice(study.getId(), email, false, NoticeType.STUDY_REJECTION);
                // 상태를 DECLINE으로 변경
                memberStatusService.changeMemberStatus(study.getId(), email, MemberStatus.DECLINE);
            });
            // 상태가 WITHDRAW인 참가자 DECINE으로 변경
            memberStatusService.changeAllMemberStatusByStatus(study.getId(), MemberStatus.WITHDRAW, MemberStatus.DECLINE);
            // 상태가 DECLINE인 참가자 삭제
            deleteDeclineMember(study.getId());
        }
    }

    // 현재 시간을 기준으로 isConfirmed가 false인 studyDate가 지난 스터디를 찾는다.
    @Override
    public void checkStudyDateAfterNow() {
        log.info("checkStudyDateAfterNow");
        List<Study> studyList = studyRepository.findAllByAfterStudyDate();
        log.info("studyList.size() : " + studyList.size());
        for (Study study : studyList) {

            // 상태가 ACCEPT인 참가자 알람 생성
            log.info("study.getId() : " + study.getId());
            memberStatusService.getMemberStatusByStatus(study.getId(), MemberStatus.ACCEPT).forEach(email -> {
                log.info("email : " + email);
                noticeService.createNotice(study.getId(), email, false, NoticeType.STUDY_DEAD);
                // 상태를 DECLINE으로 변경
                memberStatusService.changeMemberStatus(study.getId(), email, MemberStatus.DECLINE);
            });

            // 상태가 DECLINE인 참가자 삭제
            deleteDeclineMember(study.getId());

            log.info("study.getId() : " + study.getId());
            // 생성자에게 알람 생성
            noticeService.createNotice(study.getId(), study.getMember().getEmail(), true, NoticeType.STUDY_DEAD);
            // 생성자에게 벌점 부여
            study.getMember().addPenalty(4);
            noticeService.createNotice(study.getId(), "", true, NoticeType.PENALTY);
            // 생성자의 벌점 확인
            if(study.getMember().getPenalty() >= 5){
                study.getMember().changeBlockedDate(true);
            }

            log.info("study.getMember().getPenalty() : " + study.getMember().getPenalty());
            // 스터디 삭제
            delete(study.getId());

        }
    }

    // 현재 시간을 기준으로 하루 뒤의 studyDate를 가지고 있는 isConfirmed가 true고 disabled가 false인 스터디를 찾는다.
    @Override
    public void checkTomorrowStudyDate() {
        log.info("checkTomorrowStudyDate");
        List<Study> studyList = studyRepository.findAllByTomorrowStudyDate();
        log.info("studyList.size() : " + studyList.size());
        for (Study study : studyList) {
            // 상태가 ACCEPT인 참가자 알람 생성
            log.info("study.getId() : " + study.getId());
            memberStatusService.getMemberStatusByStatus(study.getId(), MemberStatus.ACCEPT).forEach(email -> {
                log.info("email : " + email);
                noticeService.createNotice(study.getId(), email, false, NoticeType.PRE_PARTICIPATION_DATE);
            });
            // 생성자 알람 생성
            noticeService.createNotice(study.getId(),"",true,NoticeType.PRE_PARTICIPATION_DATE);
        }
    }

    // 현재 날짜의 studyDate를 가지고 있는 isConfirmed가 true이고 disabled가 false인 스터디를 찾는다.
    @Override
    public void checkTodayStudyDate() {
        log.info("checkTodayStudyDate");
        List<Study> studyList = studyRepository.findAllByTodayStudyDate();
        log.info("studyList.size() : " + studyList.size());
        for (Study study : studyList) {
            // 상태가 ACCEPT인 참가자 알람 생성
            log.info("study.getId() : " + study.getId());
            memberStatusService.getMemberStatusByStatus(study.getId(), MemberStatus.ACCEPT).forEach(email -> {
                log.info("email : " + email);
                noticeService.createNotice(study.getId(), email, false, NoticeType.PARTICIPATION_DATE);
            });
            // 생성자 알람 생성
            noticeService.createNotice(study.getId(),"",true,NoticeType.PARTICIPATION_DATE);
        }
    }

    // *************** 스터디 참가, 시작, 참가자 삭제 ***************


    // 스터디 참가신청
    @Override
    public boolean participate(Long id, String userEmail) {
        // 스터디 엔티티 조회
        Study study = studyRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 스터디가 존재하지 않습니다."));

        // 스터디 멤버 리스트에 사용자가 이미 있는지 확인
        if (study.getStudyMemberList().stream().anyMatch(m -> m.getEmail().equals(userEmail))) {
            log.info("이미 참가신청을 한 사용자입니다.");
            throw new IllegalStateException("이미 참가신청이 완료되었습니다.");
        }

        // 참가인원이 최대인원을 초과하지 않았는지 확인
        if (study.getStudyMemberList().stream().filter(m -> m.getStatus() == MemberStatus.ACCEPT).count() >= study.getMaxPeople()) {
            log.info("확정인원이 이미 최대입니다.");
            throw new IllegalStateException("확정인원이 이미 최대입니다.");
        }

        // 참가신청 로직
        StudyMember newMember = new StudyMember();
        newMember.setEmail(userEmail);
        study.addStudyMember(newMember);

        // 변경사항 저장
        studyRepository.save(study);
        return true;
    }

    // 스터디 시작
    @Override
    public boolean startStudy(Long id) {
        Optional<Study> studyOptional = studyRepository.findById(id);
        if (studyOptional.isPresent()) {
            Study study = studyOptional.get();
            study.changeIsConfirmed(true);
            studyRepository.save(study);
            return true;
        }
        return false;
    }

    // 스터디 완료
    @Override
    public boolean finishedStudy(Long id) {
        Optional<Study> studyOptional = studyRepository.findById(id);
        if (studyOptional.isPresent()) {
            Study study = studyOptional.get();
            study.changeIsFinished(true);
            studyRepository.save(study);
            return true;
        }
        return false;
    }

    // DECLINE 상태인 참가자 삭제
    @Override
    public void deleteDeclineMember(Long id) {
        Study study = studyRepository.findById(id).orElseThrow();
        study.deleteDeclineMember();
        studyRepository.save(study);
    }


    // *************** DTO 변환 메소드 ***************
    private StudyDTO entityToDTO(Study study) {

        StudyDTO studyDTO = StudyDTO.builder()
                .id(study.getId())
                .thImg(study.getThImg())
                .title(study.getTitle())
                .content(study.getContent())
                .memberEmail(study.getMember().getEmail()) // 조회된 Member 엔티티를 사용합니다.
                .memberNickname(study.getMember().getNickname()) // 조회된 Member 엔티티를 사용합니다.
                .memberPhone(study.getMember().getPhone()) // 조회된 Member 엔티티를 사용합니다.
                .location(study.getLocation())
                .studyDeadlineDate(study.getStudyDate())
                .locationX((Double) study.getLocationX())
                .locationY((Double) study.getLocationY())
                .studyDate(study.getStudyDate())
                .maxPeople(study.getMaxPeople())
                .isConfirmed(study.getIsConfirmed())
                .isFinished(study.getIsFinished())
                .category(study.getCategory())
                .studyMemberList(study.getStudyMemberList())
                .build();
        return studyDTO;
    }


    private Study dtoToEntity(StudyDTO studyDTO) {
        // MemberRepository를 사용하여 이메일 주소로 Member 엔티티를 조회합니다.
        Member member = memberRepository.findByEmail(studyDTO.getMemberEmail())
                .orElseThrow(() -> new RuntimeException("Member not found"));

        // Study 엔티티를 생성하고 Member 엔티티를 설정합니다.
        studyDTO.changeStudyDate(studyDTO.getStrStudyDate());
        //strStudyDeadlineDate를 Long으로 변경해야함
        studyDTO.changeStudyDeadlineDate(Long.parseLong(studyDTO.getStrStudyDeadlineDate()));
        log.info("studyDTO.getStrStudyDeadlineDate() : " + studyDTO.getStrStudyDeadlineDate());

        Study study = Study.builder()
                .thImg(studyDTO.getThImg())
                .title(studyDTO.getTitle())
                .content(studyDTO.getContent())
                .member(member) // 조회된 Member 엔티티를 사용합니다.
                .location(studyDTO.getLocation())
                .studyDeadlineDate(studyDTO.getStudyDeadlineDate())
                .locationX((Double) studyDTO.getLocationX())
                .locationY((Double) studyDTO.getLocationY())
                .studyDate(studyDTO.getStudyDate())
                .maxPeople(studyDTO.getMaxPeople())
                .category(studyDTO.getCategory())
                .studyMemberList(studyDTO.getStudyMemberList())
                .build();
        return study;
    }
}
