package com.danang.safefood.dto.response;

import com.danang.safefood.entity.MauKiemNghiem;

import java.time.LocalDate;

public record MauKiemNghiemResponse(
        String maMau,
        String tenMau,
        LocalDate ngayThu,
        LocalDate ngayKiemNghiem,
        String trangThai,
        String loaiMau,
        String noiDung,
        LocalDate ngayYeuCau,
        LocalDate hanHoanThanh
) {
    public static MauKiemNghiemResponse from(MauKiemNghiem e) {
        return new MauKiemNghiemResponse(
                e.getMaMau(),
                e.getTenMau(),
                e.getNgayThu(),
                e.getNgayKiemNghiem(),
                e.getTrangThai(),
                e.getLoaiMau(),
                e.getNoiDung(),
                e.getNgayYeuCau(),
                e.getHanHoanThanh()
        );
    }
}
