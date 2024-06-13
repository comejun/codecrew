package com.react.project2.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.react.project2.domain.Category;
import com.react.project2.domain.Member;
import com.react.project2.domain.Study;
import com.react.project2.domain.StudyMember;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class StudyDTO {
    private Long id;
    private String thImg;
    private String title;
    private String content;
    private String memberEmail;
    private String memberNickname;
    private String memberPhone;
    private String location;
    private double locationX;
    private double locationY;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm")
    private LocalDateTime studyDate;
    private String strStudyDate;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm")
    private LocalDateTime studyDeadlineDate;
    private String strStudyDeadlineDate;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm")
    private LocalDateTime createDate;
    private int maxPeople;
    private boolean disabled;
    private boolean isConfirmed;
    private boolean isFinished;
    private Category category;
    // 스터디 참여자 목록
    private List<StudyMember> studyMemberList;

    public void changeStudyDate(String strStudyDate) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm");
        this.studyDate = LocalDateTime.parse(strStudyDate, formatter);
    }

    public void changeStudyDeadlineDate(Long strStudyDeadlineDate) {
        if (strStudyDeadlineDate == null) {
            return;
        }
        Instant instant = Instant.ofEpochMilli(strStudyDeadlineDate);
        this.studyDeadlineDate = LocalDateTime.ofInstant(instant, ZoneId.systemDefault());

    }

    public void changeStudyDateWithOutT(String strStudyDate) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
        this.studyDate = LocalDateTime.parse(strStudyDate, formatter);
    }
    public static StudyDTO convert(Study study) {

        StudyDTO studyDTO = StudyDTO.builder()
                .id(study.getId())
                .thImg(study.getThImg())
                .title(study.getTitle())
                .content(study.getContent())
                .memberEmail(study.getMember().getEmail()) // 조회된 Member 엔티티를 사용합니다.
                .studyMemberList(study.getStudyMemberList()) // 참가자 목록
                .memberNickname(study.getMember().getNickname()) // 조회된 Member 엔티티를 사용합니다.
                .memberPhone(study.getMember().getPhone()) // 조회된 Member 엔티티를 사용합니다.
                .location(study.getLocation())
                .studyDeadlineDate(study.getStudyDate())
                .locationX((Double) study.getLocationX())
                .locationY((Double) study.getLocationY())
                .studyDate(study.getStudyDate())
                .maxPeople(study.getMaxPeople())
                .category(study.getCategory())
                .build();
        return studyDTO;
    }

}
