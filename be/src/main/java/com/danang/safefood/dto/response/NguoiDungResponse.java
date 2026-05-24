package com.danang.safefood.dto.response;

import com.danang.safefood.entity.NguoiDung;

// NguoiDungResponse.java
public record NguoiDungResponse(
        String maNguoiDung,
        String hoTen,
        String gioiTinh,
        String cccd
) {
    public static NguoiDungResponse from(NguoiDung entity) {
        return new NguoiDungResponse(
                entity.getMaNguoiDung(),
                entity.getHoTen(),
                entity.getGioiTinh(),
                entity.getCccd()
        );
    }
}
