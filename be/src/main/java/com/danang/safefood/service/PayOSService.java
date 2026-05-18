package com.danang.safefood.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.util.*;

/**
 * Service tích hợp PayOS - tạo link thanh toán và xác thực webhook.
 *
 * Tài liệu: https://payos.vn/docs/api/
 *
 * Yêu cầu khi gọi PayOS API:
 *  - Header x-client-id, x-api-key
 *  - Body chứa signature HMAC-SHA256 ký từ các trường (sort theo tên field).
 *
 * Webhook PayOS gửi đến `/api/webhook/payos` khi giao dịch hoàn tất.
 */
@Service
@Slf4j
public class PayOSService {

    private final String clientId;
    private final String apiKey;
    private final String checksumKey;
    private final String returnUrl;
    private final String cancelUrl;
    private final String apiBaseUrl;

    private final RestClient restClient;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public PayOSService(
            @Value("${payos.client-id}") String clientId,
            @Value("${payos.api-key}") String apiKey,
            @Value("${payos.checksum-key}") String checksumKey,
            @Value("${payos.return-url}") String returnUrl,
            @Value("${payos.cancel-url}") String cancelUrl,
            @Value("${payos.api-base-url}") String apiBaseUrl) {
        this.clientId = clientId;
        this.apiKey = apiKey;
        this.checksumKey = checksumKey;
        this.returnUrl = returnUrl;
        this.cancelUrl = cancelUrl;
        this.apiBaseUrl = apiBaseUrl;
        this.restClient = RestClient.builder().baseUrl(apiBaseUrl).build();
    }

    /**
     * Kết quả tạo link thanh toán
     */
    public record CreatePaymentResult(
            Long orderCode,
            String checkoutUrl,
            String qrCode,
            String bin,
            String accountNumber,
            String accountName,
            String description,
            BigDecimal amount,
            Long expiredAt) {
    }

    /**
     * Tạo link thanh toán PayOS.
     *
     * @param orderCode   mã đơn hàng (dạng số, unique)
     * @param amount      số tiền (VND)
     * @param description mô tả (max 25 ký tự)
     * @param buyerName   tên người mua
     * @param buyerEmail  email người mua
     * @param buyerPhone  số điện thoại người mua
     * @param webhookUrl  webhook url (PayOS sẽ POST khi giao dịch hoàn tất)
     */
    public CreatePaymentResult createPaymentLink(
            Long orderCode,
            long amount,
            String description,
            String buyerName,
            String buyerEmail,
            String buyerPhone,
            String webhookUrl) {

        String safeDesc = description == null ? "" : description;
        if (safeDesc.length() > 25) safeDesc = safeDesc.substring(0, 25);

        ObjectNode body = objectMapper.createObjectNode();
        body.put("orderCode", orderCode);
        body.put("amount", amount);
        body.put("description", safeDesc);
        body.put("cancelUrl", cancelUrl);
        body.put("returnUrl", returnUrl);

        // Items (PayOS yêu cầu mảng item)
        var items = body.putArray("items");
        ObjectNode item = items.addObject();
        item.put("name", safeDesc.isEmpty() ? "Nop phat ATTP" : safeDesc);
        item.put("quantity", 1);
        item.put("price", amount);

        if (buyerName != null) body.put("buyerName", buyerName);
        if (buyerEmail != null) body.put("buyerEmail", buyerEmail);
        if (buyerPhone != null) body.put("buyerPhone", buyerPhone);

        // Tạo signature
        // Theo PayOS: signature = HMAC-SHA256(checksumKey,
        //   "amount=...&cancelUrl=...&description=...&orderCode=...&returnUrl=...")
        String dataToSign = "amount=" + amount
                + "&cancelUrl=" + cancelUrl
                + "&description=" + safeDesc
                + "&orderCode=" + orderCode
                + "&returnUrl=" + returnUrl;
        body.put("signature", hmacSha256(checksumKey, dataToSign));

        try {
            String responseStr = restClient.post()
                    .uri("/v2/payment-requests")
                    .header("x-client-id", clientId)
                    .header("x-api-key", apiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(body.toString())
                    .retrieve()
                    .body(String.class);

            log.info("[PayOS] create response: {}", responseStr);
            JsonNode response = objectMapper.readTree(responseStr);

            String code = response.path("code").asText();
            if (!"00".equals(code)) {
                throw new RuntimeException("PayOS lỗi: " + response.path("desc").asText());
            }

            JsonNode data = response.path("data");
            return new CreatePaymentResult(
                    data.path("orderCode").asLong(),
                    data.path("checkoutUrl").asText(null),
                    data.path("qrCode").asText(null),
                    data.path("bin").asText(null),
                    data.path("accountNumber").asText(null),
                    data.path("accountName").asText(null),
                    data.path("description").asText(safeDesc),
                    BigDecimal.valueOf(data.path("amount").asLong()),
                    data.path("expiredAt").isMissingNode() ? null : data.path("expiredAt").asLong());
        } catch (Exception e) {
            log.error("[PayOS] createPaymentLink error", e);
            throw new RuntimeException("Không thể tạo link thanh toán: " + e.getMessage(), e);
        }
    }

    /**
     * Lấy thông tin giao dịch theo orderCode.
     */
    public JsonNode getPaymentInfo(Long orderCode) {
        try {
            String responseStr = restClient.get()
                    .uri("/v2/payment-requests/{orderCode}", orderCode)
                    .header("x-client-id", clientId)
                    .header("x-api-key", apiKey)
                    .retrieve()
                    .body(String.class);

            return objectMapper.readTree(responseStr);
        } catch (Exception e) {
            log.error("[PayOS] getPaymentInfo error for orderCode={}", orderCode, e);
            throw new RuntimeException("Không thể lấy thông tin giao dịch: " + e.getMessage(), e);
        }
    }

    /**
     * Huỷ link thanh toán.
     */
    public void cancelPayment(Long orderCode, String reason) {
        try {
            ObjectNode body = objectMapper.createObjectNode();
            body.put("cancellationReason", reason == null ? "User cancelled" : reason);

            restClient.post()
                    .uri("/v2/payment-requests/{orderCode}/cancel", orderCode)
                    .header("x-client-id", clientId)
                    .header("x-api-key", apiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(body.toString())
                    .retrieve()
                    .body(String.class);
        } catch (Exception e) {
            log.error("[PayOS] cancelPayment error for orderCode={}", orderCode, e);
            throw new RuntimeException("Không thể huỷ giao dịch: " + e.getMessage(), e);
        }
    }

    /**
     * Xác thực webhook signature từ PayOS.
     * Body webhook có: code, desc, data{...}, signature.
     *
     * Cách verify: hash (HMAC-SHA256) các field trong `data` (sort theo key) → so với signature.
     */
    public boolean verifyWebhookSignature(JsonNode webhookBody) {
        try {
            String signature = webhookBody.path("signature").asText("");
            JsonNode data = webhookBody.path("data");
            if (signature.isEmpty() || data.isMissingNode()) return false;

            // Sắp xếp các trường theo key alphabet và build chuỗi
            Map<String, String> sortedFields = new TreeMap<>();
            data.fields().forEachRemaining(entry -> {
                JsonNode value = entry.getValue();
                String strVal;
                if (value.isNull()) {
                    strVal = "";
                } else if (value.isArray() || value.isObject()) {
                    strVal = value.toString();
                } else {
                    strVal = value.asText();
                }
                sortedFields.put(entry.getKey(), strVal);
            });

            StringBuilder sb = new StringBuilder();
            boolean first = true;
            for (var entry : sortedFields.entrySet()) {
                if (!first) sb.append("&");
                sb.append(entry.getKey()).append("=").append(entry.getValue());
                first = false;
            }

            String expected = hmacSha256(checksumKey, sb.toString());
            boolean ok = expected.equalsIgnoreCase(signature);
            if (!ok) {
                log.warn("[PayOS] webhook signature mismatch. expected={}, got={}", expected, signature);
            }
            return ok;
        } catch (Exception e) {
            log.error("[PayOS] verifyWebhookSignature error", e);
            return false;
        }
    }

    private String hmacSha256(String key, String data) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
            byte[] hash = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            StringBuilder hex = new StringBuilder();
            for (byte b : hash) hex.append(String.format("%02x", b));
            return hex.toString();
        } catch (Exception e) {
            throw new RuntimeException("HMAC error: " + e.getMessage(), e);
        }
    }
}
