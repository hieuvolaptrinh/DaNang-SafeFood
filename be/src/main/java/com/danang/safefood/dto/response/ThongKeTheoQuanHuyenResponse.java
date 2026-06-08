package com.danang.safefood.dto.response;

public record ThongKeTheoQuanHuyenResponse(
        String maQuanHuyen,
        String tenQuanHuyen,
        long tongCoSo,
        long datChuan,
        long viPham,
        double tyLeDat,      // %
        String mucDo         // Tốt / Trung bình / Thấp
) {

    /**
     * Compact constructor - Cách viết này là SAI với Record
     * → Dẫn đến lỗi "Cannot assign a value to final variable"
     */

    // ====================== CÁCH ĐÚNG ======================

    // Constructor đầy đủ (canonical constructor)
    public ThongKeTheoQuanHuyenResponse(
            String maQuanHuyen,
            String tenQuanHuyen,
            long tongCoSo,
            long datChuan,
            long viPham,
            double tyLeDat,
            String mucDo) {

        this.maQuanHuyen = maQuanHuyen;
        this.tenQuanHuyen = tenQuanHuyen;
        this.tongCoSo = tongCoSo;
        this.datChuan = datChuan;
        this.viPham = viPham;

        // Tính toán tyLeDat và mucDo
        this.tyLeDat = tongCoSo > 0
                ? Math.round((datChuan * 100.0) / tongCoSo * 100) / 100.0
                : 0.0;

        this.mucDo = tinhMucDo(this.tyLeDat);
    }

    // Constructor tiện lợi (khuyến nghị dùng)
    public ThongKeTheoQuanHuyenResponse(
            String maQuanHuyen,
            String tenQuanHuyen,
            long tongCoSo,
            long datChuan,
            long viPham) {

        this(maQuanHuyen, tenQuanHuyen, tongCoSo, datChuan, viPham, 0.0, null);
    }

    private static String tinhMucDo(double tyLe) {
        if (tyLe >= 85) return "Tốt";
        if (tyLe >= 75) return "Trung bình";
        return "Thấp";
    }
}