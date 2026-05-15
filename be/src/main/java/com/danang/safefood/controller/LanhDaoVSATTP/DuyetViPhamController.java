package com.danang.safefood.controller.LanhDaoVSATTP;

import com.danang.safefood.dto.request.CapNhatTrangThaiViPhamRequest;
import com.danang.safefood.dto.response.ApiResponse;
import com.danang.safefood.dto.response.ViPhamResponse;
import com.danang.safefood.service.KiemDinhVienService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/vi-pham")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('LD_ATVSTP','QUAN_TRI_HE_THONG')")
public class DuyetViPhamController {

    private final KiemDinhVienService kiemDinhVienService;

    @PutMapping("/{maViPham}/phe-duyet")
    public ResponseEntity<ApiResponse<ViPhamResponse>> pheDuyetViPham(
            @PathVariable String maViPham,
            @Valid @RequestBody CapNhatTrangThaiViPhamRequest req) {

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Cập nhật trạng thái vi phạm thành công",
                        kiemDinhVienService.capNhatTrangThaiViPham(
                                maViPham,
                                req.trangThai()
                        )
                )
        );
    }
}
