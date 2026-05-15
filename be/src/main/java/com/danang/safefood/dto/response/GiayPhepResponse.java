package com.danang.safefood.dto.response;

import com.danang.safefood.entity.GiayPhep;

import java.time.LocalDate;

public record GiayPhepResponse(
        String maGiayPhep,
        String loaiGiayPhep,
        String trangThai,
        LocalDate ngayCap,
        LocalDate ngayHetHan,
        String maCoSo,
        String tenCoSo
) {
    public static GiayPhepResponse from(GiayPhep e) {
        return new GiayPhepResponse(
                e.getMaGiayPhep(),
                e.getLoaiGiayPhep(),
                e.getTrangThai(),
                e.getNgayCap(),
                e.getNgayHetHan(),
                e.getCoSoKinhDoanh() != null ? e.getCoSoKinhDoanh().getMaCoSo() : null,
                e.getCoSoKinhDoanh() != null ? e.getCoSoKinhDoanh().getTenCoSo() : null
        );
    }
}
