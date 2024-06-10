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
    @Query("SELECT COUNT(s) FROM Study s WHERE s.member.email = :email")
    int countStudy(String email);

    // 검색 기능 구현 위한 코드
    List<Study> findByTitleContainingIgnoreCase(String title);


}
