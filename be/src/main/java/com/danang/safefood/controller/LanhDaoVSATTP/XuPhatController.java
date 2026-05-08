package com.danang.safefood.controller.LanhDaoVSATTP;

import com.danang.safefood.dto.request.XuPhatRequest;
import com.danang.safefood.dto.response.ApiResponse;
import com.danang.safefood.dto.response.XuPhatResponse;
import com.danang.safefood.entity.TrangThaiXuPhat;
import com.danang.safefood.service.XuPhatService;
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
@RequestMapping("/api/xuphat")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('LD_ATVSTP','QUAN_TRI_HE_THONG')")
public class XuPhatController {

    private final XuPhatService xuPhatService;

    @PostMapping
    public ResponseEntity<ApiResponse<XuPhatResponse>> banHanh(
            @Valid @RequestBody XuPhatRequest req,
            @AuthenticationPrincipal UserDetails principal) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Ban hành đơn xử phạt thành công",
                        xuPhatService.banHanh(req, principal.getUsername())));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<XuPhatResponse>>> getAll(
            @RequestParam(required = false) TrangThaiXuPhat trangThai,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(xuPhatService.getAll(trangThai, pageable)));
    }
}
