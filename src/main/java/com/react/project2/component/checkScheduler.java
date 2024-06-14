package com.react.project2.component;

import com.react.project2.service.MemberService;
import com.react.project2.service.StudyService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class checkScheduler {

    private final StudyService studyService;
    private final MemberService memberService;

    // 1초마다 실행
    @Scheduled(fixedDelay = 60000)
    public void StudyCheck() {

        // 마감 날짜 지난 스터디 처리
        checkStudyDeadline();
        // 스터디 날짜 지난 스터디 처리
        checkStudyDate();
        // 내일의 스터디 처리
        checkTomorrowStudyDate();
        // 오늘의 스터디 처리
        checkTodayStudyDate();
        // 블록 날짜 지난 회원 처리
        checkBlockDate();

    }

    // 현재 시간을 기준으로 마감기한이 지난 스터디를 찾는다.
    public void checkStudyDeadline() {
        studyService.checkStudyDeadline();
    }

    // 현재 시간을 기준으로 5시간 이내의 studyDate를 가지고 있는 isConfirmed가 false이고 disabled가 false인 스터디를 찾는다.
    public void checkStudyDate() {
        studyService.checkStudyDateAfterNow();
    }

    // 현재 시간을 기준으로 하루 뒤의 studyDate를 가지고 있는 isConfirmed가 true고 disabled가 false인 스터디를 찾는다.
    public void checkTomorrowStudyDate() {
        studyService.checkTomorrowStudyDate();
    }

    // 현재 날짜의 studyDate를 가지고 있는 isConfirmed가 true이고 disabled가 false인 스터디를 찾는다.
    public void checkTodayStudyDate() {
        studyService.checkTodayStudyDate();
    }

    // 현재 시간을 기준으로 BlockDate가 지난 회원을 찾는다
    public void checkBlockDate() {
        memberService.checkBlockDate();
    }


}
