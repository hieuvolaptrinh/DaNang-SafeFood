package com.danang.safefood.controller.user;

import com.danang.safefood.config.security.jwt.JwtPrincipal;
import com.danang.safefood.dto.request.PhanAnhCreateRequest;
import com.danang.safefood.dto.response.ApiResponse;
import com.danang.safefood.dto.response.LoaiPhanAnhResponse;
import com.danang.safefood.dto.response.PhanAnhUserResponse;
import com.danang.safefood.service.PhanAnhService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController("userPhanAnhController")
@RequestMapping("/api/user/phan-anh")
@RequiredArgsConstructor
public class PhanAnhController {

    private final PhanAnhService phanAnhService;

    @GetMapping("/loai")
    public ResponseEntity<ApiResponse<List<LoaiPhanAnhResponse>>> getLoaiPhanAnh() {
        return ResponseEntity.ok(ApiResponse.success(phanAnhService.getLoaiPhanAnh()));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<PhanAnhUserResponse>>> getMyComplaints(
            @AuthenticationPrincipal JwtPrincipal jwt) {
        return ResponseEntity.ok(ApiResponse.success(
                phanAnhService.getByNguoiDung(getNguoiDungId(jwt))));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PhanAnhUserResponse>> getDetail(
            @AuthenticationPrincipal JwtPrincipal jwt,
            @PathVariable("id") String maPhanAnh) {
        return ResponseEntity.ok(ApiResponse.success(
                phanAnhService.getUserDetail(getNguoiDungId(jwt), maPhanAnh)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<PhanAnhUserResponse>> createComplaint(
            @AuthenticationPrincipal JwtPrincipal jwt,
            @Valid @RequestBody PhanAnhCreateRequest request) {
        return ResponseEntity.ok(ApiResponse.success(
                "Gửi phản ánh thành công",
                phanAnhService.createForUser(jwt.userId(), request)));
    }

    private String getNguoiDungId(JwtPrincipal jwt) {
        if (jwt == null || jwt.userId() == null) {
            throw new RuntimeException("Không thể xác định người dùng");
        }
        return phanAnhService.getNguoiDungId(jwt.userId());
    }
}
