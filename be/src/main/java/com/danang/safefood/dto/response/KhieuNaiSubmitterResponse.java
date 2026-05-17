package com.danang.safefood.dto.response;

import com.danang.safefood.entity.CoSoKinhDoanh;
import com.danang.safefood.entity.KhieuNai;
import com.danang.safefood.entity.NguoiDung;
import com.danang.safefood.entity.TaiKhoan;

public record KhieuNaiSubmitterResponse(
        String fullName,
        String phone,
        String email,
        String address
) {
    public static KhieuNaiSubmitterResponse from(KhieuNai entity) {
        CoSoKinhDoanh coSo = entity.getCoSoKinhDoanh();
        NguoiDung chuSoHuu = coSo != null ? coSo.getChuSoHuu() : null;
        TaiKhoan taiKhoan = chuSoHuu != null ? chuSoHuu.getTaiKhoan() : null;

        return new KhieuNaiSubmitterResponse(
                chuSoHuu != null ? chuSoHuu.getHoTen() : null,
                taiKhoan != null ? taiKhoan.getPhone() : null,
                taiKhoan != null ? taiKhoan.getEmail() : null,
                coSo != null && coSo.getPhuongXa() != null ? coSo.getPhuongXa().getTenPhuongXa() : null
        );
    }
}
