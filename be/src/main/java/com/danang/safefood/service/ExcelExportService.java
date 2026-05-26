package com.danang.safefood.service;

import com.danang.safefood.dto.response.*;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.*;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

/**
 * Xuất báo cáo Excel tổng hợp tình hình An Toàn Vệ Sinh Thực Phẩm.
 */
@Service
@RequiredArgsConstructor
public class ExcelExportService {

    private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    // ── Màu sắc (ARGB) ──────────────────────────────────────────────────────
    private static final String CLR_TITLE_BG  = "FF0D2137";
    private static final String CLR_TITLE_FG  = "FFF0C040";
    private static final String CLR_HEADER_BG = "FF1A3C5E";
    private static final String CLR_HEADER_FG = "FFFFFFFF";
    private static final String CLR_SUB_BG    = "FF2E86AB";
    private static final String CLR_SUB_FG    = "FFFFFFFF";
    private static final String CLR_ALT_ROW   = "FFEBF4FA";
    private static final String CLR_WHITE     = "FFFFFFFF";
    private static final String CLR_DANGER    = "FFF8D7DA";
    private static final String CLR_WARN      = "FFFFF3CD";
    private static final String CLR_OK        = "FFD4EDDA";
    private static final String CLR_TEXT_BLUE = "FF1A3C5E";

    // ─────────────────────────────────────────────────────────────────────────
    // ENTRY POINT
    // ─────────────────────────────────────────────────────────────────────────
    public byte[] exportBaoCaoTongHop(
            DashboardResponse dashboard,
            List<ThongKeTheoQuanHuyenResponse> quanHuyen,
            ThongKeViPhamTheoThangResponse viPhamTheoThang,
            List<GiayPhepSapHetHanResponse> giayPhepSapHet,
            List<ViPhamGanDayResponse> viPhamGanDay
    ) throws IOException {

        try (XSSFWorkbook wb = new XSSFWorkbook();
             ByteArrayOutputStream out = new ByteArrayOutputStream()) {

            buildSheetTongQuan(wb, dashboard);
            buildSheetQuanHuyen(wb, quanHuyen);
            buildSheetViPhamTheoThang(wb, viPhamTheoThang);
            buildSheetGiayPhepSapHet(wb, giayPhepSapHet);
            buildSheetViPhamGanDay(wb, viPhamGanDay);

            wb.write(out);
            return out.toByteArray();
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // SHEET 1 – TỔNG QUAN
    // ─────────────────────────────────────────────────────────────────────────
    private void buildSheetTongQuan(XSSFWorkbook wb, DashboardResponse d) {
        XSSFSheet ws = wb.createSheet("Tổng Quan");
        ws.setDisplayGridlines(false);

        ws.setColumnWidth(0, cols(4));
        ws.setColumnWidth(1, cols(40));
        ws.setColumnWidth(2, cols(22));
        ws.setColumnWidth(3, cols(22));
        ws.setColumnWidth(4, cols(4));

        // Row 0: Tiêu đề lớn
        Row r0 = ws.createRow(0);
        r0.setHeightInPoints(34);
        merge(ws, 0, 1, 0, 3);   // Sửa: Chỉ merge B1:D1
        cell(wb, r0, 1, "BAN QUẢN LÝ AN TOÀN VỆ SINH THỰC PHẨM TP. ĐÀ NẴNG",
                titleStyle(wb, CLR_TITLE_BG, CLR_TITLE_FG, 14));

        // Row 1: Ngày xuất báo cáo
        Row r1 = ws.createRow(1);
        r1.setHeightInPoints(22);
        merge(ws, 1, 1, 1, 3);
        cell(wb, r1, 1,
                "BÁO CÁO TỔNG HỢP TÌNH HÌNH – Ngày xuất: " + LocalDate.now().format(DATE_FMT),
                titleStyle(wb, CLR_HEADER_BG, CLR_TITLE_FG, 10));

        // Spacer
        ws.createRow(2).setHeightInPoints(12);

        // Section header
        Row r3 = ws.createRow(3);
        r3.setHeightInPoints(26);
        merge(ws, 3, 1, 3, 3);
        cell(wb, r3, 1, "📊 CHỈ SỐ TỔNG QUAN", sectionHeaderStyle(wb));

        // KPI rows
        Object[][] kpis = {
                {"Tổng cơ sở kinh doanh",        d.tongCoSoKinhDoanh(),     "cơ sở"},
                {"Cơ sở đang hoạt động",         d.coSoHoatDong(),          "cơ sở"},
                {"Chứng nhận ATVS còn hiệu lực", d.chungNhanHieuLuc(),      "chứng nhận"},
                {"Chứng nhận sắp / hết hạn",     d.chungNhanHetHan(),    "chứng nhận"},
                {"Lịch thanh tra đang xử lý",    d.thanhTraDangXuLy(),      "lịch"},
                {"Phản ánh chưa xử lý",          d.phanAnhChuaXuLy(),       "phản ánh"},
                {"Quy định đang hiệu lực",       d.tongQuyDinhHieuLuc(),           "quy định"}
        };

        for (int i = 0; i < kpis.length; i++) {
            Row row = ws.createRow(4 + i);
            row.setHeightInPoints(22);
            String bg = i % 2 == 0 ? CLR_ALT_ROW : CLR_WHITE;

            cell(wb, row, 1, kpis[i][0], labelStyle(wb, bg));
            cell(wb, row, 2, String.valueOf(kpis[i][1]), kpiValueStyle(wb, bg));
            cell(wb, row, 3, kpis[i][2].toString(), unitStyle(wb, bg));
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // SHEET 2 – THỐNG KÊ THEO QUẬN/HUYỆN
    // ─────────────────────────────────────────────────────────────────────────
    private void buildSheetQuanHuyen(XSSFWorkbook wb, List<ThongKeTheoQuanHuyenResponse> list) {
        XSSFSheet ws = wb.createSheet("Theo Quận Huyện");
        ws.setDisplayGridlines(false);

        ws.setColumnWidth(0, cols(4));
        ws.setColumnWidth(1, cols(26));
        ws.setColumnWidth(2, cols(16));
        ws.setColumnWidth(3, cols(16));
        ws.setColumnWidth(4, cols(16));
        ws.setColumnWidth(5, cols(4));

        Row r0 = ws.createRow(0); r0.setHeightInPoints(30);
        merge(ws, 0, 1, 0, 4);
        cell(wb, r0, 1, "THỐNG KÊ CƠ SỞ KINH DOANH THEO QUẬN/HUYỆN",
                titleStyle(wb, CLR_HEADER_BG, CLR_HEADER_FG, 12));

        ws.createRow(1).setHeightInPoints(8);

        Row r2 = ws.createRow(2); r2.setHeightInPoints(24);
        String[] headers = {"Quận / Huyện", "Tổng Cơ Sở", "Đạt Chuẩn", "Vi Phạm"};
        for (int i = 0; i < headers.length; i++) {
            cell(wb, r2, 1 + i, headers[i], colHeaderStyle(wb));
        }

        long tongCS = 0, tongDC = 0, tongVP = 0;
        for (int i = 0; i < list.size(); i++) {
            ThongKeTheoQuanHuyenResponse qh = list.get(i);
            Row row = ws.createRow(3 + i); row.setHeightInPoints(20);
            String bg = i % 2 == 0 ? CLR_ALT_ROW : CLR_WHITE;

            cell(wb, row, 1, qh.tenQuanHuyen(), dataStyle(wb, bg, false));
            cell(wb, row, 2, qh.tongCoSo(),     dataStyle(wb, bg, true));
            cell(wb, row, 3, qh.datChuan(),     dataStyle(wb, bg, true));

            String vpBg = qh.viPham() > 10 ? CLR_WARN : bg;
            cell(wb, row, 4, qh.viPham(), dataStyle(wb, vpBg, true));

            tongCS += qh.tongCoSo();
            tongDC += qh.datChuan();
            tongVP += qh.viPham();
        }

        // Tổng cộng
        int totalRow = 3 + list.size();
        Row rTotal = ws.createRow(totalRow); rTotal.setHeightInPoints(22);
        cell(wb, rTotal, 1, "TỔNG CỘNG", totalStyle(wb));
        cell(wb, rTotal, 2, tongCS, totalStyle(wb));
        cell(wb, rTotal, 3, tongDC, totalStyle(wb));
        cell(wb, rTotal, 4, tongVP, totalStyle(wb));
    }

    // ─────────────────────────────────────────────────────────────────────────
    // SHEET 3 – VI PHẠM THEO THÁNG
    // ─────────────────────────────────────────────────────────────────────────
    private void buildSheetViPhamTheoThang(XSSFWorkbook wb, ThongKeViPhamTheoThangResponse data) {
        XSSFSheet ws = wb.createSheet("Vi Phạm Theo Tháng");
        ws.setDisplayGridlines(false);

        ws.setColumnWidth(0, cols(4));
        ws.setColumnWidth(1, cols(20));
        ws.setColumnWidth(2, cols(18));
        ws.setColumnWidth(3, cols(4));

        Row r0 = ws.createRow(0); r0.setHeightInPoints(30);
        merge(ws, 0, 1, 0, 2);
        cell(wb, r0, 1, "THỐNG KÊ VI PHẠM THEO THÁNG",
                titleStyle(wb, CLR_HEADER_BG, CLR_HEADER_FG, 12));

        ws.createRow(1).setHeightInPoints(8);

        Row r2 = ws.createRow(2); r2.setHeightInPoints(24);
        cell(wb, r2, 1, "Tháng", colHeaderStyle(wb));
        cell(wb, r2, 2, "Số Vụ Vi Phạm", colHeaderStyle(wb));

        List<ThongKeViPhamTheoThangResponse.ThangViPham> ds = data.danhSach();
        for (int i = 0; i < ds.size(); i++) {
            ThongKeViPhamTheoThangResponse.ThangViPham tv = ds.get(i);
            Row row = ws.createRow(3 + i); row.setHeightInPoints(20);
            String bg = i % 2 == 0 ? CLR_ALT_ROW : CLR_WHITE;
            String numBg = tv.thangNam().equals(data.thangCaoNhat()) ? CLR_DANGER : bg;

            cell(wb, row, 1, tv.thangNam(), dataStyle(wb, bg, true));
            cell(wb, row, 2, tv.soVu(), dataStyle(wb, numBg, true));
        }

        int sumRow = 3 + ds.size();
        Row rSum = ws.createRow(sumRow); rSum.setHeightInPoints(22);
        cell(wb, rSum, 1, "Tổng / Bình quân", totalStyle(wb));
        cell(wb, rSum, 2, data.tongSoVu() + " / " + data.binhQuanMoiThang(), totalStyle(wb));

        ws.createRow(sumRow + 1).setHeightInPoints(10);
        Row rNote = ws.createRow(sumRow + 2); rNote.setHeightInPoints(20);
        cell(wb, rNote, 1, "Tháng cao nhất: " + data.thangCaoNhat() + " (" + data.soVuCaoNhat() + " vụ)", noteStyle(wb));
        merge(ws, sumRow + 2, 1, sumRow + 2, 2);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // SHEET 4 – GIẤY PHÉP SẮP HẾT HẠN
    // ─────────────────────────────────────────────────────────────────────────
    private void buildSheetGiayPhepSapHet(XSSFWorkbook wb, List<GiayPhepSapHetHanResponse> list) {
        XSSFSheet ws = wb.createSheet("Giấy Phép Sắp Hết Hạn");
        ws.setDisplayGridlines(false);

        ws.setColumnWidth(0, cols(2));
        ws.setColumnWidth(1, cols(6));
        ws.setColumnWidth(2, cols(16));
        ws.setColumnWidth(3, cols(28));
        ws.setColumnWidth(4, cols(30));
        ws.setColumnWidth(5, cols(16));
        ws.setColumnWidth(6, cols(18));
        ws.setColumnWidth(7, cols(2));

        Row r0 = ws.createRow(0); r0.setHeightInPoints(30);
        merge(ws, 0, 1, 0, 6);
        cell(wb, r0, 1, "DANH SÁCH GIẤY PHÉP SẮP HẾT HẠN",
                titleStyle(wb, CLR_HEADER_BG, CLR_HEADER_FG, 12));

        ws.createRow(1).setHeightInPoints(8);

        Row r2 = ws.createRow(2); r2.setHeightInPoints(24);
        String[] hds = {"STT", "Mã GP", "Tên Cơ Sở", "Địa Chỉ", "Ngày Hết Hạn", "Số Ngày Còn Lại"};
        for (int i = 0; i < hds.length; i++) {
            cell(wb, r2, 1 + i, hds[i], colHeaderStyle(wb));
        }

        for (int i = 0; i < list.size(); i++) {
            GiayPhepSapHetHanResponse gp = list.get(i);
            Row row = ws.createRow(3 + i); row.setHeightInPoints(22);

            int days = gp.soNgayConLai();
            String bg = days <= 10 ? CLR_DANGER : days <= 20 ? CLR_WARN : CLR_OK;

            cell(wb, row, 1, i + 1, dataStyle(wb, bg, true));
            cell(wb, row, 2, gp.maGiayPhep(), dataStyle(wb, bg, true));
            cell(wb, row, 3, gp.tenCoSo(), dataStyle(wb, bg, false));
            cell(wb, row, 4, gp.tenQuanHuyen(), dataStyle(wb, bg, false));
            cell(wb, row, 5, gp.ngayHetHan().format(DATE_FMT), dataStyle(wb, bg, true));
            cell(wb, row, 6, days + " ngày", dataStyle(wb, bg, true));
        }

        int noteRow = 3 + list.size() + 1;
        ws.createRow(noteRow).setHeightInPoints(8);
        Row rLegend = ws.createRow(noteRow + 1); rLegend.setHeightInPoints(20);
        merge(ws, noteRow + 1, 1, noteRow + 1, 6);
        cell(wb, rLegend, 1,
                "Chú thích: ĐỎ = Dưới 10 ngày (khẩn cấp) | VÀNG = 10-20 ngày (cảnh báo) | XANH = 21-30 ngày",
                noteStyle(wb));
    }

    // ─────────────────────────────────────────────────────────────────────────
    // SHEET 5 – VI PHẠM GẦN ĐÂY
    // ─────────────────────────────────────────────────────────────────────────
    private void buildSheetViPhamGanDay(XSSFWorkbook wb, List<ViPhamGanDayResponse> list) {
        XSSFSheet ws = wb.createSheet("Vi Phạm Gần Đây");
        ws.setDisplayGridlines(false);

        ws.setColumnWidth(0, cols(2));
        ws.setColumnWidth(1, cols(6));
        ws.setColumnWidth(2, cols(14));
        ws.setColumnWidth(3, cols(26));
        ws.setColumnWidth(4, cols(24));
        ws.setColumnWidth(5, cols(26));
        ws.setColumnWidth(6, cols(16));
        ws.setColumnWidth(7, cols(18));
        ws.setColumnWidth(8, cols(2));

        Row r0 = ws.createRow(0); r0.setHeightInPoints(30);
        merge(ws, 0, 1, 0, 7);
        cell(wb, r0, 1, "DANH SÁCH VI PHẠM GẦN ĐÂY",
                titleStyle(wb, CLR_HEADER_BG, CLR_HEADER_FG, 12));

        ws.createRow(1).setHeightInPoints(8);

        Row r2 = ws.createRow(2); r2.setHeightInPoints(24);
        String[] hds = {"STT", "Mã VP", "Tên Cơ Sở", "Địa Chỉ", "Nội Dung Vi Phạm", "Ngày KT", "Trạng Thái"};
        for (int i = 0; i < hds.length; i++) {
            cell(wb, r2, 1 + i, hds[i], colHeaderStyle(wb));
        }

        for (int i = 0; i < list.size(); i++) {
            ViPhamGanDayResponse vp = list.get(i);
            Row row = ws.createRow(3 + i); row.setHeightInPoints(22);
            String bg = i % 2 == 0 ? CLR_ALT_ROW : CLR_WHITE;

            String trangThaiStr = vp.trangThai() != null ? vp.trangThai() : "";
            String statusBg = switch (trangThaiStr) {
                case "CHUA_XU_PHAT" -> CLR_DANGER;
                case "DANG_XU_LY"   -> CLR_WARN;
                case "DA_XU_PHAT"   -> CLR_OK;
                default             -> bg;
            };

            cell(wb, row, 1, i + 1, dataStyle(wb, bg, true));
            cell(wb, row, 2, vp.maViPham(), dataStyle(wb, bg, true));
            cell(wb, row, 3, vp.tenCoSo(), dataStyle(wb, bg, false));
            cell(wb, row, 4, vp.tenCoSo(), dataStyle(wb, bg, false));
            cell(wb, row, 5, vp.loaiViPham(), dataStyle(wb, bg, false));
            cell(wb, row, 6, vp.thoiGianKiemTra() != null ? vp.thoiGianKiemTra().format(DATE_FMT) : "",
                    dataStyle(wb, bg, true));
            cell(wb, row, 7, formatTrangThai(trangThaiStr), dataStyle(wb, statusBg, true));
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // HELPER METHODS
    // ─────────────────────────────────────────────────────────────────────────

    private String formatTrangThai(String s) {
        return switch (s) {
            case "CHUA_XU_PHAT" -> "Chưa xử phạt";
            case "DANG_XU_LY"   -> "Đang xử lý";
            case "DA_XU_PHAT"   -> "Đã xử phạt";
            default             -> s;
        };
    }

    private int cols(int chars) {
        return chars * 256;
    }

    private void merge(XSSFSheet ws, int r1, int c1, int r2, int c2) {
        ws.addMergedRegion(new CellRangeAddress(r1, r2, c1, c2));
    }

    private XSSFCell cell(XSSFWorkbook wb, Row row, int col, Object value, XSSFCellStyle style) {
        XSSFCell c = (XSSFCell) row.createCell(col);
        if (value instanceof Number n) {
            c.setCellValue(n.doubleValue());
        } else {
            c.setCellValue(value == null ? "" : value.toString());
        }
        c.setCellStyle(style);
        return c;
    }

    // Style factories...
    private XSSFCellStyle base(XSSFWorkbook wb) {
        XSSFCellStyle s = wb.createCellStyle();
        XSSFFont f = wb.createFont();
        f.setFontName("Arial");
        f.setFontHeightInPoints((short) 10);
        s.setFont(f);
        setBorder(s);
        s.setWrapText(true);
        return s;
    }

    private void setBorder(XSSFCellStyle s) {
        s.setBorderTop(BorderStyle.THIN);
        s.setTopBorderColor(IndexedColors.GREY_50_PERCENT.index);
        s.setBorderBottom(BorderStyle.THIN);
        s.setBottomBorderColor(IndexedColors.GREY_50_PERCENT.index);
        s.setBorderLeft(BorderStyle.THIN);
        s.setLeftBorderColor(IndexedColors.GREY_50_PERCENT.index);
        s.setBorderRight(BorderStyle.THIN);
        s.setRightBorderColor(IndexedColors.GREY_50_PERCENT.index);
    }

    private XSSFCellStyle titleStyle(XSSFWorkbook wb, String bgArgb, String fgArgb, int size) {
        XSSFCellStyle s = base(wb);
        s.setFillForegroundColor(new XSSFColor(hexToBytes(bgArgb), null));
        s.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        s.setAlignment(HorizontalAlignment.CENTER);
        s.setVerticalAlignment(VerticalAlignment.CENTER);

        XSSFFont f = wb.createFont();
        f.setFontName("Arial");
        f.setBold(true);
        f.setFontHeightInPoints((short) size);
        f.setColor(new XSSFColor(hexToBytes(fgArgb), null));
        s.setFont(f);
        return s;
    }

    private XSSFCellStyle sectionHeaderStyle(XSSFWorkbook wb) {
        return titleStyle(wb, CLR_SUB_BG, CLR_SUB_FG, 11);
    }

    private XSSFCellStyle colHeaderStyle(XSSFWorkbook wb) {
        return titleStyle(wb, CLR_SUB_BG, CLR_SUB_FG, 10);
    }

    private XSSFCellStyle labelStyle(XSSFWorkbook wb, String bgArgb) {
        XSSFCellStyle s = base(wb);
        s.setFillForegroundColor(new XSSFColor(hexToBytes(bgArgb), null));
        s.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        s.setAlignment(HorizontalAlignment.LEFT);
        s.setVerticalAlignment(VerticalAlignment.CENTER);
        return s;
    }

    private XSSFCellStyle kpiValueStyle(XSSFWorkbook wb, String bgArgb) {
        XSSFCellStyle s = base(wb);
        s.setFillForegroundColor(new XSSFColor(hexToBytes(bgArgb), null));
        s.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        s.setAlignment(HorizontalAlignment.CENTER);
        s.setVerticalAlignment(VerticalAlignment.CENTER);

        XSSFFont f = wb.createFont();
        f.setFontName("Arial");
        f.setBold(true);
        f.setFontHeightInPoints((short) 12);
        f.setColor(new XSSFColor(hexToBytes(CLR_TEXT_BLUE), null));
        s.setFont(f);
        return s;
    }

    private XSSFCellStyle unitStyle(XSSFWorkbook wb, String bgArgb) {
        XSSFCellStyle s = base(wb);
        s.setFillForegroundColor(new XSSFColor(hexToBytes(bgArgb), null));
        s.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        s.setAlignment(HorizontalAlignment.CENTER);
        s.setVerticalAlignment(VerticalAlignment.CENTER);

        XSSFFont f = wb.createFont();
        f.setFontName("Arial");
        f.setFontHeightInPoints((short) 9);
        s.setFont(f);
        return s;
    }

    private XSSFCellStyle dataStyle(XSSFWorkbook wb, String bgArgb, boolean center) {
        XSSFCellStyle s = labelStyle(wb, bgArgb);
        s.setAlignment(center ? HorizontalAlignment.CENTER : HorizontalAlignment.LEFT);
        return s;
    }

    private XSSFCellStyle totalStyle(XSSFWorkbook wb) {
        XSSFCellStyle s = base(wb);
        s.setFillForegroundColor(new XSSFColor(hexToBytes(CLR_HEADER_BG), null));
        s.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        s.setAlignment(HorizontalAlignment.CENTER);
        s.setVerticalAlignment(VerticalAlignment.CENTER);

        XSSFFont f = wb.createFont();
        f.setFontName("Arial");
        f.setBold(true);
        f.setColor(new XSSFColor(hexToBytes(CLR_HEADER_FG), null));
        f.setFontHeightInPoints((short) 10);
        s.setFont(f);
        return s;
    }

    private XSSFCellStyle noteStyle(XSSFWorkbook wb) {
        XSSFCellStyle s = base(wb);
        XSSFFont f = wb.createFont();
        f.setFontName("Arial");
        f.setItalic(true);
        f.setFontHeightInPoints((short) 9);
        s.setFont(f);
        return s;
    }

    private byte[] hexToBytes(String argb) {
        String hex = argb.length() == 8 ? argb.substring(2) : argb;
        return new byte[]{
                (byte) Integer.parseInt(hex.substring(0, 2), 16),
                (byte) Integer.parseInt(hex.substring(2, 4), 16),
                (byte) Integer.parseInt(hex.substring(4, 6), 16)
        };
    }
}