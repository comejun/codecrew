package com.react.project2.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.react.project2.domain.Category;
import com.react.project2.domain.Member;
import com.react.project2.domain.Notice;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;


@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DataMemberDTO {

    private String email;
    private String password;
    private String nickname;
    private String phone;
    private String profileImg;
    private String memberLink;
    private String introduction;
    private boolean disabled;
    private List<Category> favoriteList;
    private int penalty;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime blockedDate;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdDate;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime disabledDate;
    private String role;
    private boolean isNew;



}
