package com.react.project2.service;

import com.react.project2.domain.Study;
import com.react.project2.repository.StudyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SearchService {

    @Autowired
    private StudyRepository studyRepository;

    public List<Study> searchStudy(String keyword) {
        return studyRepository.findByTitleContainingIgnoreCase(keyword);
    }
}