package com.react.project2.security.filter;

import com.google.gson.Gson;
import com.react.project2.domain.Category;
import com.react.project2.dto.MemberDTO;
import com.react.project2.util.JWTUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;
import java.util.Map;

@Slf4j
public class JWTCheckFilter extends OncePerRequestFilter {

    @Override
    // 필터 생략할것 지정하는 메서드 추가
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {

        // Pre-flight 요청은 필터링 하지 않음
        if (request.getMethod().equals("OPTIONS")) {
            return true;
        }

        String requestURI = request.getRequestURI();
        log.info("********* JWTCheckFilter - shouldNotFilter : requestURI : {}", requestURI);

        // TODO : 추가적으로 필터 체크 하지 않아야 할 경로 추가 필요

        //  /api/member/.. 경로는 필터링 하지 않음
        if (requestURI.startsWith("/api/member/")) {
            return true;
        }
        // 이미지 경로 요청은 필터 체크 하지 않음
        if (requestURI.startsWith("/api/image")) {
            return true;
        }
        // 카테고리 필터 불러오기 경로 요청은 체크 하지 않음
        if (requestURI.startsWith("/api/categories")) {
            return true;
        }
        // 마커 불러오기 용 경로 요청은 체크 하지 않음
        if (requestURI.startsWith("/api/map")) {
            return true;
        }
        // 스터디 상세 불러오기 경로 요청은 체크 하지 않음
        if (requestURI.matches("/api/study")) {
            return true;
        }
        return false;
//        return true;
    }

    // 필터링 로직 작성 : 추상메서드로 구현 필수
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        log.info("************ JWTCheckFilter - doFilterInternal!");

        String authValue = request.getHeader("Authorization");
        log.info("************ JWTCheckFilter - doFilterInternal : authValue : {}", authValue);
        // Bearer Xxxxxxx 형태로 전달되는 토큰값을 추출
        try {
            String accessToken = authValue.substring(7);
            Map<String, Object> claims = JWTUtil.validateToken(accessToken);
            log.info("************ JWTCheckFilter - doFilterInternal : claims : {}", claims);

            // 인증 정보 claims 로 MemberDTO 구성 -> 시큐리티에 반영 추가 (시큐리티용 권한)
            // TODO Claims에 담을 데이터 바인딩
            String email = (String) claims.get("email");
            String role = (String) claims.get("role");
            String nickname = (String) claims.get("nickname");
            String profileImg = (String) claims.get("profileImg");
            String phone = (String) claims.get("phone");
            String memberLink = (String) claims.get("memberLink");
            String introduction = (String) claims.get("introduction");
            String password = (String) claims.get("password");
            List<Category> favoriteList = null;
            boolean disabled = (boolean) claims.get("disabled");
            boolean isNew = (boolean) claims.get("isNew");

            MemberDTO memberDTO = new MemberDTO(
                    email, password, nickname, profileImg, phone,memberLink, introduction, favoriteList, disabled, isNew, role);

            log.info("************ JWTCheckFilter - doFilterInternal : memberDTO : {}", memberDTO);

            // 시큐리티 인증 추가 : JWT와 SpringSecurity 로그인상태 호환되도록 처리
            UsernamePasswordAuthenticationToken authenticationToken
                    = new UsernamePasswordAuthenticationToken(memberDTO, password, memberDTO.getAuthorities());
            SecurityContextHolder.getContext().setAuthentication(authenticationToken);

            filterChain.doFilter(request, response); // 다음필터 이동해라~
        } catch (Exception e) {
            // Access Token 검증 예외 처리
            log.error("************ JWTCheckFilter error");
            log.error(e.getMessage());

            // 에러라고 응답해줄 메세지 생성 -> 전송
            Gson gson = new Gson();
            String msg = gson.toJson(Map.of("error", "ERROR_ACCESS_TOKEN"));

            response.setContentType("application/json");
            PrintWriter writer = response.getWriter();
            writer.println(msg);
            writer.close();
        }


    }
}
