package com.danang.safefood.dto.response;

import com.danang.safefood.entity.KhieuNai;

import java.time.LocalDateTime;

public record KhieuNaiResponse(
        String maKhieuNai,
        String tieuDe,
        String moTaChiTiet,
        String ketQuaXuLy,
        String trangThai,
        LocalDateTime thoiGianKhieuNai
) {
    public static KhieuNaiResponse from(KhieuNai e) {
        return new KhieuNaiResponse(
                e.getMaKhieuNai(),
                e.getTieuDe(),
                e.getMoTaChiTiet(),
                e.getKetQuaXuLy(),
                e.getTrangThai(),
                e.getThoiGianKhieuNai()
        );
    }
}
