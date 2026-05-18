package com.danang.safefood.dto.response;

import com.danang.safefood.entity.ViPham;

import java.time.LocalDateTime;

public record ViPhamGanDayResponse(
        String maViPham,
        String tenCoSo,
        String loaiViPham,
        String mucDo,
        String trangThai,
        LocalDateTime thoiGianKiemTra,
        String maHoSo
) {

    public static ViPhamGanDayResponse of(ViPham vp) {
        String tenCoSo = (vp.getCoSoKinhDoanh() != null)
                ? vp.getCoSoKinhDoanh().getTenCoSo() : "Không xác định";

        String loai = (vp.getLoaiViPham() != null)
                ? vp.getLoaiViPham().getTenLoaiViPham() : "Không xác định"; // giả sử entity LoaiViPham có getTenLoai()

        return new ViPhamGanDayResponse(
                vp.getMaViPham(),
                tenCoSo,
                loai,
                vp.getMucDo(),
                vp.getTrangThaiPheDuyet() != null ? vp.getTrangThaiPheDuyet().name() : "Đang mở",
                vp.getHoSoThanhTra() != null ? vp.getHoSoThanhTra().getThoiGianKiemTra() : null,
                vp.getHoSoThanhTra() != null ? vp.getHoSoThanhTra().getMaHoSo() : null
        );
    }
}