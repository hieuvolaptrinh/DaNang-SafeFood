package com.danang.safefood.controller.user;

import com.danang.safefood.dto.response.ApiResponse;
import com.danang.safefood.dto.response.DashboardResponse;
import com.danang.safefood.service.ThongKeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/user/thongke")
@RequiredArgsConstructor
public class ThongKeUserController {

    private final ThongKeService thongKeService;

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<DashboardResponse>> getDashboard() {
        return ResponseEntity.ok(ApiResponse.success(thongKeService.getDashboard()));
    }
}
