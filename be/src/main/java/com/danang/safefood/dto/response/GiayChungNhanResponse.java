package com.danang.safefood.dto.response;

import com.danang.safefood.entity.ChungNhanATVSTP;

import java.time.LocalDate;

public record GiayChungNhanResponse(
        String maCN,
        String tenChungNhan,
        LocalDate ngayBanHanh,
        LocalDate ngayHetHan,
        String trangThai,
        String maCoSo,
        String tenCoSo
) {
    public static GiayChungNhanResponse from(ChungNhanATVSTP e) {
        return new GiayChungNhanResponse(
                e.getMaCN(),
                e.getTenChungNhan(),
                e.getNgayBanHanh(),
                e.getNgayHetHan(),
                e.getTrangThai(),
                e.getCoSoKinhDoanh() != null ? e.getCoSoKinhDoanh().getMaCoSo() : null,
                e.getCoSoKinhDoanh() != null ? e.getCoSoKinhDoanh().getTenCoSo() : null
        );
    }
}
