package com.react.project2.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.react.project2.domain.Notice;
import com.react.project2.domain.NoticeType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class NoticeDTO {
    private Long noticeId; // 공지 ID
    private boolean isCreator; // 생성자 여부
    private String memberNickname; // 멤버 닉네임
    private String studyTitle; // 스터디 제목
    private NoticeType noticeType; // 공지 유형
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm")
    private LocalDateTime createdDate; // 생성 날짜

    public NoticeDTO entityToDTO(Notice notice, String memberNickname){

        return NoticeDTO.builder()
                .noticeId(notice.getNoticeId())
                .isCreator(notice.isCreator())
                .memberNickname(memberNickname)
                .studyTitle(notice.getStudy().getTitle())
                .createdDate(notice.getCreatedDate())
                .noticeType(notice.getNoticeType())
                .build();
    }

}
