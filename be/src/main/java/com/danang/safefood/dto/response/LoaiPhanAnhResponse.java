package com.danang.safefood.dto.response;

import com.danang.safefood.entity.LoaiPhanAnh;

public record LoaiPhanAnhResponse(
        String maLoaiPhanAnh,
        String tenLoaiPhanAnh) {
    public static LoaiPhanAnhResponse from(LoaiPhanAnh entity) {
        return new LoaiPhanAnhResponse(
                entity.getMaLoaiPhanAnh(),
                entity.getTenLoaiPhanAnh());
    }
}
