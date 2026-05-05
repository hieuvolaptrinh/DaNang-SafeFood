package com.danang.safefood.dto.response;

import com.danang.safefood.entity.LichThanhTra;

public record ThanhTraResponse(
        String maThanhTra,
        String trangThai,
        String noiDung,
        String maCoSo,
        String tenCoSo,
        String maNguoiPhuTrach,
        String tenNguoiPhuTrach
) {
    public static ThanhTraResponse from(LichThanhTra e) {
        return new ThanhTraResponse(
                e.getMaThanhTra(),
                e.getTrangThai(),
                e.getNoiDung(),
                e.getCoSoKinhDoanh() != null ? e.getCoSoKinhDoanh().getMaCoSo() : null,
                e.getCoSoKinhDoanh() != null ? e.getCoSoKinhDoanh().getTenCoSo() : null,
                e.getNguoiPhuTrach() != null ? e.getNguoiPhuTrach().getMaNguoiDung() : null,
                e.getNguoiPhuTrach() != null ? e.getNguoiPhuTrach().getHoTen() : null
        );
    }
}
