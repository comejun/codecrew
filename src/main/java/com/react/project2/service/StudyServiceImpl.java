package com.react.project2.service;

import com.react.project2.domain.Category;
import com.react.project2.domain.Member;
import com.react.project2.domain.Study;
import com.react.project2.domain.StudyMember;
import com.react.project2.dto.PageRequestDTO;
import com.react.project2.dto.PageResponseDTO;
import com.react.project2.dto.StudyDTO;
import com.react.project2.dto.StudyMarkerDTO;
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
import java.util.List;

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
                pageRequestDTO.getPage() -1,
                pageRequestDTO.getSize(),
                Sort.by("id").descending());

        Page<Object[]> result = studyRepository.selectList(pageable);

        List<StudyDTO> list = result.getContent().stream().map(objArr -> {
            Study study = (Study)objArr[0];
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

        return PageResponseDTO.<StudyDTO>withList()
                .list(dtos)
                .totalCount(page.getTotalElements())
                .pageRequestDTO(pageRequestDTO)
                .build();
    }


    // 스터디 조회
    @Override
    public StudyDTO get(Long id) {
        Study study = studyRepository.selectOneById(id).orElseThrow();
        StudyDTO StudyDTO = entityToDTO(study);
        log.info("Study-serviceImpl-----");
        log.info(StudyDTO.getTitle());
        return StudyDTO;
    }

    @Override
    public void modifyStudy(StudyDTO studyDTO) {

    }

    @Override
    public boolean delete(Long id) {
        Optional<Study> studyOptional = studyRepository.findById(id);
        if (studyOptional.isPresent()) {
            Study study = studyOptional.get();
            study.setDisabled(true);
            studyRepository.save(study);
            return true;
        }
        return false;
    }

    @Override
    public boolean participate(Long id, String userEmail) {
        // 스터디 엔티티 조회
        Study study = studyRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 스터디가 존재하지 않습니다."));

        // 사용자 엔티티 조회
        Member member = memberRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("해당 사용자가 존재하지 않습니다."));

        // 이미 참가신청을 했는지 확인
        if (study.getStudyMemberList().stream().anyMatch(m -> m.getEmail().equals(userEmail))) {
            log.info("이미 참가신청을 한 사용자입니다.");
            return false;
        }

        // 참가인원이 최대인원을 초과하지 않았는지 확인
        if (study.getStudyMemberList().size() >= study.getMaxPeople()) {
            log.info("참가인원이 이미 최대입니다.");
            return false;
        }

        // 참가신청 로직
        StudyMember newMember = new StudyMember();
        newMember.setEmail(userEmail);
        study.addStudyMember(newMember);

        // 변경사항 저장
        studyRepository.save(study);
        return true;
    }


    private StudyDTO entityToDTO(Study study){

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
                .category(study.getCategory())
                .build();
        return studyDTO;
    }

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

       private Study dtoToEntity(StudyDTO studyDTO) {
        // MemberRepository를 사용하여 이메일 주소로 Member 엔티티를 조회합니다.
        Member member = memberRepository.findByEmail(studyDTO.getMemberEmail())
                .orElseThrow(() -> new RuntimeException("Member not found"));

        // Study 엔티티를 생성하고 Member 엔티티를 설정합니다.
        studyDTO.changeStudyDate(studyDTO.getStrStudyDate());

        Study study = Study.builder()
                .thImg(studyDTO.getThImg())
                .title(studyDTO.getTitle())
                .content(studyDTO.getContent())
                .member(member) // 조회된 Member 엔티티를 사용합니다.
                .location(studyDTO.getLocation())
                .studyDeadlineDate(studyDTO.getStudyDate())
                .locationX((Double) studyDTO.getLocationX())
                .locationY((Double) studyDTO.getLocationY())
                .studyDate(studyDTO.getStudyDate())
                .maxPeople(studyDTO.getMaxPeople())
                .category(studyDTO.getCategory())
                .build();
        return study;
    }
}
