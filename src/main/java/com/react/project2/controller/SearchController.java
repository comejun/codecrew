package com.react.project2.controller;

import com.react.project2.domain.Study;
import com.react.project2.service.SearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;


@RestController
public class SearchController {

    @Autowired
    private SearchService searchService;

    @GetMapping("/search")
    public List<Study> searchProducts(@RequestParam String keyword) {
        return searchService.searchStudy(keyword);
    }
}
