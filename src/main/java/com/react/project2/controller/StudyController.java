package com.react.project2.controller;

import com.react.project2.dto.PageRequestDTO;
import com.react.project2.dto.PageResponseDTO;
import com.react.project2.dto.StudyDTO;
import com.react.project2.repository.StudyRepository;
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
    private final StudyRepository studyRepository;

    // 스터디 등록
    @PostMapping("/")
    public Map<String, String> add(StudyDTO studyDTO){
        log.info("**** StudyController POST / add {} ****", studyDTO);
        studyService.add(studyDTO);
        return Map.of("RESULT", "SUCCESS");
    }

    // 스터디 전부 조회
    @GetMapping("/list")
    public PageResponseDTO<StudyDTO> list(PageRequestDTO pageRequestDTO){
        return studyService.getList(pageRequestDTO);
    }

    // 스터디 조회
    @GetMapping("/{id}")
    public StudyDTO get(@PathVariable("id") Long id){
        log.info("스터디 id 값은 : {}", id);
        StudyDTO studyDTO = studyService.get(id);
        log.info("----GETSTUDYID----");
        return studyDTO;
    }

    // 스터디 수정
    @PutMapping("/modify/{id}")
    public Map<String, String> modify(@RequestBody StudyDTO studyDTO){
        studyService.modifyStudy(studyDTO);
        return Map.of("result", "SUCCESS");
    }

    // 스터디 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable("id") Long id) {
        boolean result = studyService.delete(id);
        if (result) {
            return ResponseEntity.ok().body(Map.of("message", "스터디가 성공적으로 삭제되었습니다."));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "삭제할 스터디를 찾을 수 없습니다."));
        }
    }


    // 스터디 참가신청
    @PostMapping("/{id}/participate")
    public ResponseEntity<?> participate(@PathVariable("id") Long id, @RequestBody Map<String, String> payload) {
        try {
            String userEmail = payload.get("email");
            if (userEmail == null || userEmail.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "이메일이 제공되지 않았습니다."));
            }
            // 스터디 참가 로직 구현
            boolean result = studyService.participate(id, userEmail);
            if (result) {
                log.info("테스트-------체크");
                return ResponseEntity.ok().body(Map.of("message", "스터디 참가신청이 완료되었습니다."));
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "스터디 참가신청 처리 중 오류가 발생했습니다."));
            }
        } catch (Exception e) {
            // 예외 발생 시 에러 메시지 반환
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "스터디 참가신청 처리 중 오류가 발생했습니다."));
        }
    }



    // ----------- //

    // 마이페이지 요청
    @GetMapping("/countmy")
    public ResponseEntity<?> countMyStudies(@RequestParam String email) {
        try {
            // 사용자 이메일로 스터디 개수 조회
            int count = studyRepository.countStudy(email);
            return ResponseEntity.ok().body(Map.of("count", count));
        } catch (Exception e) {
            // 예외 발생 시 에러 메시지 반환
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "스터디 개수를 조회하는 중 오류가 발생했습니다."));
        }
    }


}
