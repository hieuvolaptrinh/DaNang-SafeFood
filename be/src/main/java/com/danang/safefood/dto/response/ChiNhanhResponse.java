package com.danang.safefood.dto.response;

import com.danang.safefood.entity.ChiNhanh;

public record ChiNhanhResponse(
        String diaChi,
        String soDienThoai
) {
    public static ChiNhanhResponse from(ChiNhanh e) {
        return new ChiNhanhResponse(
                e.getDiaChi(),
                e.getSoDienThoai()
        );
    }
}
