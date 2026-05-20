package com.danang.safefood.controller.common;

import com.danang.safefood.dto.response.ApiResponse;
import com.danang.safefood.entity.PhuongXa;
import com.danang.safefood.repository.PhuongXaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * API tra cứu danh mục phường xã (dùng chung).
 */
@RestController
@RequestMapping("/api/phuong-xa")
@RequiredArgsConstructor
public class PhuongXaController {

    private final PhuongXaRepository phuongXaRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<PhuongXa>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success(phuongXaRepository.findAll()));
    }
}
