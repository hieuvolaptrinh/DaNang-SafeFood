package com.danang.safefood.controller.common;

import com.danang.safefood.dto.response.ApiResponse;
import com.danang.safefood.service.KhacPhucService;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Webhook PayOS sẽ POST đến endpoint này khi giao dịch hoàn tất.
 *
 *  - URL public:  https://safe-food.vndtech.vn/v1/webhook/payos
 *  - Mapping:     POST /v1/webhook/payos
 *
 * Endpoint này được PUBLIC (không cần JWT) — verify bằng PayOS signature.
 */
@RestController
@RequestMapping("/v1/webhook")
@RequiredArgsConstructor
@Slf4j
public class PayOSWebhookController {

    private final KhacPhucService khacPhucService;

    @PostMapping("/payos")
    public ResponseEntity<ApiResponse<String>> payOSWebhook(@RequestBody JsonNode payload) {
        log.info("[Webhook PayOS] received: {}", payload);
        try {
            khacPhucService.handleWebhook(payload);
            return ResponseEntity.ok(ApiResponse.success("Webhook xử lý thành công", "OK"));
        } catch (Exception e) {
            log.error("[Webhook PayOS] error", e);
            return ResponseEntity.ok(ApiResponse.error(400, e.getMessage()));
        }
    }
}
