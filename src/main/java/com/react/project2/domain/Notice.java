package com.react.project2.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Embeddable
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Notice {

    private Long noticeId; // 공지 ID
    private boolean isCreator; // 생성자 여부
    @Builder.Default
    private LocalDateTime createdDate = LocalDateTime.now(); // 생성 날짜
    @ManyToOne(fetch = FetchType.LAZY)
    private Study study; // 스터디
    @Enumerated(EnumType.STRING)
    private NoticeType noticeType; // 공지 유형

}



