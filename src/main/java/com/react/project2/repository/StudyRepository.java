package com.react.project2.repository;

import com.react.project2.domain.Category;
import com.react.project2.domain.Study;
import jakarta.persistence.Entity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface StudyRepository extends JpaRepository<Study, Long> {


    // 현재 날짜보다 Deadline이 더 늦고 isConfirmed이 false이며 disabled가 false인 스터디 카테고리별 조회
    @Query("select s from Study s where s.studyDeadlineDate > current_date and s.isConfirmed = false and s.disabled = false and s.category = :category")
    List<Study> findAllByCategory(Category category);

    // 현재 날짜보다 Deadline이 더 늦고 isConfirmed이 false인 스터디 전체 조회
    @Query("select s from Study s where s.studyDeadlineDate > current_date and s.isConfirmed = false and s.disabled = false")
    List<Study> findAllCategory();





    // 스터디 조회
//    @EntityGraph(attributePaths =  = {"studyList"}) // 조인
    @Query("select s from Study s where s.id = :id")
    Optional<Study> selectOneById(@Param("id")Long id);

    // 스터디 목록 조회
    @Query("select s from Study s where s.disabled=false")
    Page<Object[]> selectList(Pageable pageable);

    // 스터디 만든이 기준으로 스터디 목록 조회
    Page<Study> findAllByMemberEmail(String memberEmail, Pageable pageable);

    // ----------- //

    // 마이페이지 요청

    // 이메일로  disabled가 false인 스터디 갯수 조회
    @Query("SELECT COUNT(s) FROM Study s WHERE s.member.email = :email and s.disabled = false")
    int countStudy(@Param("email") String email);


    // disabled가 false인 스터디 studyMemberList에 status가 HOLD 또는 ACCEPT인 스터디 갯수 조회
    @Query("SELECT COUNT(s) FROM Study s JOIN s.studyMemberList members WHERE members.email = :email and members.status in ('HOLD', 'ACCEPT') and s.disabled = false")
    int countJoinStudy(@Param("email") String email);


}
