package com.danang.safefood.controller.LanhDaoVSATTP;

import com.danang.safefood.dto.response.ApiResponse;
import com.danang.safefood.dto.response.HinhThucKhacPhucResponse;
import com.danang.safefood.service.HinhThucKhacPhucService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController("ldKhacPhucController")
@RequestMapping("/api/v1/khacphuc")
@RequiredArgsConstructor
public class KhacPhucController {

    private final HinhThucKhacPhucService khacPhucService;

    @GetMapping
    @PreAuthorize("hasAnyRole('LD_ATVSTP','CAN_BO_THANH_TRA','QUAN_TRI_HE_THONG')")
    public ResponseEntity<ApiResponse<Page<HinhThucKhacPhucResponse>>> getAll(
            @RequestParam(required = false) String tinhTrang,
            @RequestParam(required = false) String maViPham,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(
                khacPhucService.getAll(tinhTrang, maViPham, pageable)));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('LD_ATVSTP','CAN_BO_THANH_TRA','QUAN_TRI_HE_THONG')")
    public ResponseEntity<ApiResponse<HinhThucKhacPhucResponse>> getById(
            @PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(khacPhucService.getById(id)));
    }
}