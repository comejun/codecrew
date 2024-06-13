package com.react.project2.service;

import com.react.project2.domain.Member;
import com.react.project2.domain.NoticeType;
import com.react.project2.domain.Study;
import com.react.project2.domain.StudyMember;
import com.react.project2.dto.NoticeDTO;
import com.react.project2.repository.MemberRepository;
import com.react.project2.repository.StudyRepository;
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
    private final StudyRepository studyRepository;
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

    @Override
    public void createNotice(Long studtyId, String userEmail, boolean creator, NoticeType type) {
        Study study = studyRepository.findById(studtyId).orElseThrow();
        if (creator) {
            userEmail = study.getMember().getEmail();
        }
        if (userEmail.equals("ALL")) {
            List<StudyMember> studyMemberList = study.getStudyMemberList();
            for (StudyMember studyMember : studyMemberList) {
                Member member = memberRepository.findByEmail(studyMember.getEmail()).orElseThrow();
                // noticeId 추가
                member.addNotice(study, creator, type);
                memberRepository.save(member);
            }
            return;
        }
        Member member = memberRepository.findByEmail(userEmail).orElseThrow();
        member.addNotice(study, creator, type);
        memberRepository.save(member);
    }
}
