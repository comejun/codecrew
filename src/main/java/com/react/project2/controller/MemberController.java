package com.react.project2.controller;

import com.react.project2.domain.Member;
import com.react.project2.dto.DataMemberDTO;
import com.react.project2.service.MemberService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/member")
@Slf4j
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;

    // 회원 조회
    @GetMapping("/{email}")
    public DataMemberDTO getMember(@PathVariable("email") String email){
        log.info("************ MemberController - getMember -email : {}", email);
        DataMemberDTO member = memberService.getMember(email);
        log.info("************ MemberController - getMember -member : {}", member);
        return member;
    }

    @PutMapping("/modify")
    public Map<String, String> modify(@RequestBody DataMemberDTO dataMemberDTO) {
        log.info("************ MemberController - modify -dataMemberDTO : {}", dataMemberDTO);
        memberService.modifyMember(dataMemberDTO);
        return Map.of("result", "success");
    }

    // 회원 탈퇴
    @PutMapping("/{email}/disable")
    public ResponseEntity<Member> disableMember(@PathVariable String email) {
        Member updatedMember = memberService.disableMember(email);
        log.info("************ MemberController - disableMember : {}", email);
        return ResponseEntity.ok(updatedMember);
    }
}
