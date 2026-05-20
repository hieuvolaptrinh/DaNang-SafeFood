package com.danang.safefood.controller.user;

import com.danang.safefood.config.security.jwt.JwtPrincipal;
import com.danang.safefood.dto.request.HoSoDangKiRequest;
import com.danang.safefood.dto.response.ApiResponse;
import com.danang.safefood.dto.response.HoSoDangKiResponse;
import com.danang.safefood.dto.response.MyBusinessResponse;
import com.danang.safefood.service.MyBusinessService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * API cho CSKD (chủ cơ sở kinh doanh) quản lý cơ sở và hồ sơ của mình.
 *
 *  - GET    /api/user/my-business                          — danh sách cơ sở của tôi
 *  - GET    /api/user/my-business/ho-so                    — toàn bộ hồ sơ đăng kí của tôi
 *  - GET    /api/user/my-business/{maCoSo}/ho-so           — hồ sơ của 1 cơ sở
 *  - POST   /api/user/my-business/ho-so                    — tạo mới hồ sơ
 *  - PUT    /api/user/my-business/ho-so/{maHoSo}           — cập nhật hồ sơ
 *  - DELETE /api/user/my-business/ho-so/{maHoSo}           — xoá hồ sơ
 */
@RestController("userMyBusinessController")
@RequestMapping("/api/user/my-business")
@RequiredArgsConstructor
public class MyBusinessController {

    private final MyBusinessService service;
    private final com.danang.safefood.repository.LoaiGiayToRepository loaiGiayToRepo;

    @GetMapping("/loai-giay-to")
    public ResponseEntity<ApiResponse<List<com.danang.safefood.entity.LoaiGiayTo>>> getLoaiGiayTo() {
        return ResponseEntity.ok(ApiResponse.success(loaiGiayToRepo.findAll()));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<MyBusinessResponse>>> getMyBusinesses(
            @AuthenticationPrincipal JwtPrincipal jwt) {
        return ResponseEntity.ok(ApiResponse.success(service.getMyBusinesses(requireUser(jwt))));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<MyBusinessResponse>> createBusiness(
            @AuthenticationPrincipal JwtPrincipal jwt,
            @Valid @RequestBody com.danang.safefood.dto.request.CoSoKinhDoanhCreateRequest req) {
        return ResponseEntity.ok(ApiResponse.success(
                "Tạo cơ sở kinh doanh thành công",
                service.createBusiness(req, requireUser(jwt))));
    }

    @GetMapping("/ho-so")
    public ResponseEntity<ApiResponse<List<HoSoDangKiResponse>>> getMyHoSo(
            @AuthenticationPrincipal JwtPrincipal jwt) {
        return ResponseEntity.ok(ApiResponse.success(service.getMyHoSoList(requireUser(jwt))));
    }

    @GetMapping("/{maCoSo}/ho-so")
    public ResponseEntity<ApiResponse<List<HoSoDangKiResponse>>> getHoSoByCoSo(
            @PathVariable String maCoSo) {
        return ResponseEntity.ok(ApiResponse.success(service.getHoSoByCoSo(maCoSo)));
    }

    @PostMapping("/ho-so")
    public ResponseEntity<ApiResponse<HoSoDangKiResponse>> createHoSo(
            @AuthenticationPrincipal JwtPrincipal jwt,
            @Valid @RequestBody HoSoDangKiRequest req) {
        return ResponseEntity.ok(ApiResponse.success(
                "Tạo hồ sơ thành công",
                service.createHoSo(req, requireUser(jwt))));
    }

    @PutMapping("/ho-so/{maHoSo}")
    public ResponseEntity<ApiResponse<HoSoDangKiResponse>> updateHoSo(
            @AuthenticationPrincipal JwtPrincipal jwt,
            @PathVariable String maHoSo,
            @Valid @RequestBody HoSoDangKiRequest req) {
        return ResponseEntity.ok(ApiResponse.success(
                "Cập nhật hồ sơ thành công",
                service.updateHoSo(maHoSo, req, requireUser(jwt))));
    }

    @DeleteMapping("/ho-so/{maHoSo}")
    public ResponseEntity<ApiResponse<String>> deleteHoSo(
            @AuthenticationPrincipal JwtPrincipal jwt,
            @PathVariable String maHoSo) {
        service.deleteHoSo(maHoSo, requireUser(jwt));
        return ResponseEntity.ok(ApiResponse.success("Xoá hồ sơ thành công", "OK"));
    }

    private Long requireUser(JwtPrincipal jwt) {
        if (jwt == null || jwt.userId() == null) {
            throw new RuntimeException("Không thể xác định người dùng");
        }
        return jwt.userId();
    }
}
