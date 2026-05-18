package com.danang.safefood.controller.user;

import com.danang.safefood.config.security.jwt.JwtPrincipal;
import com.danang.safefood.dto.request.CreatePaymentRequest;
import com.danang.safefood.dto.response.ApiResponse;
import com.danang.safefood.dto.response.PaymentResponse;
import com.danang.safefood.dto.response.ViPhamResponse;
import com.danang.safefood.service.KhacPhucService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/**
 * API cho CSKD:
 *  - GET   /api/user/khac-phuc/vi-pham/{maViPham}        — chi tiết vi phạm
 *  - POST  /api/user/khac-phuc/payment                   — tạo link thanh toán PayOS
 *  - GET   /api/user/khac-phuc/payment/{orderCode}       — xem chi tiết giao dịch
 *  - POST  /api/user/khac-phuc/payment/{orderCode}/sync  — đồng bộ trạng thái với PayOS
 */
@RestController
@RequestMapping("/api/user/khac-phuc")
@RequiredArgsConstructor
public class KhacPhucController {

    private final KhacPhucService khacPhucService;

    @GetMapping("/vi-pham/{maViPham}")
    public ResponseEntity<ApiResponse<ViPhamResponse>> getViPham(@PathVariable String maViPham) {
        return ResponseEntity.ok(ApiResponse.success(khacPhucService.getViPhamDetail(maViPham)));
    }

    @PostMapping("/payment")
    public ResponseEntity<ApiResponse<PaymentResponse>> createPayment(
            @AuthenticationPrincipal JwtPrincipal jwt,
            @Valid @RequestBody CreatePaymentRequest req) {
        if (jwt == null || jwt.userId() == null) {
            throw new RuntimeException("Không thể xác định người dùng");
        }
        var result = khacPhucService.createPaymentForViPham(req.maViPham(), jwt.userId(), req.description());
        return ResponseEntity.ok(ApiResponse.success("Tạo link thanh toán thành công", result));
    }

    @GetMapping("/payment/{orderCode}")
    public ResponseEntity<ApiResponse<PaymentResponse>> getPayment(@PathVariable Long orderCode) {
        return ResponseEntity.ok(ApiResponse.success(khacPhucService.getPaymentByOrderCode(orderCode)));
    }

    @PostMapping("/payment/{orderCode}/sync")
    public ResponseEntity<ApiResponse<PaymentResponse>> syncPayment(@PathVariable Long orderCode) {
        return ResponseEntity.ok(ApiResponse.success(khacPhucService.syncPaymentStatus(orderCode)));
    }
}
