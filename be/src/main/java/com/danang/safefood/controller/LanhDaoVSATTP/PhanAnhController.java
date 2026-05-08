package com.danang.safefood.controller.LanhDaoVSATTP;

import com.danang.safefood.dto.request.PhanAnhUpdateRequest;
import com.danang.safefood.dto.response.ApiResponse;
import com.danang.safefood.dto.response.PhanAnhResponse;
import com.danang.safefood.service.PhanAnhService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/phananh")
@RequiredArgsConstructor
public class PhanAnhController {

    private final PhanAnhService phanAnhService;

    @GetMapping
    @PreAuthorize("hasAnyRole('LD_ATVSTP','CAN_BO_THANH_TRA','QUAN_TRI_HE_THONG')")
    public ResponseEntity<ApiResponse<Page<PhanAnhResponse>>> getAll(
            @RequestParam(required = false) String trangThai,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime to,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(phanAnhService.getAll(trangThai, from, to, pageable)));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('LD_ATVSTP','CAN_BO_THANH_TRA','QUAN_TRI_HE_THONG')")
    public ResponseEntity<ApiResponse<PhanAnhResponse>> getById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(phanAnhService.getById(id)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('LD_ATVSTP','QUAN_TRI_HE_THONG')")
    public ResponseEntity<ApiResponse<PhanAnhResponse>> update(
            @PathVariable String id,
            @RequestBody PhanAnhUpdateRequest req) {
        return ResponseEntity.ok(ApiResponse.success("Cập nhật phản ánh thành công", phanAnhService.update(id, req)));
    }
}
