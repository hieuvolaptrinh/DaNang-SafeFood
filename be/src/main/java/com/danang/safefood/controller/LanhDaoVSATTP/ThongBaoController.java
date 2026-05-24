package com.danang.safefood.controller.LanhDaoVSATTP;

import com.danang.safefood.dto.request.ThongBaoRequest;
import com.danang.safefood.dto.response.ApiResponse;
import com.danang.safefood.dto.response.ThongBaoResponse;
import com.danang.safefood.service.ThongBaoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController("lanhDaoThongBaoController")
@RequestMapping("/api/v1/thongbao")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('LD_ATVSTP','QUAN_TRI_HE_THONG')")
public class ThongBaoController {

    private final ThongBaoService thongBaoService;

    @PostMapping
    public ResponseEntity<ApiResponse<ThongBaoResponse>> create(@Valid @RequestBody ThongBaoRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Thông báo đã được tạo", thongBaoService.create(req)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<ThongBaoResponse>>> getAll(
            @RequestParam(required = false) String loai,
            @RequestParam(required = false) Boolean isCongDong,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(thongBaoService.getAll(loai, isCongDong, pageable)));
    }

    // ThongBaoController.java - thêm endpoint
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ThongBaoResponse>> update(
            @PathVariable String id,
            @Valid @RequestBody ThongBaoRequest req) {
        return ResponseEntity.ok(ApiResponse.success("Cập nhật thông báo thành công",
                thongBaoService.update(id, req)));
    }
}
