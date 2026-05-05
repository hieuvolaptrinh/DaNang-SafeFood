package com.danang.safefood.dto.response;

import com.danang.safefood.entity.LoaiQuyDinh;
import com.danang.safefood.entity.QuyDinh;
import com.danang.safefood.entity.TrangThaiQuyDinh;

import java.time.Instant;
import java.time.LocalDate;

public record QuyDinhResponse(
        String maQuyDinh,
        String tieuDe,
        String noiDung,
        LoaiQuyDinh loai,
        TrangThaiQuyDinh trangThai,
        LocalDate ngayBanHanh,
        String createdBy,
        Instant createdAt,
        Instant updatedAt
) {
    public static QuyDinhResponse from(QuyDinh e) {
        return new QuyDinhResponse(
                e.getMaQuyDinh(), e.getTieuDe(), e.getNoiDung(),
                e.getLoai(), e.getTrangThai(), e.getNgayBanHanh(),
                e.getCreatedBy(), e.getCreatedAt(), e.getUpdatedAt()
        );
    }
}
