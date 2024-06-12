package com.react.project2.repository;

import com.react.project2.domain.Member;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, String> {

    // 회원 조회 + 알림 목록 포함
    @EntityGraph(attributePaths = {"noticeList"})
    @Query("select m from Member m where m.email = :email")
    Member getMemberWithNoticeList(@Param("email") String email);

    // 회원 조회 + 관심 목록 포함
    @EntityGraph(attributePaths = {"favoriteList"})
    @Query("select m from Member m where m.email = :email")
    Member getMemberWithFavoriteList(@Param("email") String email);

    // 회원 조회 + 알림 목록, 관심 목록 포함
    @EntityGraph(attributePaths = {"noticeList", "favoriteList"})
    @Query("select m from Member m where m.email = :email")
    Member getMemberWithNoticeListAndFavoriteList(@Param("email") String email);

    Member findMemberByPhone(String phone);


    // 회원 이메일
    Optional<Member> findByEmail(String email);

    //
}
