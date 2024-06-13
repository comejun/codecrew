package com.react.project2.service;

import com.react.project2.domain.MemberStatus;
import com.react.project2.domain.Study;
import com.react.project2.repository.MemberRepository;
import com.react.project2.repository.StudyRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class MemberStatusServiceImpl implements MemberStatusService {

    private final StudyRepository studyRepository;
    private final MemberRepository memberRepository;

    // 스터디 ID로 스터디 조회
    private Study getStudyById(Long id) {
        return studyRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 스터디가 존재하지 않습니다."));
    }

    // 스터디 저장
    private void saveStudy(Study study) {
        studyRepository.save(study);
    }

    // *************** 스터디 멤버 상태 변경 ***************

    // 특정 스터디 멤버 상태 변경
    @Override
    public void changeMemberStatus(Long id, String userEmail, MemberStatus status) {
        Study study = getStudyById(id);
        study.changeStudyMemberStatus(userEmail, status);
        saveStudy(study);
    }

    // 스터디 멤버 전체 상태 변경
    @Override
    public void changeAllMemberStatus(Long id, MemberStatus status) {
        Study study = getStudyById(id);
        study.changeAllStudyMemberStatus(status);
        saveStudy(study);

    }

    // 특정 상태를 제외한 스터디 멤버 전체 상태 변경
    @Override
    public void changeAllMemberStatusExcept(Long id, MemberStatus status, MemberStatus exceptStatus) {
        Study study = getStudyById(id);
        study.changeAllStudyMemberStatusExcept(status, exceptStatus);
        saveStudy(study);
    }

    // 특정 상태의 스터디 멤버 전체의 상태 변경
    @Override
    public void changeAllMemberStatusByStatus(Long id, MemberStatus status, MemberStatus changeStatus) {
        Study study = getStudyById(id);
        study.changeAllStudyMemberStatusDifferent(status, changeStatus);
        saveStudy(study);
    }

    // *************** 스터디 멤버 상태 조회 ***************

    // 특정 상태인 스터디 멤버 조회
    @Override
    public List<String> getMemberStatusByStatus(Long id, MemberStatus status) {
        Study study = getStudyById(id);
        return study.getStudyMemberByStatus(status);
    }

    // 특정 상태를 제외한 스터디 멤버 조회
    @Override
    public List<String> getMemberStatusExcept(Long id, MemberStatus exceptStatus) {
Study study = getStudyById(id);
        return study.getStudyMemberExceptStatus(exceptStatus);
    }
}
