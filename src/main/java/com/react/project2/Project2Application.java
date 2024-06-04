package com.react.project2;

import com.react.project2.domain.Study;
import com.react.project2.repository.StudyRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.util.Arrays;

@SpringBootApplication
public class Project2Application {

    public static void main(String[] args) {
        SpringApplication.run(Project2Application.class, args);
    }

    @Bean
    CommandLineRunner initDatabase(StudyRepository studyRepository) {
        return args -> {
            studyRepository.saveAll(Arrays.asList(
                    new Study(1L, "Study A"),
                    new Study(2L, "Study B"),
                    new Study(3L, "Study C"),
                    new Study(4L, "Study D"),
                    new Study(5L, "Study E")
            ));
        };
    }

}
