package com.danang.safefood.controller.LanhDaoVSATTP;

import com.danang.safefood.dto.request.HoSoThanhTraRequest;
import com.danang.safefood.dto.response.ApiResponse;
import com.danang.safefood.dto.response.HoSoThanhTraResponse;
import com.danang.safefood.dto.response.HoSoThanhTraStatsResponse;
import com.danang.safefood.service.HoSoThanhTraService;
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
@RequestMapping("/api/v1/ho-so-thanh-tra")
@RequiredArgsConstructor
public class HoSoThanhTraController {

    private final HoSoThanhTraService hoSoThanhTraService;

    @GetMapping
    @PreAuthorize("hasAnyRole('LD_ATVSTP','CB_THANH_TRA','CB_KIEM_DINH','QTH')")
    public ResponseEntity<ApiResponse<Page<HoSoThanhTraResponse>>> getAll(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String resultFilter,
            @RequestParam(required = false) String inspectorFilter,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(hoSoThanhTraService.getAll(keyword, resultFilter, inspectorFilter, pageable)));
    }

    @GetMapping("/thong-ke")
    @PreAuthorize("hasAnyRole('LD_ATVSTP','CB_THANH_TRA','CB_KIEM_DINH','QTH')")
    public ResponseEntity<ApiResponse<HoSoThanhTraStatsResponse>> getStats() {
        return ResponseEntity.ok(ApiResponse.success(hoSoThanhTraService.getStats()));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('LD_ATVSTP','CB_THANH_TRA','CB_KIEM_DINH','QTH')")
    public ResponseEntity<ApiResponse<HoSoThanhTraResponse>> getById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(hoSoThanhTraService.getById(id)));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('LD_ATVSTP','CB_THANH_TRA','CB_KIEM_DINH','QTH')")
    public ResponseEntity<ApiResponse<HoSoThanhTraResponse>> create(
            @Valid @RequestBody HoSoThanhTraRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Tạo hồ sơ thanh tra thành công", hoSoThanhTraService.create(req)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('LD_ATVSTP','CB_THANH_TRA','CB_KIEM_DINH','QTH')")
    public ResponseEntity<ApiResponse<HoSoThanhTraResponse>> update(
            @PathVariable String id,
            @Valid @RequestBody HoSoThanhTraRequest req) {
        return ResponseEntity.ok(ApiResponse.success("Cập nhật hồ sơ thanh tra thành công", hoSoThanhTraService.update(id, req)));
    }
}
