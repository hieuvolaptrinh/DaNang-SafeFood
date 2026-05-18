package com.danang.safefood.dto.response;

import java.util.List;

public record ThongKeViPhamTheoThangResponse(
        List<ThangViPham> danhSach,
        long tongSoVu,
        double binhQuanMoiThang,
        String thangCaoNhat,
        long soVuCaoNhat
) {

    public record ThangViPham(
            String thangNam,   // Ví dụ: "T4/2026"
            long soVu
    ) {}
}
