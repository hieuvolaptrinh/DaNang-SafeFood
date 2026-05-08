package com.danang.safefood.controller.LanhDaoVSATTP;

import com.danang.safefood.dto.request.GiayChungNhanRequest;
import com.danang.safefood.dto.response.ApiResponse;
import com.danang.safefood.dto.response.GiayChungNhanResponse;
import com.danang.safefood.service.GiayChungNhanService;
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
@RequestMapping("/api/giaychungnhan")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('LD_ATVSTP','QUAN_TRI_HE_THONG')")
public class GiayChungNhanController {

    private final GiayChungNhanService giayChungNhanService;

    @PostMapping
    public ResponseEntity<ApiResponse<GiayChungNhanResponse>> pheDuyet(
            @Valid @RequestBody GiayChungNhanRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Giấy chứng nhận đã được phê duyệt", giayChungNhanService.pheDuyet(req)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<GiayChungNhanResponse>>> getAll(
            @RequestParam(required = false) String trangThai,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(giayChungNhanService.getAll(trangThai, pageable)));
    }
}
