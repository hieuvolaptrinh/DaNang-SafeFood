package com.danang.safefood.dto.response;

import com.danang.safefood.entity.HoSoDangKiKinhDoanh;

import java.time.LocalDate;

/**
 * Response cho 1 hồ sơ/giấy tờ kinh doanh.
 */
public record GiayPhepResponse(
        String maHoSo,
        String maLoaiGiayTo,
        String tenLoaiGiayTo,
        String trangThai,
        LocalDate ngayNop,
        LocalDate ngayCap,
        LocalDate ngayHetHan,
        String maCoSo,
        String tenCoSo) {

    public static GiayPhepResponse from(HoSoDangKiKinhDoanh h) {
        var coSo = h.getCoSoKinhDoanh();
        var loai = h.getLoaiGiayTo();
        return new GiayPhepResponse(
                h.getMaHoSo(),
                loai != null ? loai.getMaLoaiGiayTo() : null,
                loai != null ? loai.getTenLoaiGiayTo() : null,
                h.getTrangThai(),
                h.getNgayNop(),
                h.getNgayCap(),
                h.getNgayHetHan(),
                coSo != null ? coSo.getMaCoSo() : null,
                coSo != null ? coSo.getTenCoSo() : null);
    }
}
