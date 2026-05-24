package com.danang.safefood.dto.response;

import com.danang.safefood.entity.HinhThucKhacPhuc;
import com.danang.safefood.util.TrangThaiKhacPhuc;

import java.math.BigDecimal;

// HinhThucKhacPhucResponse.java
public record HinhThucKhacPhucResponse(
        String maHinhThucKhacPhuc,
        BigDecimal soTienKhacPhuc,
        TrangThaiKhacPhuc tinhTrangKhacPhuc,
        String noiDungKhacPhuc,
        String maViPham
) {
    public static HinhThucKhacPhucResponse from(HinhThucKhacPhuc entity) {
        return new HinhThucKhacPhucResponse(
                entity.getMaHinhThucKhacPhuc(),
                entity.getSoTienKhacPhuc(),
                entity.getTinhTrangKhacPhuc(),
                entity.getNoiDungKhacPhuc(),
                entity.getViPham() != null ? entity.getViPham().getMaViPham() : null
        );
    }
}
