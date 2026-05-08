package com.danang.safefood.controller.LanhDaoVSATTP;

import com.danang.safefood.dto.response.ApiResponse;
import com.danang.safefood.dto.response.DashboardResponse;
import com.danang.safefood.dto.response.ThongKeHoKinhDoanhResponse;
import com.danang.safefood.dto.response.ThongKeViPhamResponse;
import com.danang.safefood.service.ThongKeService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/thongke")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('LD_ATVSTP','QUAN_TRI_HE_THONG')")
public class ThongKeController {

    private final ThongKeService thongKeService;

    @GetMapping("/vi-pham")
    public ResponseEntity<ApiResponse<ThongKeViPhamResponse>> thongKeViPham(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to,
            @RequestParam(required = false) String khuVuc) {
        return ResponseEntity.ok(ApiResponse.success(thongKeService.thongKeViPham(from, to, khuVuc)));
    }

    @GetMapping("/hokinhdoanh")
    public ResponseEntity<ApiResponse<ThongKeHoKinhDoanhResponse>> thongKeHoKinhDoanh(
            @RequestParam(required = false) String maPX) {
        return ResponseEntity.ok(ApiResponse.success(thongKeService.thongKeHoKinhDoanh(maPX)));
    }

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<DashboardResponse>> getDashboard() {
        return ResponseEntity.ok(ApiResponse.success(thongKeService.getDashboard()));
    }
}
