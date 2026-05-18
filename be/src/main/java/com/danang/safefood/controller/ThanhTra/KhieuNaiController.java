package com.danang.safefood.controller.ThanhTra;

import com.danang.safefood.dto.request.KhieuNaiKiemTraRequest;
import com.danang.safefood.dto.request.KhieuNaiXuLyRequest;
import com.danang.safefood.dto.response.ApiResponse;
import com.danang.safefood.dto.response.KhieuNaiDetailResponse;
import com.danang.safefood.dto.response.KhieuNaiSummaryResponse;
import com.danang.safefood.service.KhieuNaiService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/khieu-nai")
@RequiredArgsConstructor
public class KhieuNaiController {

    private final KhieuNaiService khieuNaiService;

    @GetMapping
    @PreAuthorize("hasAnyRole('LD_ATVSTP','CB_THANH_TRA','CB_KIEM_DINH','QTH')")
    public ResponseEntity<ApiResponse<Page<KhieuNaiSummaryResponse>>> getAll(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String status,
            @PageableDefault(size = 20, sort = "thoiGianKhieuNai", direction = Sort.Direction.DESC)
            Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(khieuNaiService.getAll(keyword, status, pageable)));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('LD_ATVSTP','CB_THANH_TRA','CB_KIEM_DINH','QTH')")
    public ResponseEntity<ApiResponse<KhieuNaiDetailResponse>> getById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(khieuNaiService.getById(id)));
    }

    @PutMapping("/{id}/kiem-tra-thuc-dia")
    @PreAuthorize("hasAnyRole('LD_ATVSTP','CB_THANH_TRA','QTH')")
    public ResponseEntity<ApiResponse<KhieuNaiDetailResponse>> capNhatKiemTra(
            @PathVariable String id,
            @Valid @RequestBody KhieuNaiKiemTraRequest request) {
        return ResponseEntity.ok(ApiResponse.success(
                "Cập nhật kiểm tra thực địa thành công",
                khieuNaiService.capNhatKiemTra(id, request)
        ));
    }

    @PutMapping("/{id}/xu-ly")
    @PreAuthorize("hasAnyRole('LD_ATVSTP','CB_THANH_TRA','QTH')")
    public ResponseEntity<ApiResponse<KhieuNaiDetailResponse>> capNhatXuLy(
            @PathVariable String id,
            @Valid @RequestBody KhieuNaiXuLyRequest request) {
        return ResponseEntity.ok(ApiResponse.success(
                "Cập nhật kết quả xử lý thành công",
                khieuNaiService.capNhatXuLy(id, request)
        ));
    }
}
