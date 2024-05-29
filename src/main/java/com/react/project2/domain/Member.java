package com.react.project2.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Member {

    // PK 값으로 사용할 이메일
    @Id
    private String email;

    @Column(length = 500)
    private String password;

    // 닉네임
    @Column(nullable = false)
    private String nickname;

    // 전화번호
    @Builder.Default
    private Long phone = 0L;

    // 프로필 이미지
    @Builder.Default
    private String profileImg = "";

    // 회원 링크
    @Builder.Default
    @Column(length = 500)
    private String memberLink = "";

    // 한줄 소개
    @Builder.Default
    @Column(length = 2000)
    private String introduction = "";

    // 탈퇴 여부
    private boolean disabled;

    // 관심 카테고리
    @ElementCollection
    @Builder.Default
    @Enumerated(EnumType.STRING)
    private List<Category> favoriteList = new ArrayList<>();

    // 알림 리스트
    @ElementCollection
    @Builder.Default
    private List<notice> noticeList = new ArrayList<>();

    // 패널티
    @Builder.Default
    private Integer penalty = 0;

    // 차단 날짜
    private LocalDateTime blockedDate;

    // 생성 날짜
    @Builder.Default
    private LocalDateTime createdDate = LocalDateTime.now();

    // 탈퇴 날짜
    private LocalDateTime disabledDate;

    // 사용자 권한
    @Builder.Default
    @Enumerated(EnumType.STRING)
    private Role role = Role.USER;

    // 신규 유저 여부
    @Builder.Default
    private boolean isNew = true;

    // ***** 값 수정 함수 *****

    // 닉네임 수정
    public void changeNickname(String nickname) {
        this.nickname = nickname;
    }

    // 전화번호 수정
    public void changePhone(Long phone) {
        this.phone = phone;
    }

    // 프로필 이미지 수정
    public void changeProfileImg(String profileImg) {
        this.profileImg = profileImg;
    }

    // 회원 링크 수정
    public void changeMemberLink(String memberLink) {
        this.memberLink = memberLink;
    }

    // 한줄 소개 수정
    public void changeIntroduction(String introduction) {
        this.introduction = introduction;
    }

    // 탈퇴 여부 수정
    public void changeDisabled(boolean disabled) {
        this.disabled = disabled;
    }

    // 관심 카테고리 변경
    public void changeFavoriteList(List<Category> favoriteList) {
        this.favoriteList = favoriteList;
    }


}
