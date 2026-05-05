package com.danang.safefood.dto.response;

import com.danang.safefood.entity.PhanAnh;

import java.time.LocalDateTime;

public record PhanAnhResponse(
        String maPhanAnh,
        String trangThaiPhanAnh,
        String lyDo,
        String ghiChu,
        LocalDateTime ngayGui,
        String maNguoiPhanAnh,
        String tenNguoiPhanAnh,
        String maCoSo,
        String tenCoSo
) {
    public static PhanAnhResponse from(PhanAnh e) {
        return new PhanAnhResponse(
                e.getMaPhanAnh(),
                e.getTrangThaiPhanAnh(),
                e.getLyDo(),
                e.getGhiChu(),
                e.getNgayGui(),
                e.getNguoiPhanAnh() != null ? e.getNguoiPhanAnh().getMaNguoiDung() : null,
                e.getNguoiPhanAnh() != null ? e.getNguoiPhanAnh().getHoTen() : null,
                e.getCoSoKinhDoanh() != null ? e.getCoSoKinhDoanh().getMaCoSo() : null,
                e.getCoSoKinhDoanh() != null ? e.getCoSoKinhDoanh().getTenCoSo() : null
        );
    }
}
