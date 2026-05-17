package com.danang.safefood.controller.ThanhTra;

import com.danang.safefood.config.security.jwt.JwtPrincipal;
import com.danang.safefood.dto.request.CreateYeuCauKiemNghiemRequest;
import com.danang.safefood.dto.request.UpdateKetQuaKiemNghiemRequest;
import com.danang.safefood.dto.response.ApiResponse;
import com.danang.safefood.dto.response.YeuCauKiemNghiemResponse;
import com.danang.safefood.dto.response.YeuCauKiemNghiemStatsResponse;
import com.danang.safefood.service.YeuCauKiemNghiemService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/yeu-cau-kiem-nghiem")
@RequiredArgsConstructor
public class YeuCauKiemNghiemController {

    private final YeuCauKiemNghiemService yeuCauService;

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<YeuCauKiemNghiemStatsResponse>> getStats() {
        return ResponseEntity.ok(
                ApiResponse.success("Lay thong ke thanh cong", yeuCauService.getStats())
        );
    }

    @GetMapping
    public ResponseEntity<Page<YeuCauKiemNghiemResponse>> searchYeuCau(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(yeuCauService.searchYeuCau(keyword, status, pageable));
    }

    @GetMapping("/{maYeuCau}")
    public ResponseEntity<ApiResponse<YeuCauKiemNghiemResponse>> getYeuCauById(
            @PathVariable String maYeuCau) {
        return ResponseEntity.ok(
                ApiResponse.success("Lay chi tiet thanh cong", yeuCauService.getYeuCauById(maYeuCau))
        );
    }

    @PostMapping
    public ResponseEntity<ApiResponse<YeuCauKiemNghiemResponse>> createYeuCau(
            @Valid @RequestBody CreateYeuCauKiemNghiemRequest req,
            @AuthenticationPrincipal JwtPrincipal jwtPrincipal) {
        return ResponseEntity.ok(
                ApiResponse.success("Tao yeu cau thanh cong", yeuCauService.createYeuCau(req, jwtPrincipal))
        );
    }

    @PutMapping("/{maYeuCau}/ket-qua")
    public ResponseEntity<ApiResponse<YeuCauKiemNghiemResponse>> updateKetQua(
            @PathVariable String maYeuCau,
            @Valid @RequestBody UpdateKetQuaKiemNghiemRequest req) {
        return ResponseEntity.ok(
                ApiResponse.success("Cap nhat ket qua thanh cong", yeuCauService.updateKetQua(maYeuCau, req))
        );
    }
}
