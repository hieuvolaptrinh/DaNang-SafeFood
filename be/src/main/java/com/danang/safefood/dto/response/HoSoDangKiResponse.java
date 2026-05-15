package com.danang.safefood.dto.response;

import com.danang.safefood.entity.HoSoDangKiKinhDoanh;

import java.time.LocalDate;

public record HoSoDangKiResponse(
        String maHoSo,
        LocalDate ngayNop,
        LocalDate ngayCap,
        LocalDate ngayHetHan,
        String trangThai,
        String urlFile,
        String maCoSo,
        String tenCoSo,
        String maLoaiGiayTo,
        String tenLoaiGiayTo) {

    public static HoSoDangKiResponse from(HoSoDangKiKinhDoanh h) {
        var coSo = h.getCoSoKinhDoanh();
        var loai = h.getLoaiGiayTo();
        return new HoSoDangKiResponse(
                h.getMaHoSo(),
                h.getNgayNop(),
                h.getNgayCap(),
                h.getNgayHetHan(),
                h.getTrangThai(),
                h.getUrlFile(),
                coSo != null ? coSo.getMaCoSo() : null,
                coSo != null ? coSo.getTenCoSo() : null,
                loai != null ? loai.getMaLoaiGiayTo() : null,
                loai != null ? loai.getTenLoaiGiayTo() : null);
    }
}
