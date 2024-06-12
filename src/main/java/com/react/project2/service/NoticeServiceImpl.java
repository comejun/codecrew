package com.react.project2.service;

import com.react.project2.domain.Member;
import com.react.project2.dto.NoticeDTO;
import com.react.project2.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class NoticeServiceImpl implements NoticeService {

    private final MemberRepository memberRepository;
    @Override
    public List<NoticeDTO> getNoticeList(String email) {
        Member memberWithNoticeList = memberRepository.getMemberWithNoticeList(email);
        memberWithNoticeList.getNoticeList().sort((n1, n2) -> n2.getCreatedDate().compareTo(n1.getCreatedDate()));

        return memberWithNoticeList.getNoticeList().stream().map(notice -> {
            return new NoticeDTO().entityToDTO(notice, memberWithNoticeList.getNickname());

        }).toList();

    }

    @Override
    public void deleteNotice(String email, Long noticeId) {
        Member member = memberRepository.findById(email).orElseThrow();
        member.getNoticeList().removeIf(notice -> notice.getNoticeId().equals(noticeId));
        memberRepository.save(member);
    }
}
