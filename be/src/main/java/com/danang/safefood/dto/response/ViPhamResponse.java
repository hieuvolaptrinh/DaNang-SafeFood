package com.danang.safefood.dto.response;

import com.danang.safefood.entity.ViPham;

public record ViPhamResponse(
        String maViPham,
        String moTaThem,
        String khacPhuc,
        String trangThaiPheDuyet,
        String mucDo,
        String maHoSo,
        String maLoaiViPham,
        String tenLoaiViPham) {
    public static ViPhamResponse from(ViPham e) {
        return new ViPhamResponse(
                e.getMaViPham(),
                e.getMoTaThem(),
                e.getKhacPhuc(),
                e.getTrangThaiPheDuyet() != null ? e.getTrangThaiPheDuyet().getLabel() : null,
                e.getMucDo(),
                e.getHoSoThanhTra() != null ? e.getHoSoThanhTra().getMaHoSo() : null,
                e.getLoaiViPham() != null ? e.getLoaiViPham().getMaLoaiViPham() : null,
                e.getLoaiViPham() != null ? e.getLoaiViPham().getTenLoaiViPham() : null);
    }
}
