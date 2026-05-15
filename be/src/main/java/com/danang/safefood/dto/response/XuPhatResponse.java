package com.danang.safefood.dto.response;

import com.danang.safefood.util.TrangThaiXuPhat;
import com.danang.safefood.entity.XuPhat;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

public record XuPhatResponse(
        String maXuPhat,
        String soQuyetDinh,
        BigDecimal mucPhat,
        String lyDoXuPhat,
        TrangThaiXuPhat trangThai,
        LocalDate ngayXuPhat,
        String maCoSo,
        String tenCoSo,
        String createdBy,
        Instant createdAt
) {
    public static XuPhatResponse from(XuPhat e) {
        return new XuPhatResponse(
                e.getMaXuPhat(),
                e.getSoQuyetDinh(),
                e.getMucPhat(),
                e.getLyDoXuPhat(),
                e.getTrangThai(),
                e.getNgayXuPhat(),
                e.getCoSoKinhDoanh() != null ? e.getCoSoKinhDoanh().getMaCoSo() : null,
                e.getCoSoKinhDoanh() != null ? e.getCoSoKinhDoanh().getTenCoSo() : null,
                e.getCreatedBy(),
                e.getCreatedAt()
        );
    }
}
