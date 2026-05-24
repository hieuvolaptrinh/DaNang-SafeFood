package com.danang.safefood.controller.KiemDinhVien;

import com.danang.safefood.dto.response.ApiResponse;
import com.danang.safefood.dto.response.ChiTieuResponse;
import com.danang.safefood.service.KiemDinhVienService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/danh-muc/chi-tieu")
@RequiredArgsConstructor
public class DanhMucChiTieuController {

    private final KiemDinhVienService kiemDinhVienService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ChiTieuResponse>>> getAll() {

        return ResponseEntity.ok(
                ApiResponse.success(
                        kiemDinhVienService.getAllMauChiTieu()
                )
        );
    }
}
