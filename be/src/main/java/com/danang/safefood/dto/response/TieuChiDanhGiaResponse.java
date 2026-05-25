package com.danang.safefood.dto.response;

import com.danang.safefood.entity.TieuChiDanhGia;

public record TieuChiDanhGiaResponse(
        String maTieuChi,
        String tenTieuChi,
        String nhom,
        Integer thuTu
) {
    public static TieuChiDanhGiaResponse from(TieuChiDanhGia entity) {
        return new TieuChiDanhGiaResponse(
                entity.getMaTieuChi(),
                entity.getTenTieuChi(),
                entity.getNhom(),
                entity.getThuTu()
        );
    }
}