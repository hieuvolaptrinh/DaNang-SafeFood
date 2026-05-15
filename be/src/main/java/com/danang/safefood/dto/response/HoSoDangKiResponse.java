package com.danang.safefood.dto.response;

import com.danang.safefood.entity.HoSoDangKiKinhDoanh;

import java.time.LocalDate;

public record HoSoDangKiResponse(
        String maHoSo,
        LocalDate ngayNop,
        String trangThai,
        String maCoSo,
        String tenCoSo) {

    public static HoSoDangKiResponse from(HoSoDangKiKinhDoanh h) {
        return new HoSoDangKiResponse(
                h.getMaHoSo(),
                h.getNgayNop(),
                h.getTrangThai(),
                h.getCoSoKinhDoanh() != null ? h.getCoSoKinhDoanh().getMaCoSo() : null,
                h.getCoSoKinhDoanh() != null ? h.getCoSoKinhDoanh().getTenCoSo() : null);
    }
}
