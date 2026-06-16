package com.trustagro;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
@org.springframework.scheduling.annotation.EnableAsync
public class TrustAgroApplication {
    public static void main(String[] args) {
        SpringApplication.run(TrustAgroApplication.class, args);
    }
}
