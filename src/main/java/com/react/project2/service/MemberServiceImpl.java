package com.react.project2.service;

import com.react.project2.domain.Member;
import com.react.project2.dto.DataMemberDTO;
import com.react.project2.dto.MemberDTO;
import com.react.project2.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponents;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.LinkedHashMap;
import java.util.Optional;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class MemberServiceImpl implements MemberService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;
    private final ModelMapper modelMapper;

    @Override
    public MemberDTO getKakaoMember(String accessToken) {
        String email = getEmailFromKakaoAccessToken(accessToken);
        log.info("************ MemberService - getKakaoMember -email : {}", email);

        // DB에 회원이 있는지 조회
        Optional<Member> findMember = Optional.ofNullable(memberRepository.getMemberWithFavoriteList(email));
        // 기존회원 -> 로그인
        if (findMember.isPresent()) {
            log.info("기존 회원");
            MemberDTO memberDTO =entityToDto(findMember.get());
            log.info("************ MemberService - getKakaoMember -memberDTO : {}", memberDTO);
            return memberDTO;
        }
        // 신규회원 -> 회원가입
        // 임시 비번으로 회원 DB에 저장, 해당 정보로 memberDTO 생성해서 리턴
        log.info("신규 회원");
        Member socialMember = makeSocialMember(email, accessToken); // 소셜회원으로 만들어 받기
        MemberDTO memberDTO = entityToDto(socialMember);
        // 신규 회원 저장
        memberRepository.save(socialMember);
        return memberDTO;
    }

    @Override
    public DataMemberDTO getMember(String email) {
        Member findMember = memberRepository.getMemberWithFavoriteList(email);
        // Member Entity -> DataMemberDTO
        DataMemberDTO dataMemberDTO = modelMapper.map(findMember, DataMemberDTO.class);
        return dataMemberDTO;
    }

    @Override
    public void modifyMember(DataMemberDTO dataMemberDTO) {
        // DataMemberDTO -> Member Entity
        Member member=  memberRepository.getMemberWithFavoriteList(dataMemberDTO.getEmail());
        member.changeMemberLink(dataMemberDTO.getMemberLink());
        member.changeIntroduction(dataMemberDTO.getIntroduction());
        member.changeNickname(dataMemberDTO.getNickname());
        member.changeProfileImg(dataMemberDTO.getProfileImg());
        member.changeFavoriteList(dataMemberDTO.getFavoriteList());
        member.changePhone(dataMemberDTO.getPhone());
        memberRepository.save(member);

    }

    @Override
    public DataMemberDTO findMemberByPhone(String phone) {
        Member findMember = memberRepository.findMemberByPhone(phone);
        if (findMember != null) {
            DataMemberDTO dataMemberDTO = modelMapper.map(findMember, DataMemberDTO.class);
            return dataMemberDTO;
        }
        return null;
    }

    // 소셜회원 정보로 Member Entity 생성
    private Member makeSocialMember(String email, String accessToken) {
        // 임시비번 만들어서 Member 엔티티 생성해 리턴
        String tmpPassword = makeTempPassword();
        log.info("****** MemberService - tmpPassword : {}", tmpPassword);

        Object kakaoAccount = getDataFromKakaoAccesToken(accessToken);

        log.info("****** MemberService - kakaoAccount : {}", kakaoAccount);
        // kakaoAccount 에서 닉네임, 프로필 사진 받아서 Member 엔티티 생성
        // 닉네임, 프로필 사진이 없을 경우를 대비해서 기본값 설정
        String nickname = "SocialMember";
        String profile = "";
        if (kakaoAccount != null) {
            LinkedHashMap<String, String> account = (LinkedHashMap<String, String>) kakaoAccount;
            if (account.get("nickname") != null && !account.get("nickname").equals("")) {
                nickname = account.get("nickname");
            }
            if (account.get("profile_image_url") != null && !account.get("profile_image_url").equals("")) {
                profile = account.get("profile_image_url");
            }
            log.info("****** MemberService - nickname : {}", nickname);
            log.info("****** MemberService - profile : {}", profile);

        }
        boolean needChangeProfile = false;


        if (nickname.equals("SocialMember")&&profile.equals("")) {
            needChangeProfile = true;
        }

//        String nickname = "SocialMember";
        Member member = Member.builder()
                .email(email)
                .password(passwordEncoder.encode(tmpPassword))
                .nickname(nickname)
                .profileImg(profile)
                .isNew(needChangeProfile)
                .build();
        return member;
    }

    // 임시비번 만들어주는 메서드
    private String makeTempPassword() {
        // char 한글자씩 랜덤으로 누적 추가해서 문자열 만들어주기
        StringBuffer stringBuffer = new StringBuffer();
        for (int i = 0; i < 10; i++) {
            stringBuffer.append((char) ((int) (Math.random() * 55) + 65));
        }
        return stringBuffer.toString(); // 문자열로 리턴
    }


    private String getEmailFromKakaoAccessToken(String accessToken) {
// 카카오 사용자 정보 요청
        String kakakoGetUserURL = "https://kapi.kakao.com/v2/user/me";
        if (accessToken == null) {
            throw new RuntimeException("Access Token is null");
        }
        // 카카오서버에 RestTemplate 으로 사용자 정보 HTTP 요청
        RestTemplate restTemplate = new RestTemplate();
        // 헤더정보 생성
        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", "Bearer " + accessToken);
        headers.add("Content-type", "application/x-www-form-urlencoded;charset=utf-8");
        // 헤더 정보를 포함함 HttpEntity로 요청 객체 만들기 (request)
        HttpEntity<String> entity = new HttpEntity<>(headers);
        // 요청 경로 생성해주는 클래스 이용
        UriComponents uriBuild =
                UriComponentsBuilder.fromHttpUrl(kakakoGetUserURL).build();
        // RestTemplate의 exchange() 메서드를 이용해 요청보내기 -> 리턴은 Map
        ResponseEntity<LinkedHashMap> response =
                restTemplate.exchange(uriBuild.toString(), HttpMethod.GET, entity,
                        LinkedHashMap.class);
        // Body에서 응답 데이터 꺼내기
        LinkedHashMap<String, LinkedHashMap> body = response.getBody();
        // 응답 내용 중 카카오 계정 정보 꺼내기
        LinkedHashMap<String, String> kakaoAccount = body.get("kakao_account");
        return kakaoAccount.get("email"); // 이메일만 꺼내서 리턴
    }

    // 카카오 사용자 닉네임, 프로필 사진 가져오기
    private Object getDataFromKakaoAccesToken(String accessToken) {
        // 카카오 사용자 정보 요청
        String kakakoGetUserURL = "https://kapi.kakao.com/v2/user/me";
        if (accessToken == null) {
            throw new RuntimeException("Access Token is null");
        }
        // 카카오서버에 RestTemplate 으로 사용자 정보 HTTP 요청
        RestTemplate restTemplate = new RestTemplate();
        // 헤더정보 생성
        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", "Bearer " + accessToken);
        headers.add("Content-type", "application/x-www-form-urlencoded;charset=utf-8");
        // 헤더 정보를 포함함 HttpEntity로 요청 객체 만들기 (request)
        HttpEntity<String> entity = new HttpEntity<>(headers);
        // 요청 경로 생성해주는 클래스 이용
        UriComponents uriBuild =
                UriComponentsBuilder.fromHttpUrl(kakakoGetUserURL).build();
        // RestTemplate의 exchange() 메서드를 이용해 요청보내기 -> 리턴은 Map
        ResponseEntity<LinkedHashMap> response =
                restTemplate.exchange(uriBuild.toString(), HttpMethod.GET, entity,
                        LinkedHashMap.class);
        // Body에서 응답 데이터 꺼내기
        LinkedHashMap<String, LinkedHashMap> body = response.getBody();
        // 응답 내용 중 카카오 계정 정보 꺼내기
        Object kakaoAccount = body.get("kakao_account").get("profile");

        return kakaoAccount;
    }

}
