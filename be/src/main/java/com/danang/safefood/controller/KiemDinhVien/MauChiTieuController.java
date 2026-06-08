package com.danang.safefood.controller.KiemDinhVien;

import com.danang.safefood.dto.request.CapNhatKetQuaChiTieuRequest;
import com.danang.safefood.dto.response.ApiResponse;
import com.danang.safefood.dto.response.MauChiTieuResponse;
import com.danang.safefood.service.KiemDinhVienService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller quản lý kết quả chỉ tiêu của mẫu kiểm định.
 * Base path: /api/mau-kiem-nghiem/{maMau}/chi-tieu
 */
@RestController
@RequestMapping("/api/mau-kiem-nghiem/{maMau}/chi-tieu")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('CB_KIEM_DINH', 'QUAN_TRI_HE_THONG')")
public class MauChiTieuController {

    private final KiemDinhVienService kiemDinhVienService;

    /**
     * Lấy danh sách chỉ tiêu và kết quả của một mẫu.
     * GET /api/mau-kiem-nghiem/{maMau}/chi-tieu
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<MauChiTieuResponse>>> getChiTieuCuaMau(
            @PathVariable String maMau) {
        return ResponseEntity.ok(
                ApiResponse.success(kiemDinhVienService.getChiTieuCuaMau(maMau))
        );
    }

    /**
     * Cập nhật kết quả nhiều chỉ tiêu của một mẫu (upsert).
     * PUT /api/mau-kiem-nghiem/{maMau}/chi-tieu
     * Body: { "chiTieus": [ { "maChiTieu": "CT001", "ketQua": "Đạt"  ... ] }
     */
    @PutMapping
    public ResponseEntity<ApiResponse<List<MauChiTieuResponse>>> capNhatKetQuaChiTieu(
            @PathVariable String maMau,
            @Valid @RequestBody CapNhatKetQuaChiTieuRequest req) {
        return ResponseEntity.ok(
                ApiResponse.success("Cập nhật kết quả chỉ tiêu thành công",
                        kiemDinhVienService.capNhatKetQuaChiTieu(maMau, req))
        );
    }
}
