package com.danang.safefood.dto.response;

import com.danang.safefood.entity.CoSoKinhDoanh;

import java.time.LocalDate;

public record CoSoKinhDoanhResponse(
        String maCoSo,
        String tenCoSo,
        String soGiayPhep,
        LocalDate ngayHetHanGiayPhep,
        String trangThai,
        String maPX,
        String tenPhuongXa,
        String maChuSoHuu,
        String tenChuSoHuu
) {
    public static CoSoKinhDoanhResponse from(CoSoKinhDoanh e) {
        return new CoSoKinhDoanhResponse(
                e.getMaCoSo(),
                e.getTenCoSo(),
                e.getSoGiayPhep(),
                e.getNgayHetHanGiayPhep(),
                e.getTrangThai(),
                e.getPhuongXa() != null ? e.getPhuongXa().getMaPX() : null,
                e.getPhuongXa() != null ? e.getPhuongXa().getTenPhuongXa() : null,
                e.getChuSoHuu() != null ? e.getChuSoHuu().getMaNguoiDung() : null,
                e.getChuSoHuu() != null ? e.getChuSoHuu().getHoTen() : null
        );
    }
}
