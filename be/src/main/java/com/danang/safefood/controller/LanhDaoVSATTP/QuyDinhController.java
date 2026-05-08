package com.danang.safefood.controller.LanhDaoVSATTP;

import com.danang.safefood.dto.request.QuyDinhRequest;
import com.danang.safefood.dto.response.ApiResponse;
import com.danang.safefood.dto.response.QuyDinhResponse;
import com.danang.safefood.entity.TrangThaiQuyDinh;
import com.danang.safefood.service.QuyDinhService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/regulations")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('LD_ATVSTP','QUAN_TRI_HE_THONG')")
public class QuyDinhController {

    private final QuyDinhService quyDinhService;

    @PostMapping
    public ResponseEntity<ApiResponse<QuyDinhResponse>> create(
            @Valid @RequestBody QuyDinhRequest req,
            @AuthenticationPrincipal UserDetails principal) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Quy định đã được ban hành", quyDinhService.create(req, principal.getUsername())));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<QuyDinhResponse>> update(
            @PathVariable String id,
            @Valid @RequestBody QuyDinhRequest req) {
        return ResponseEntity.ok(ApiResponse.success("Cập nhật thành công", quyDinhService.update(id, req)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<QuyDinhResponse>>> getAll(
            @RequestParam(required = false) TrangThaiQuyDinh trangThai,
            @PageableDefault(size = 20, sort = "createdAt") Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(quyDinhService.getAll(trangThai, pageable)));
    }
}
