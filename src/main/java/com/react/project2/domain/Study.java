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
public class Study {

    // PK 값으로 사용할 id
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 썸네일 이미지
    @Builder.Default
    private String thImg = "";

    // 스터디 제목
    @Column(nullable = false, length = 500)
    private String title;

    // 스터디 내용
    @Column(length = 2000)
    private String content;

    // 스터디 주최자
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_email")
    private Member member;

    // 장소 위치
    private String location;
    private double locationX;
    private double locationY;

    // 모임일자
    @Column(nullable = false)
    private LocalDateTime studyDate;

    // 마감일자
    @Column(nullable = false)
    private LocalDateTime studyDeadlineDate;

    // 생성일자
    @Builder.Default
    private LocalDateTime createDate = LocalDateTime.now();

    @Column(nullable = false)
    // 최대인원
    private int maxPeople;

    // 삭제 여부
    private boolean disabled;

    // 확정 여부
    private boolean isConfirmed;

    // 카테고리
    @Enumerated(EnumType.STRING)
    private Category category;

    // 스터디 참여자 목록
    @ElementCollection
    @Builder.Default
    private List<StudyMember> studyMemberList = new ArrayList<>();

    // 스터디 참가자를 추가하는 메소드
    public void addStudyMember(StudyMember member) {
        this.studyMemberList.add(member);
    }

    // 스터디 삭제 메소드
    public void setDisabled(boolean disabled) {
        this.disabled = disabled;
    }

}
