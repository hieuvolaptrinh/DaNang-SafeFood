package com.danang.safefood.controller.LanhDaoVSATTP;

import com.danang.safefood.dto.response.ApiResponse;
import com.danang.safefood.dto.response.TieuChiDanhGiaResponse;
import com.danang.safefood.service.TieuChiDanhGiaService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.RestController;
import com.danang.safefood.dto.request.CreateTieuChiDanhGiaRequest;
import java.util.List;

@RestController
@RequestMapping("/api/v1/thanhtra/tieu-chi")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('LD_ATVSTP','CB_THANH_TRA','QTH')")
public class TieuChiDanhGiaController {

    private final TieuChiDanhGiaService tieuChiDanhGiaService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<TieuChiDanhGiaResponse>>> getAll(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String nhom,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(tieuChiDanhGiaService.getAll(keyword, nhom, pageable)));
    }

    @GetMapping("/{maTieuChi}")
    public ResponseEntity<ApiResponse<TieuChiDanhGiaResponse>> getById(@PathVariable String maTieuChi) {
        return ResponseEntity.ok(ApiResponse.success(tieuChiDanhGiaService.getById(maTieuChi)));
    }

    @GetMapping("/nhom-options")
    public ResponseEntity<ApiResponse<List<String>>> getNhomOptions() {
        return ResponseEntity.ok(ApiResponse.success(tieuChiDanhGiaService.getNhomOptions()));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<TieuChiDanhGiaResponse>> create(@RequestBody CreateTieuChiDanhGiaRequest req) {
        TieuChiDanhGiaResponse created = tieuChiDanhGiaService.create(req);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(created));
    }
}
