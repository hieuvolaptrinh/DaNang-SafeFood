package com.danang.safefood.controller.LanhDaoVSATTP;

import com.danang.safefood.dto.request.CoSoKinhDoanhDangKyRequest;
import com.danang.safefood.dto.request.KiemTraCSKDRequest;
import com.danang.safefood.dto.response.ApiResponse;
import com.danang.safefood.dto.response.CoSoKinhDoanhResponse;
import com.danang.safefood.dto.response.GiayChungNhanResponse;
import com.danang.safefood.service.CoSoKinhDoanhService;
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

@RestController
@RequestMapping("/api/v1/cosokinhdoanh")
@RequiredArgsConstructor
public class CSKDController {

    private final CoSoKinhDoanhService coSoService;

    @GetMapping
    @PreAuthorize("hasAnyRole('LD_ATVSTP','CAN_BO_THANH_TRA','CAN_BO_KIEM_DINH','QUAN_TRI_HE_THONG')")
    public ResponseEntity<ApiResponse<Page<CoSoKinhDoanhResponse>>> getAll(
            @RequestParam(required = false) String trangThai,
            @RequestParam(required = false) String maPX,
            @PageableDefault(size = 20, sort = "tenCoSo") Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(coSoService.getAll(trangThai, maPX, pageable)));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('LD_ATVSTPP','CAN_BO_THANH_TRA','CAN_BO_KIEM_DINH','QUAN_TRI_HE_THONG')")
    public ResponseEntity<ApiResponse<CoSoKinhDoanhResponse>> getById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(coSoService.getById(id)));
    }

    @GetMapping("/{id}/giaychungnhan")
    @PreAuthorize("hasAnyRole('LD_ATVSTP','CAN_BO_THANH_TRA','QUAN_TRI_HE_THONG')")
    public ResponseEntity<ApiResponse<List<GiayChungNhanResponse>>> getChungNhan(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(coSoService.getChungNhan(id)));
    }

    @PutMapping("/{id}/dangky")
    @PreAuthorize("hasAnyRole('LD_ATVSTP','QUAN_TRI_HE_THONG')")
    public ResponseEntity<ApiResponse<CoSoKinhDoanhResponse>> updateDangKy(
            @PathVariable String id,
            @RequestBody CoSoKinhDoanhDangKyRequest req) {
        return ResponseEntity.ok(ApiResponse.success("Cập nhật đăng ký thành công", coSoService.updateDangKy(id, req)));
    }

    @PostMapping("/{id}/kiemtra")
    @PreAuthorize("hasAnyRole('LD_ATVSTP','CAN_BO_THANH_TRA','QUAN_TRI_HE_THONG')")
    public ResponseEntity<ApiResponse<Void>> taoKiemTra(
            @PathVariable String id,
            @Valid @RequestBody KiemTraCSKDRequest req) {
        coSoService.taoLichKiemTra(id, req);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Tạo lịch kiểm tra thành công", null));
    }
}
