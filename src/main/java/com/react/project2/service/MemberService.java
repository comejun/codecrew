package com.react.project2.service;

import com.react.project2.domain.Member;
import com.react.project2.dto.DataMemberDTO;
import com.react.project2.dto.MemberDTO;
import org.springframework.transaction.annotation.Transactional;

@Transactional
public interface MemberService {

    // 카카오에 회원 정보 요청
    MemberDTO getKakaoMember(String accessToken);

    // Member Entity -> MemberDTO
    default MemberDTO entityToDto(Member member){
        MemberDTO memberDTO = new MemberDTO(
            member.getEmail(),
            member.getPassword(),
            member.getNickname(),
            member.getProfileImg(),
            member.getPhone(),
            member.getMemberLink(),
            member.getIntroduction(),
            member.getFavoriteList(),
            member.isDisabled(),
            member.isNew(),
            member.getRole().toString()
        );
        return memberDTO;
    }

    // 회원 조회
    DataMemberDTO getMember(String email);

    // 회원 정보 수정 처리
    void modifyMember(DataMemberDTO dataMemberDTO);

    DataMemberDTO findMemberByPhone(String phone);

    // 회원 탈퇴
    public Member disableMember(String email);

}
