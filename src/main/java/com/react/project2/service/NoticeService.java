package com.react.project2.service;

import com.react.project2.dto.NoticeDTO;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Transactional
public interface NoticeService {
List<NoticeDTO>getNoticeList(String email);

    void deleteNotice(String email, Long noticeId);
}
