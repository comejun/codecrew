package com.react.project2.repository;

import com.react.project2.domain.Category;
import com.react.project2.domain.Study;
import com.react.project2.domain.StudyMember;
import jakarta.persistence.Entity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudyRepository extends JpaRepository<Study, Long> {


    // 현재 날짜보다 Deadline이 더 늦고 isConfirmed이 false이며 disabled가 false인 스터디 카테고리별 조회
    @Query("select s from Study s where s.studyDeadlineDate > current_date and s.isConfirmed = false and s.disabled = false and s.category = :category")
    List<Study> findAllByCategory(Category category);

    // 현재 날짜보다 Deadline이 더 늦고 isConfirmed이 false인 스터디 전체 조회
    @Query("select s from Study s where s.studyDeadlineDate > current_date and s.isConfirmed = false and s.disabled = false")
    List<Study> findAllCategory();

    // ----------- //

    // 마이페이지 요청

    // 이메일로  disabled가 false인 스터디 갯수 조회
    @Query("SELECT COUNT(s) FROM Study s WHERE s.member.email = :email and s.disabled = false")
    int countStudy(@Param("email") String email);


    // disabled가 false인 스터디 studyMemberList에 status가 HOLD 또는 ACCEPT인 스터디 갯수 조회
    @Query("SELECT COUNT(s) FROM Study s JOIN s.studyMemberList members WHERE members.email = :email and members.status in ('HOLD', 'ACCEPT') and s.disabled = false")
    int countJoinStudy(@Param("email") String email);


    // 검색 기능 구현 위한 코드
    List<Study> findByTitleContainingIgnoreCase(String title);
    // 참가 스터디 목록 가져오기
    @Query("SELECT members FROM Study s JOIN s.studyMemberList members WHERE members.email = :email AND members.status IN ('HOLD', 'ACCEPT', 'ARRIVE', 'ABSENCE') AND s.disabled = false")
    List<StudyMember> getJoinStudy(@Param("email") String email);


}
