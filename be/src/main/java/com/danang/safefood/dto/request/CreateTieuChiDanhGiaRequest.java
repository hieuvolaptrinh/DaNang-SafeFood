package com.danang.safefood.dto.request;

public record CreateTieuChiDanhGiaRequest(
        String maTieuChi,
        String tenTieuChi,
        String nhom,
        Integer thuTu
) {}
