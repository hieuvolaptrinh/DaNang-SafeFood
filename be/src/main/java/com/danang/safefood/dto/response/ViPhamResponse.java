package com.danang.safefood.dto.response;

import com.danang.safefood.entity.HinhThucKhacPhuc;
import com.danang.safefood.entity.ViPham;
import com.danang.safefood.util.TrangThaiKhacPhuc;
import com.danang.safefood.util.TrangThaiViPham;

import java.math.BigDecimal;
import java.util.List;


public record ViPhamResponse(
        String maViPham,
        String moTaThem,
        String khacPhuc,
        TrangThaiViPham trangThaiPheDuyet,
        String mucDo,
        String maHoSo,
        String tenLoaiViPham,
        String maCoSo,
        String tenCoSo,
        BigDecimal tongTienPhat,
        String yeuCauKhacPhuc,
        String lyDo) {

    public static ViPhamResponse from(ViPham v) {
        return new ViPhamResponse(
                v.getMaViPham(),
                v.getMoTaThem(),
                v.getKhacPhuc(),
                v.getTrangThaiPheDuyet(),
                v.getMucDo(),
                v.getHoSoThanhTra() != null ? v.getHoSoThanhTra().getMaHoSo() : null,
                v.getLoaiViPham() != null ? v.getLoaiViPham().getTenLoaiViPham() : null,
                v.getCoSoKinhDoanh() != null ? v.getCoSoKinhDoanh().getMaCoSo() : null,
                v.getCoSoKinhDoanh() != null ? v.getCoSoKinhDoanh().getTenCoSo() : null,
                v.getSoTienPhat(),
                v.getKhacPhuc(),
                v.getMoTaThem()
        );
    }
}
