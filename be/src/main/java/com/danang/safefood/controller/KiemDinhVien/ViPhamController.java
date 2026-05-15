package com.danang.safefood.controller.KiemDinhVien;

import com.danang.safefood.dto.request.CapNhatTrangThaiViPhamRequest;
import com.danang.safefood.dto.request.ViPhamRequest;
import com.danang.safefood.dto.response.ApiResponse;
import com.danang.safefood.dto.response.ViPhamResponse;
import com.danang.safefood.service.KiemDinhVienService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller quản lý đơn vi phạm do kiểm định viên lập.
 * Base path: /api/vi-pham
 */
@RestController
@RequestMapping("/api/v1/vi-pham")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('CB_KIEM_DINH', 'QUAN_TRI_HE_THONG')")
public class ViPhamController {

    private final KiemDinhVienService kiemDinhVienService;

    /**
     * Lấy danh sách vi phạm (có thể lọc theo trạng thái phê duyệt).
     * GET /api/vi-pham?trangThaiPheDuyet=Chờ duyệt&page=0&size=20
     */
    @GetMapping
    public ResponseEntity<ApiResponse<Page<ViPhamResponse>>> getDanhSachViPham(
            @RequestParam(required = false) String trangThaiPheDuyet,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(
                ApiResponse.success(kiemDinhVienService.getDanhSachViPham(trangThaiPheDuyet, pageable))
        );
    }

    /**
     * Lấy danh sách vi phạm theo hồ sơ thanh tra.
     * GET /api/vi-pham/ho-so/{maHoSo}
     */
    @GetMapping("/ho-so/{maHoSo}")
    public ResponseEntity<ApiResponse<List<ViPhamResponse>>> getViPhamTheoHoSo(
            @PathVariable String maHoSo,
            @PageableDefault(size = 50) Pageable pageable) {
        return ResponseEntity.ok(
                ApiResponse.success(kiemDinhVienService.getViPhamTheoHoSo(maHoSo, pageable))
        );
    }

    /**
     * Tạo đơn vi phạm mới.
     * POST /api/vi-pham
     * Body: { "maHoSo": "HS001", "maLoaiViPham": "LVP01", "moTaThem": "...", "khacPhuc": "...", "mucDo": "Trung bình" }
     */
    @PostMapping
    public ResponseEntity<ApiResponse<ViPhamResponse>> taoViPham(
            @Valid @RequestBody ViPhamRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(
                ApiResponse.success("Tạo đơn vi phạm thành công",
                        kiemDinhVienService.taoViPham(req))
        );
    }

}
