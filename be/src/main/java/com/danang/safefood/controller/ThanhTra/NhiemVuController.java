package com.danang.safefood.controller.ThanhTra;

import com.danang.safefood.config.security.jwt.JwtPrincipal;
import com.danang.safefood.dto.request.CapNhatTienDoRequest;
import com.danang.safefood.dto.response.NhiemVuDetailResponse;
import com.danang.safefood.dto.response.NhiemVuListResponse;
import com.danang.safefood.dto.response.ThongKeNhiemVuResponse;
import com.danang.safefood.service.NhiemVuService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/nhiem-vu")
@RequiredArgsConstructor
public class NhiemVuController {

    private final NhiemVuService nhiemVuService;

    @GetMapping("/thong-ke")
    public ResponseEntity<ThongKeNhiemVuResponse> getThongKeNhiemVu(
            @AuthenticationPrincipal JwtPrincipal jwtPrincipal) {
        return ResponseEntity.ok(nhiemVuService.getThongKeNhiemVu(jwtPrincipal));
    }

    @GetMapping
    public ResponseEntity<Page<NhiemVuListResponse>> getDanhSachNhiemVu(
            @AuthenticationPrincipal JwtPrincipal jwtPrincipal,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String trangThai,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(nhiemVuService.getDanhSachNhiemVu(jwtPrincipal, keyword, trangThai, pageable));
    }

    @GetMapping("/{maThanhTra}")
    public ResponseEntity<NhiemVuDetailResponse> getChiTietNhiemVu(
            @AuthenticationPrincipal JwtPrincipal jwtPrincipal,
            @PathVariable String maThanhTra) {
        return ResponseEntity.ok(nhiemVuService.getChiTietNhiemVu(jwtPrincipal, maThanhTra));
    }

    @PutMapping("/{maThanhTra}/nhan")
    public ResponseEntity<Void> nhanNhiemVu(
            @AuthenticationPrincipal JwtPrincipal jwtPrincipal,
            @PathVariable String maThanhTra) {
        nhiemVuService.nhanNhiemVu(jwtPrincipal, maThanhTra);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{maThanhTra}/trang-thai")
    public ResponseEntity<Void> capNhatTienDo(
            @AuthenticationPrincipal JwtPrincipal jwtPrincipal,
            @PathVariable String maThanhTra,
            @RequestBody CapNhatTienDoRequest request) {
        nhiemVuService.capNhatTienDo(jwtPrincipal, maThanhTra, request);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{maThanhTra}/tu-choi")
    public ResponseEntity<Void> tuChoiNhiemVu(
            @AuthenticationPrincipal JwtPrincipal jwtPrincipal,
            @PathVariable String maThanhTra,
            @RequestBody com.danang.safefood.dto.request.TuChoiNhiemVuRequest request) {
        nhiemVuService.tuChoiNhiemVu(jwtPrincipal, maThanhTra, request);
        return ResponseEntity.ok().build();
    }
}
