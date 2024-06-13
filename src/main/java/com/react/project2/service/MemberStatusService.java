package com.react.project2.service;

import com.react.project2.domain.MemberStatus;
import com.react.project2.dto.DataMemberDTO;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Transactional
public interface MemberStatusService {

    // *************** 스터디 멤버 상태 변경 ***************

    // 스터디 멤버 상태 변경
    void changeMemberStatus(Long id, String userEmail, MemberStatus status);

    // 스터디 멤버 전체 상태 변경
    void changeAllMemberStatus(Long id, MemberStatus status);

    // 특정 상태를 제외한 스터디 멤버 전체 상태 변경
    void changeAllMemberStatusExcept(Long id, MemberStatus status, MemberStatus exceptStatus);

    // 특정 상태의 스터디 멤버 전체의 상태 변경
    void changeAllMemberStatusByStatus(Long id, MemberStatus status, MemberStatus changeStatus);

    // *************** 스터디 멤버 상태 조회 ***************

    // 특정 상태인 스터디 멤버 조회
    List<String> getMemberStatusByStatus(Long id, MemberStatus status);

    // 특정 상태를 제외한 스터디 멤버 조회
    List<String> getMemberStatusExcept(Long id, MemberStatus exceptStatus);
}
