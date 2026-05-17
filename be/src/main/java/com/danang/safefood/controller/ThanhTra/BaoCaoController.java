package com.danang.safefood.controller.ThanhTra;

import com.danang.safefood.dto.request.BaoCaoRequest;
import com.danang.safefood.dto.response.ApiResponse;
import com.danang.safefood.dto.response.BaoCaoResponse;
import com.danang.safefood.service.BaoCaoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/bao-cao")
@RequiredArgsConstructor
public class BaoCaoController {

    private final BaoCaoService baoCaoService;

    @GetMapping
    @PreAuthorize("hasAnyRole('LD_ATVSTP','CB_THANH_TRA','CB_KIEM_DINH','QTH')")
    public ResponseEntity<ApiResponse<Page<BaoCaoResponse>>> getAllBaoCao(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String resultFilter,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(baoCaoService.getAll(keyword, resultFilter, pageable)));
    }

    @GetMapping("/thong-ke")
    @PreAuthorize("hasAnyRole('LD_ATVSTP','CB_THANH_TRA','CB_KIEM_DINH','QTH')")
    public ResponseEntity<ApiResponse<com.danang.safefood.dto.response.BaoCaoStatsResponse>> getStats() {
        return ResponseEntity.ok(ApiResponse.success(baoCaoService.getStats()));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('LD_ATVSTP','CB_THANH_TRA','CB_KIEM_DINH','QTH')")
    public ResponseEntity<ApiResponse<BaoCaoResponse>> getBaoCaoById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(baoCaoService.getBaoCaoById(id)));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('LD_ATVSTP','CB_THANH_TRA','CB_KIEM_DINH','QTH')")
    public ResponseEntity<ApiResponse<BaoCaoResponse>> createBaoCao(
            @Valid @RequestBody BaoCaoRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Tạo báo cáo thành công", baoCaoService.createBaoCao(req)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('LD_ATVSTP','CB_THANH_TRA','CB_KIEM_DINH','QTH')")
    public ResponseEntity<ApiResponse<BaoCaoResponse>> updateBaoCao(
            @PathVariable String id,
            @Valid @RequestBody BaoCaoRequest req) {
        return ResponseEntity.ok(ApiResponse.success("Cập nhật báo cáo thành công", baoCaoService.updateBaoCao(id, req)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('LD_ATVSTP','CB_THANH_TRA','CB_KIEM_DINH','QTH')")
    public ResponseEntity<ApiResponse<Void>> deleteBaoCao(@PathVariable String id) {
        baoCaoService.deleteBaoCao(id);
        return ResponseEntity.ok(ApiResponse.success("Xóa báo cáo thành công", null));
    }
}
