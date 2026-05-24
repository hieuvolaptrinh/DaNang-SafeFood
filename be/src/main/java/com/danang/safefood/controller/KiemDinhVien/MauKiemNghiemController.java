package com.danang.safefood.controller.KiemDinhVien;

import com.danang.safefood.dto.request.CapNhatTrangThaiMauRequest;
import com.danang.safefood.dto.response.ApiResponse;
import com.danang.safefood.dto.response.MauKiemNghiemResponse;
import com.danang.safefood.dto.response.MauSelectResponse;
import com.danang.safefood.service.KiemDinhVienService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller quản lý mẫu kiểm định.
 * Base path: /api/mau-kiem-nghiem
 */
@RestController
@RequestMapping("/api/mau-kiem-nghiem")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('CB_KIEM_DINH', 'QUAN_TRI_HE_THONG')")
public class MauKiemNghiemController {

    private final KiemDinhVienService kiemDinhVienService;

    /**
     * Lấy danh sách mẫu kiểm định (có thể lọc theo trạng thái).
     * GET /api/mau-kiem-nghiem?trangThai=Chờ xử lý&page=0&size=20
     */
    @GetMapping
    public ResponseEntity<ApiResponse<Page<MauKiemNghiemResponse>>> getDanhSachMau(
            @RequestParam(required = false) String trangThai,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(
                ApiResponse.success(kiemDinhVienService.getDanhSachMau(trangThai, pageable))
        );
    }

    /**
     * Lấy chi tiết một mẫu kiểm định.
     * GET /api/mau-kiem-nghiem/{maMau}
     */
    @GetMapping("/{maMau}")
    public ResponseEntity<ApiResponse<MauKiemNghiemResponse>> getMauById(
            @PathVariable String maMau) {
        return ResponseEntity.ok(
                ApiResponse.success(kiemDinhVienService.getMauById(maMau))
        );
    }

    /**
     * Cập nhật trạng thái mẫu kiểm định.
     * PATCH /api/mau-kiem-nghiem/{maMau}/trang-thai
     * Body: { "trangThai": "Đang kiểm nghiệm", "ghiChu": "..." }
     */
    @PatchMapping("/{maMau}/trang-thai")
    public ResponseEntity<ApiResponse<MauKiemNghiemResponse>> capNhatTrangThai(
            @PathVariable String maMau,
            @Valid @RequestBody CapNhatTrangThaiMauRequest req) {
        return ResponseEntity.ok(
                ApiResponse.success("Cập nhật trạng thái mẫu thành công",
                        kiemDinhVienService.capNhatTrangThaiMau(maMau, req))
        );
    }

    @GetMapping("/select")
    public ResponseEntity<ApiResponse<List<MauSelectResponse>>> getSelectData() {

        return ResponseEntity.ok(
                ApiResponse.success(
                        kiemDinhVienService.getMauSelect()
                )
        );
    }
}
