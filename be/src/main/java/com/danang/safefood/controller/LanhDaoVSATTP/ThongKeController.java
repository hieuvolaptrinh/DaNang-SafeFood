package com.danang.safefood.controller.LanhDaoVSATTP;

import com.danang.safefood.dto.response.*;
import com.danang.safefood.service.ExcelExportService;
import com.danang.safefood.service.ThongKeService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequestMapping("/api/v1/thongke")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('LD_ATVSTP','QUAN_TRI_HE_THONG')")
public class ThongKeController {

    private final ThongKeService thongKeService;
    private final ExcelExportService excelExportService;

    @GetMapping("/vi-pham-gan-day")
    public ResponseEntity<ApiResponse<List<ViPhamGanDayResponse>>> getViPhamGanDay(
            @RequestParam(defaultValue = "10") int limit) {

        return ResponseEntity.ok(ApiResponse.success(
                thongKeService.getViPhamGanDay(limit)
        ));
    }

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<DashboardResponse>> getDashboard() {
        return ResponseEntity.ok(ApiResponse.success(thongKeService.getDashboard()));
    }
    @GetMapping("/quan-huyen")
    public ResponseEntity<ApiResponse<List<ThongKeTheoQuanHuyenResponse>>> thongKeTheoQuanHuyen() {
        return ResponseEntity.ok(ApiResponse.success(thongKeService.thongKeTheoQuanHuyen()));
    }

    @GetMapping("/vi-pham-theo-thang")
    public ResponseEntity<ApiResponse<ThongKeViPhamTheoThangResponse>> thongKeViPhamTheoThang(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {

        return ResponseEntity.ok(ApiResponse.success(
                thongKeService.thongKeViPhamTheoThang(from, to)
        ));
    }

    @GetMapping("/giay-phep-sap-het-han")
    public ResponseEntity<ApiResponse<List<GiayPhepSapHetHanResponse>>> giayPhepSapHetHan(
            @RequestParam(defaultValue = "30") int soNgay) {   // mặc định cảnh báo trong 30 ngày tới

        return ResponseEntity.ok(ApiResponse.success(
                thongKeService.getGiayPhepSapHetHan(soNgay)
        ));
    }

    @GetMapping("/export-excel")
    public ResponseEntity<byte[]> exportBaoCaoTongHop() {
        try {
            // Lấy tất cả dữ liệu cần thiết
            DashboardResponse dashboard = thongKeService.getDashboard();
            List<ThongKeTheoQuanHuyenResponse> quanHuyen = thongKeService.thongKeTheoQuanHuyen();
            ThongKeViPhamTheoThangResponse viPhamTheoThang = thongKeService.thongKeViPhamTheoThang(null, null);
            List<GiayPhepSapHetHanResponse> giayPhepSapHet = thongKeService.getGiayPhepSapHetHan(30);
            List<ViPhamGanDayResponse> viPhamGanDay = thongKeService.getViPhamGanDay(20);

            // Gọi service xuất Excel
            byte[] excelBytes = excelExportService.exportBaoCaoTongHop(
                    dashboard, quanHuyen, viPhamTheoThang, giayPhepSapHet, viPhamGanDay
            );

            String fileName = "BaoCaoTongHop_ATVSTP_" + LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd")) + ".xlsx";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.setContentDispositionFormData("attachment", fileName);

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(excelBytes);

        } catch (Exception e) {
            // Có thể throw exception hoặc trả về response lỗi
            throw new RuntimeException("Lỗi khi xuất báo cáo Excel: " + e.getMessage(), e);
        }
    }
}
