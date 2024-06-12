package com.react.project2.domain;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum NoticeType {
    STUDY_DELETE("스터디삭제"), STUDY_MODIFY("스터디수정"),
    STUDY_PARTICIPATION("스터디참가신청"), STUDY_WITHDRAWAL("스터디탈퇴"),
    STUDY_APPROVAL("스터디참가승인"), STUDY_REJECTION("스터디참가거절"),
    STUDY_START("스터디시작"), STUDY_END("스터디종료"),
    PRE_PARTICIPATION_DATE("참가일1일전"), PARTICIPATION_DATE("참가일당일"),
    LOCATION_ARRIVAL("장소도착"), ATTENDANCE_COMPLETE("출석완료"),
    TARDINESS("지각"), ABSENCE("결석"),
    BLACK_USER("회원정지");

    private final String value;

    public static NoticeType builder(String value) {
        for (NoticeType noticeType : NoticeType.values()) {
            if (noticeType.getValue().equals(value)) {
                return noticeType;
            }
        };
        return null;
    }
}
