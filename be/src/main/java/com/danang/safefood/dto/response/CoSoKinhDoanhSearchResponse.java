package com.danang.safefood.dto.response;

import com.danang.safefood.entity.CoSoKinhDoanh;

import java.time.LocalDate;
import java.util.List;

public record CoSoKinhDoanhSearchResponse(
        String maCoSo,
        String tenCoSo,
        String soGiayPhep,
        LocalDate ngayHetHanGiayPhep,
        String trangThai,
        String maPX,
        String tenPhuongXa,
        String anhBia,
        Integer soViPham,
        List<String> loaiHinhKinhDoanh
) {
    public static CoSoKinhDoanhSearchResponse from(CoSoKinhDoanh e, Integer soViPham, List<String> loaiHinh) {
        return new CoSoKinhDoanhSearchResponse(
                e.getMaCoSo(),
                e.getTenCoSo(),
                e.getSoGiayPhep(),
                e.getNgayHetHanGiayPhep(),
                e.getTrangThai(),
                e.getPhuongXa() != null ? e.getPhuongXa().getMaPX() : null,
                e.getPhuongXa() != null ? e.getPhuongXa().getTenPhuongXa() : null,
                e.getAnhBia(),
                soViPham,
                loaiHinh
        );
    }
}
