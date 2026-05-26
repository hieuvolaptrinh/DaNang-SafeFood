package com.danang.safefood.controller.KiemDinhVien;

import com.danang.safefood.dto.response.ApiResponse;
import com.danang.safefood.dto.response.LoaiViPhamResponse;
import com.danang.safefood.service.KiemDinhVienService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/danh-muc/loai-vi-pham")
@RequiredArgsConstructor
public class DanhMucLoaiViPhamController {

    private final KiemDinhVienService kiemDinhVienService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<LoaiViPhamResponse>>> getAll() {
        return ResponseEntity.ok(
                ApiResponse.success(
                        kiemDinhVienService.getAllLoaiViPham()
                )
        );
    }
}
