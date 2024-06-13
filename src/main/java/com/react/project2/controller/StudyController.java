package com.react.project2.controller;

import com.react.project2.domain.MemberStatus;
import com.react.project2.domain.NoticeType;
import com.react.project2.dto.StudyDTO;
import com.react.project2.service.MemberStatusService;
import com.react.project2.service.NoticeService;
import com.react.project2.service.StudyService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@Slf4j
@RequestMapping("api/study")
@RequiredArgsConstructor
public class StudyController {
    private final StudyService studyService;
    private final MemberStatusService memberStatusService;
    private final NoticeService noticeService;

    // 스터디 등록
    @PostMapping("/")
    public Map<String, String> add(StudyDTO studyDTO) {
        log.info("**** StudyController POST / add {} ****", studyDTO);
        studyService.add(studyDTO);
        return Map.of("RESULT", "SUCCESS");
    }

    // 스터디 조회
    @GetMapping("/{id}")
    public StudyDTO get(@PathVariable("id") Long id) {
        log.info("스터디 id 값은 : {}", id);
        StudyDTO studyDTO = studyService.get(id);
        log.info("----GETSTUDYID----");
        return studyDTO;
    }

    // 스터디 수정
    @PutMapping("/modify")
    public Map<String, String> modify(StudyDTO studyDTO) {
        log.info("**** StudyController PUT / modify {} ****", studyDTO);
        studyService.modifyStudy(studyDTO);

        // 상태가 HOLD인 멤버들 알람 생성
        memberStatusService.getMemberStatusByStatus(studyDTO.getId(), MemberStatus.HOLD).forEach(email -> {
            noticeService.createNotice(studyDTO.getId(), email, false, NoticeType.STUDY_MODIFY);
        });

        // 상태가 ACCEPT인 멤버들 알람 생성
        memberStatusService.getMemberStatusByStatus(studyDTO.getId(), MemberStatus.ACCEPT).forEach(email -> {
            noticeService.createNotice(studyDTO.getId(), email, false, NoticeType.STUDY_MODIFY);
        });

        return Map.of("result", "SUCCESS");
    }

    // 스터디 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable("id") Long id) {
        boolean result = studyService.delete(id);
        if (result) {

            // 상태가 ACCEPT인 멤버들 알람 생성
            memberStatusService.getMemberStatusByStatus(id, MemberStatus.ACCEPT).forEach(email -> {
                noticeService.createNotice(id, email, false, NoticeType.STUDY_DELETE);
            });
            // 상태가 HOLD인 멤버들 알람 생성
            memberStatusService.getMemberStatusByStatus(id, MemberStatus.HOLD).forEach(email -> {
                noticeService.createNotice(id, email, false, NoticeType.STUDY_DELETE);
            });

            // 전체 스터디 멤버 상태 DECLINE으로 변경
            memberStatusService.changeAllMemberStatus(id, MemberStatus.DECLINE);

            // 상태가 DECLINE인 멤버들 제거
            studyService.deleteDeclineMember(id);
            return ResponseEntity.ok().body(Map.of("message", "스터디가 성공적으로 삭제되었습니다."));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "삭제할 스터디를 찾을 수 없습니다."));
        }
    }

    // 스터디 참가신청
    @PostMapping("/{id}/participate")
    public ResponseEntity<?> participate(@PathVariable("id") Long id, @RequestBody Map<String, String> payload) {
        String userEmail = payload.get("email");

        // 스터디 참가 로직 구현
        boolean result = studyService.participate(id, userEmail);

        // 알람 생성
        noticeService.createNotice(id, "", true, NoticeType.STUDY_PARTICIPATION);

        return ResponseEntity.ok().body(Map.of("message", "스터디 참가신청이 완료되었습니다."));
    }

    // 스터디 출석체크
    @PostMapping("/{id}/arrive")
    public ResponseEntity<?> Arrive(@PathVariable("id") Long id, @RequestBody Map<String, String> payload) {
        String userEmail = payload.get("email");

        // 스터디 참가 로직 구현
        memberStatusService.changeMemberStatus(id, userEmail, MemberStatus.ARRIVE);
        // 알람 생성
        noticeService.createNotice(id, "", true, NoticeType.ATTENDANCE_COMPLETE);
        return ResponseEntity.ok().body(Map.of("message", "스터디 출석체크가 완료되었습니다."));
    }

    // 스터디 참가 취소
    @PostMapping("/{id}/cancelParticipation")
    public ResponseEntity<?> participationCancel(@PathVariable("id") Long id, @RequestBody Map<String, String> payload) {
        String userEmail = payload.get("email");
        // 스터디 참가 취소 로직 구현
        memberStatusService.changeMemberStatus(id, userEmail, MemberStatus.WITHDRAW);
        // 알람 생성
        noticeService.createNotice(id, "", true, NoticeType.STUDY_WITHDRAWAL);
        return ResponseEntity.ok().body(Map.of("message", "스터디 참가신청이 취소되었습니다."));
    }

    // 스터디 참가 수락
    @PostMapping("/{id}/acceptJoin")
    public ResponseEntity<?> acceptJoin(@PathVariable("id") Long id, @RequestBody Map<String, String> payload) {
        String userEmail = payload.get("email");
        // 스터디 참가 수락 로직 구현
        memberStatusService.changeMemberStatus(id, userEmail, MemberStatus.ACCEPT);
        // 알람 생성
        noticeService.createNotice(id, userEmail, false, NoticeType.STUDY_APPROVAL);
        return ResponseEntity.ok().body(Map.of("message", "스터디 참가신청이 수락되었습니다."));
    }

    // 스터디 참가 거절
    @PostMapping("/{id}/declineJoin")
    public ResponseEntity<?> declineJoin(@PathVariable("id") Long id, @RequestBody Map<String, String> payload) {
        String userEmail = payload.get("email");
        // 스터디 참가 거절 로직 구현
        memberStatusService.changeMemberStatus(id, userEmail, MemberStatus.DECLINE);
        // 알람 생성
        noticeService.createNotice(id, userEmail, false, NoticeType.STUDY_REJECTION);
        return ResponseEntity.ok().body(Map.of("message", "스터디 참가신청이 거절되었습니다."));
    }


    // 스터디 시작
    @PutMapping("/{id}/start")
    public ResponseEntity<?> startStudy(@PathVariable("id") Long id) {
        boolean result = studyService.startStudy(id);
        // 스터디 시작 로직 구현
        if (result) {
            // 상태가  HOLD인 멤버들 알람 생성
            memberStatusService.getMemberStatusByStatus(id, MemberStatus.HOLD).forEach(email -> {
                noticeService.createNotice(id, email, false, NoticeType.STUDY_REJECTION);
                // DECLINE 상태로 변경
                memberStatusService.changeMemberStatus(id, email, MemberStatus.DECLINE);
            });

            // 상태가 DECLINE인 멤버들 제거
            studyService.deleteDeclineMember(id);

            // 상태가 ACCEPT인 멤버들 알람 생성
            memberStatusService.getMemberStatusByStatus(id, MemberStatus.ACCEPT).forEach(email -> {
                noticeService.createNotice(id, email, false, NoticeType.STUDY_START);
            });

            return ResponseEntity.ok().body(Map.of("message", "스터디가 성공적으로 시작되었습니다."));
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "스터디 시작 처리 중 오류가 발생했습니다."));
        }
    }

    // ----------- //

    // 마이페이지 요청
    @GetMapping("/countmy")
    public ResponseEntity<?> countMyStudies(@RequestParam String email) {
        log.info("testCount------");
        try {
            // 사용자 이메일로 스터디 개수 조회
            int count = studyService.countStudy(email);
            return ResponseEntity.ok().body(Map.of("count", count));
        } catch (Exception e) {
            // 예외 발생 시 에러 메시지 반환
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "스터디 개수를 조회하는 중 오류가 발생했습니다."));
        }
    }

    @GetMapping("/countmyJoin")
    public ResponseEntity<?> countMyJoinStudies(@RequestParam String email) {
        log.info("testCount------");
        try {
            // 사용자 이메일로 스터디 개수 조회
            int count = studyService.countJoinStudy(email);
            return ResponseEntity.ok().body(Map.of("count", count));
        } catch (Exception e) {
            // 예외 발생 시 에러 메시지 반환
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "스터디 개수를 조회하는 중 오류가 발생했습니다."));
        }
    }


}
