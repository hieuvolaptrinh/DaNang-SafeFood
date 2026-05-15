package com.danang.safefood.dto.response;

import com.danang.safefood.entity.CoSoKinhDoanh;

import java.time.LocalDate;

/**
 * Cơ sở kinh doanh thuộc CSKD đang đăng nhập.
 */
public record MyBusinessResponse(
        String maCoSo,
        String tenCoSo,
        String soGiayPhep,
        LocalDate ngayHetHanGiayPhep,
        String trangThai,
        String tenPhuongXa,
        String anhBia) {

    public static MyBusinessResponse from(CoSoKinhDoanh c) {
        return new MyBusinessResponse(
                c.getMaCoSo(),
                c.getTenCoSo(),
                c.getSoGiayPhep(),
                c.getNgayHetHanGiayPhep(),
                c.getTrangThai(),
                c.getPhuongXa() != null ? c.getPhuongXa().getTenPhuongXa() : null,
                c.getAnhBia());
    }
}
