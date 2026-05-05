package com.danang.safefood.controller.LanhDaoVSATTP;

import com.danang.safefood.dto.request.PhanCongKiemTraRequest;
import com.danang.safefood.dto.response.ApiResponse;
import com.danang.safefood.service.PhanCongService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/phancong-kiemtra")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('LANH_DAO_ATVSTP','CAN_BO_THANH_TRA','QUAN_TRI_HE_THONG')")
public class PhanCongKiemTraController {

    private final PhanCongService phanCongService;

    @PostMapping
    public ResponseEntity<ApiResponse<Void>> phanCong(@Valid @RequestBody PhanCongKiemTraRequest req) {
        phanCongService.phanCong(req);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Phân công kiểm tra thành công", null));
    }
}
