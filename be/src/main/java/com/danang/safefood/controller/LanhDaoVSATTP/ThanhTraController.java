package com.danang.safefood.controller.LanhDaoVSATTP;

import com.danang.safefood.dto.request.ThanhTraRequest;
import com.danang.safefood.dto.response.ApiResponse;
import com.danang.safefood.dto.response.ThanhTraResponse;
import com.danang.safefood.service.ThanhTraService;
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
@RequestMapping("/api/thanhtra")
@RequiredArgsConstructor
public class ThanhTraController {

    private final ThanhTraService thanhTraService;

    @PostMapping
    @PreAuthorize("hasAnyRole('LANH_DAO_ATVSTP','CAN_BO_THANH_TRA','QUAN_TRI_HE_THONG')")
    public ResponseEntity<ApiResponse<ThanhTraResponse>> taoThanhTra(
            @Valid @RequestBody ThanhTraRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Tạo đơn thanh tra thành công", thanhTraService.taoThanhTra(req)));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('LANH_DAO_ATVSTP','CAN_BO_THANH_TRA','QUAN_TRI_HE_THONG')")
    public ResponseEntity<ApiResponse<Page<ThanhTraResponse>>> getAll(
            @RequestParam(required = false) String trangThai,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(thanhTraService.getAll(trangThai, pageable)));
    }
}
