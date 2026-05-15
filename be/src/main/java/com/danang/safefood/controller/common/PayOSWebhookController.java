package com.danang.safefood.controller.common;

import com.danang.safefood.service.KhacPhucService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * Webhook PayOS sẽ POST đến endpoint này khi giao dịch hoàn tất.
 *
 *  - URL public:  https://safe-food.vndtech.vn/v1/webhook/payos
 *  - Mapping:     POST /v1/webhook/payos
 *
 * Endpoint PUBLIC (không cần JWT).
 *
 * QUAN TRỌNG: Webhook BẮT BUỘC trả 2xx cho PayOS, kể cả khi xử lý lỗi.
 * Nếu trả 5xx, PayOS sẽ retry liên tục và đánh dấu webhook là "failed".
 */
@RestController
@RequestMapping("/v1/webhook")
@RequiredArgsConstructor
@Slf4j
public class PayOSWebhookController {

    private final KhacPhucService khacPhucService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * Endpoint PayOS dùng để verify webhook lúc cấu hình.
     * PayOS gọi GET (hoặc POST với body trống) để kiểm tra URL có sống không.
     */
    @GetMapping("/payos")
    public ResponseEntity<Map<String, Object>> verifyWebhook() {
        return ResponseEntity.ok(Map.of(
                "code", "00",
                "desc", "OK",
                "data", "Webhook PayOS is alive"));
    }

    @PostMapping(value = "/payos", consumes = MediaType.ALL_VALUE)
    public ResponseEntity<Map<String, Object>> payOSWebhook(@RequestBody(required = false) String rawBody) {
        log.info("[Webhook PayOS] received raw body: {}", rawBody);

        // Body trống → là ping của PayOS lúc verify
        if (rawBody == null || rawBody.isBlank()) {
            return ResponseEntity.ok(Map.of("code", "00", "desc", "OK"));
        }

        try {
            JsonNode payload = objectMapper.readTree(rawBody);
            khacPhucService.handleWebhook(payload);
            return ResponseEntity.ok(Map.of("code", "00", "desc", "OK"));
        } catch (Exception e) {
            // KHÔNG throw — chỉ log để PayOS không retry vô hạn
            log.error("[Webhook PayOS] xử lý lỗi: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.OK).body(Map.of(
                    "code", "00",
                    "desc", "Acknowledged with error: " + e.getMessage()));
        }
    }
}
