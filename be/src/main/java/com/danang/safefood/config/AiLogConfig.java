package com.danang.safefood.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.client.RestClient;

import java.time.Duration;

/**
 * Cấu hình RestClient gọi AI service phát hiện login bất thường.
 * Base URL được cấu hình qua property `ai.log.url` (mặc định http://localhost:8000).
 */
@Configuration
public class AiLogConfig {

    @Bean(name = "aiLogRestClient")
    public RestClient aiLogRestClient(@Value("${ai.log.url:http://localhost:8000}") String baseUrl) {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout((int) Duration.ofSeconds(2).toMillis());
        factory.setReadTimeout((int) Duration.ofSeconds(3).toMillis());

        return RestClient.builder()
                .baseUrl(baseUrl)
                .requestFactory(factory)
                .build();
    }
}
