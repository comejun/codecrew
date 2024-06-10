package com.react.project2.domain;

import jakarta.persistence.Embeddable;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Embeddable
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class StudyMember {

    // TODO : StudyMember Entity 수정

    private String email;

    private LocalDateTime createdDate; // 생성 날짜

    private boolean checked; // 확인 여부

    // 대기, 수락, 거절, 탈퇴, 출석, 미출석
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private MemberStatus status = MemberStatus.HOLD;


    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof StudyMember)) return false;
        StudyMember that = (StudyMember) o;
        return email != null && email.equals(that.email);
    }

    @Override
    public int hashCode() {
        return email != null ? email.hashCode() : 0;
    }

    // 이메일을 설정하는 메소드
    public void setEmail(String email) {
        this.email = email;
    }
    public void setChecked(boolean checked){ this.checked = checked; }


}
