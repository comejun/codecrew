package com.react.project2.repository;

import com.react.project2.domain.Category;
import com.react.project2.domain.Member;
import com.react.project2.domain.Study;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONException;
import org.json.JSONObject;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;


@SpringBootTest
@Slf4j
class StudyRepositoryTest {

    @Autowired
    private StudyRepository studyRepository;
    @Autowired
    private MemberRepository memberRepository;

    public String convertCoordinatesToAddress(double latitude, double longitude) {
        String apiKey = "32bb26db068923f19fd3390bbf77862a"; // 여기에 실제 API 키를 입력해야 합니다.
        String requestUrl = "https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?x=" + longitude + "&y=" + latitude;

        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", "KakaoAK " + apiKey);
        HttpEntity<String> entity = new HttpEntity<>("parameters", headers);
        ResponseEntity<String> response = restTemplate.exchange(requestUrl, HttpMethod.GET, entity, String.class);
        JSONObject jsonObject = null;
        try {
            jsonObject = new JSONObject(response.getBody());
        } catch (JSONException e) {
            throw new RuntimeException(e);
        }
        String addressName = null;
        try {
            addressName = jsonObject.getJSONArray("documents").getJSONObject(0).getString("address_name");
        } catch (JSONException e) {
            throw new RuntimeException(e);
        }

        return addressName;
    }

    @Test
    public void testInsert() {
        for (int i = 0; i < 300; i++) {

            // 37.57163048751097, 126.9768859784546

//            37.58 ~ 37.59 사이 랜덤값 생성
            double locationY = 37.000000 + Math.random() * (38.000000 - 37.000000);
// 126.9668859784500 ~ 126.9868859784600 사이 랜덤값 생성
            double locationX = 126.500000 + Math.random() * (127.500000 - 126.500000);

            Category category = Category.values()[(int) (Math.random() * Category.values().length)];


            // 현재 시간 부터 2주뒤 사이의 랜덤 시간 생성
            LocalDateTime studyDate = LocalDateTime.now().plusDays((long) (Math.random() * 14));
            // studyDate 부터 1일 뒤 사이의 랜덤 시간 생성
            LocalDateTime studyDeadlineDate = studyDate.plusDays((long) (Math.random() * 1));


            Study study = Study.builder()
                    .thImg("http://k.kakaocdn.net/dn/RF8yG/btsHJAyluMZ/6PBluJnX4JhhVOY47cJcx0/img_640x640.jpg")
                    .title(category + " title" + i)
                    .content("content" + i)
                    .location(convertCoordinatesToAddress(locationY, locationX))
                    .studyDeadlineDate(studyDeadlineDate)
                    .locationX(locationX)
                    .locationY(locationY)
                    .member(memberRepository.findByEmail("comejun@naver.com").get())
                    .studyDate(studyDate)
                    .maxPeople(10)
                    .category(category)
                    .build();

            studyRepository.save(study);
        }
    }

}