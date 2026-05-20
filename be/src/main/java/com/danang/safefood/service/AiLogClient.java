package com.danang.safefood.service;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

/**
 * Client gọi AI service để chấm điểm tin cậy của một phiên đăng nhập.
 * Nếu AI service không phản hồi, mặc định coi là KHÔNG bất thường để
 * không chặn flow đăng nhập của người dùng.
 */
@Component
@Slf4j
public class AiLogClient {

    private final RestClient restClient;

    public AiLogClient(@Qualifier("aiLogRestClient") RestClient restClient) {
        this.restClient = restClient;
    }

    /**
     * Trả về true nếu phiên đăng nhập được model đánh giá là bất thường.
     */
    public boolean isAbnormal(String maNguoiDung,
                              String ip,
                              LocalDateTime time,
                              String location,
                              String device) {
        Map<String, Object> body = new HashMap<>();
        body.put("maNguoiDung", maNguoiDung);
        body.put("ip", ip);
        body.put("time", time != null ? time.format(DateTimeFormatter.ISO_LOCAL_DATE_TIME) : null);
        body.put("location", location);
        body.put("device", device);

        try {
            JsonNode response = restClient.post()
                    .uri("/predict")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(body)
                    .retrieve()
                    .body(JsonNode.class);

            if (response == null) {
                return false;
            }
            // Service trả về { trusted, abnormal, probability, threshold }
            if (response.hasNonNull("abnormal")) {
                return response.get("abnormal").asBoolean(false);
            }
            if (response.hasNonNull("trusted")) {
                return !response.get("trusted").asBoolean(true);
            }
            return false;
        } catch (Exception ex) {
            log.warn("AI log service không phản hồi, coi là login bình thường: {}", ex.getMessage());
            return false;
        }
    }
}
