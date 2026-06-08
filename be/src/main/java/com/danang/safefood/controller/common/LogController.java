package com.danang.safefood.controller.common;

import com.danang.safefood.config.security.jwt.JwtPrincipal;
import com.danang.safefood.dto.response.ApiResponse;
import com.danang.safefood.dto.response.LogResponse;
import com.danang.safefood.service.LogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * API tra cứu lịch sử đăng nhập của người dùng đang đăng nhập.
 * Hiển thị ở màn hình "Lịch sử đăng nhập" trong trang cá nhân.
 */
@RestController
@RequestMapping("/api/log")
@RequiredArgsConstructor
public class LogController {

    private final LogService logService;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<List<LogResponse>>> myLoginHistory(
            @AuthenticationPrincipal JwtPrincipal jwt) {
        return ResponseEntity.ok(
                ApiResponse.success(logService.getLoginHistory(jwt.userId())));
    }
}
