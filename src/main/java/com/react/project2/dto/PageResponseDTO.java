package com.react.project2.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Data
public class PageResponseDTO<E> {
    private List<E> list;
    private List<Integer> pageNumList;
    private PageRequestDTO pageRequestDTO;
    private boolean prev, next;
    private long totalCount;
    private int prevPage, nextPage;
    private int pageNumLength;
    private int current;
    private final int PAGE_NUM_UNIT = 10; // 한페이지당 갯수
    private boolean hasMoreList;

    @Builder(builderMethodName = "withListHasMore") // 속성명 주의!!!
    public PageResponseDTO(List<E> list, PageRequestDTO pageRequestDTO, long totalCount, boolean hasMoreList) {
        this.list = list;
        this.pageRequestDTO = pageRequestDTO;
        this.totalCount = totalCount;
        this.hasMoreList = hasMoreList;

        // 화면에 보여줄 마지막 페이지번호
        int endPage = (int) (Math.ceil(pageRequestDTO.getPage() / (double) PAGE_NUM_UNIT)) * PAGE_NUM_UNIT;
        // 화면에 보여줄 첫 페이지 번호

        int startPage = endPage - (PAGE_NUM_UNIT - 1);
        // 최종페이지번호
        int lastPage = (int) (Math.ceil(totalCount / (double) pageRequestDTO.getSize()));
        // endPage 조정
        endPage = endPage > lastPage ? lastPage : endPage;

        this.prev = startPage > 1;
        this.next = totalCount > endPage * pageRequestDTO.getSize();

        this.pageNumList = IntStream.rangeClosed(startPage, endPage).boxed().collect(Collectors.toList());
        this.pageNumLength = this.pageNumList.size();

        if (prev) {
            this.prevPage = startPage - 1;
        }
        if (next) {
            this.nextPage = endPage + 1;
        }

        this.current = this.pageRequestDTO.getPage();

        // 출력해서 확인
        System.out.println("pageRequestDTO = " + pageRequestDTO);
        System.out.println("startPage = " + startPage);
        System.out.println("endPage = " + endPage);
        System.out.println("lastPage = " + lastPage);
        System.out.println("totalCount = " + totalCount);
        System.out.println("pageNumList = " + pageNumList);
        System.out.println("pageNumLength = " + pageNumLength);
        System.out.println("current = " + current);
        System.out.println("prev = " + prev);
        System.out.println("prevPage = " + prevPage);
        System.out.println("next = " + next);
        System.out.println("nextPage = " + nextPage);
    }

    // 생성자 추가
    @Builder(builderMethodName = "withList") // 속성명 주의!!!
    public PageResponseDTO(List<E> list, PageRequestDTO pageRequestDTO, long totalCount) {
        this.list = list;
        this.pageRequestDTO = pageRequestDTO;
        this.totalCount = totalCount;

        // 화면에 보여줄 마지막 페이지번호
        int endPage = (int) (Math.ceil(pageRequestDTO.getPage() / (double) PAGE_NUM_UNIT)) * PAGE_NUM_UNIT;
        // 화면에 보여줄 첫 페이지 번호

        int startPage = endPage - (PAGE_NUM_UNIT - 1);
        // 최종페이지번호
        int lastPage = (int) (Math.ceil(totalCount / (double) pageRequestDTO.getSize()));
        // endPage 조정
        endPage = endPage > lastPage ? lastPage : endPage;

        this.prev = startPage > 1;
        this.next = totalCount > endPage * pageRequestDTO.getSize();

        this.pageNumList = IntStream.rangeClosed(startPage, endPage).boxed().collect(Collectors.toList());
        this.pageNumLength = this.pageNumList.size();

        if (prev) {
            this.prevPage = startPage - 1;
        }
        if (next) {
            this.nextPage = endPage + 1;
        }

        this.current = this.pageRequestDTO.getPage();



        // 출력해서 확인
        System.out.println("pageRequestDTO = " + pageRequestDTO);
        System.out.println("startPage = " + startPage);
        System.out.println("endPage = " + endPage);
        System.out.println("lastPage = " + lastPage);
        System.out.println("totalCount = " + totalCount);
        System.out.println("pageNumList = " + pageNumList);
        System.out.println("pageNumLength = " + pageNumLength);
        System.out.println("current = " + current);
        System.out.println("prev = " + prev);
        System.out.println("prevPage = " + prevPage);
        System.out.println("next = " + next);
        System.out.println("nextPage = " + nextPage);
    }
}
