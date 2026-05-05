package com.danang.safefood.dto.response;

import com.danang.safefood.entity.ThongBao;

import java.time.LocalDateTime;

public record ThongBaoResponse(
        String maThongBao,
        String tieuDe,
        String noiDung,
        LocalDateTime ngayGui,
        String loaiThongBao,
        Boolean isCongDong
) {
    public static ThongBaoResponse from(ThongBao e) {
        return new ThongBaoResponse(
                e.getMaThongBao(),
                e.getTieuDe(),
                e.getNoiDung(),
                e.getNgayGui(),
                e.getLoaiThongBao(),
                e.getIsCongDong()
        );
    }
}
