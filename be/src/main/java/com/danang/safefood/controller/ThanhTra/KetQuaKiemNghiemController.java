package com.danang.safefood.controller.ThanhTra;

import com.danang.safefood.dto.response.ApiResponse;
import com.danang.safefood.dto.response.KetQuaKiemNghiemDetailResponse;
import com.danang.safefood.dto.response.KetQuaKiemNghiemItemResponse;
import com.danang.safefood.dto.response.KetQuaKiemNghiemStatsResponse;
import com.danang.safefood.service.KetQuaKiemNghiemService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/ket-qua-kiem-nghiem")
@RequiredArgsConstructor
public class KetQuaKiemNghiemController {

    private final KetQuaKiemNghiemService ketQuaKiemNghiemService;

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<KetQuaKiemNghiemStatsResponse>> getStats() {
        return ResponseEntity.ok(
                ApiResponse.success("Lay thong ke ket qua kiem nghiem thanh cong", ketQuaKiemNghiemService.getStats())
        );
    }

    @GetMapping
    public ResponseEntity<Page<KetQuaKiemNghiemItemResponse>> search(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String result,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(ketQuaKiemNghiemService.search(keyword, result, pageable));
    }

    @GetMapping("/{maKetQua}")
    public ResponseEntity<ApiResponse<KetQuaKiemNghiemDetailResponse>> getById(@PathVariable String maKetQua) {
        return ResponseEntity.ok(
                ApiResponse.success("Lay chi tiet ket qua kiem nghiem thanh cong", ketQuaKiemNghiemService.getById(maKetQua))
        );
    }
}
