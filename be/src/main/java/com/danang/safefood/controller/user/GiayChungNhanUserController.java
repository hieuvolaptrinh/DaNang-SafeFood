package com.danang.safefood.controller.user;

import com.danang.safefood.dto.response.ApiResponse;
import com.danang.safefood.dto.response.GiayChungNhanResponse;
import com.danang.safefood.service.GiayChungNhanService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
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

/**
 * Read-only endpoints for viewing certificates from multiple roles (thanh-tra, lanh-dao, ...).
 * Base path: /api/user/giay-chung-nhan
 */
@RestController
@RequestMapping("/api/user/giay-chung-nhan")
@RequiredArgsConstructor
@Tag(name = "User - Giấy Chứng Nhận", description = "API xem giấy chứng nhận cho các vai trò trong hệ thống")
public class GiayChungNhanUserController {

    private final GiayChungNhanService giayChungNhanService;

    @GetMapping
    @Operation(summary = "Danh sách giấy chứng nhận")
    public ResponseEntity<ApiResponse<Page<GiayChungNhanResponse>>> getAll(
            @Parameter(description = "Trạng thái (tuỳ chọn)")
            @RequestParam(required = false) String trangThai,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(ApiResponse.success(giayChungNhanService.getAll(trangThai, pageable)));
    }

    @GetMapping("/{maCN}")
    @Operation(summary = "Chi tiết giấy chứng nhận")
    public ResponseEntity<ApiResponse<GiayChungNhanResponse>> getDetail(@PathVariable String maCN) {
        return ResponseEntity.ok(ApiResponse.success(giayChungNhanService.getDetail(maCN)));
    }
}

