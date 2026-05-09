package com.danang.safefood.dto.response;

import com.danang.safefood.entity.MauChiTieu;

public record MauChiTieuResponse(
        String maMau,
        String maChiTieu,
        String tenChiTieu,
        String ketQua
) {
    public static MauChiTieuResponse from(MauChiTieu e) {
        return new MauChiTieuResponse(
                e.getMaMau(),
                e.getMaChiTieu(),
                e.getChiTieuKiemNghiem() != null ? e.getChiTieuKiemNghiem().getTenChiTieu() : null,
                e.getKetQua()
        );
    }
}
