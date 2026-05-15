package com.danang.safefood.dto.response;

import com.danang.safefood.entity.HinhThucKhacPhuc;
import com.danang.safefood.entity.ViPham;
import com.danang.safefood.util.TrangThaiViPham;

import java.math.BigDecimal;
import java.util.List;

/**
 * Response chi tiết vi phạm (cho CSKD xem trong màn hình "Chi tiết vi phạm").
 */
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
        String tinhTrangKhacPhuc,
        List<HinhThucKhacPhucInfo> danhSachKhacPhuc) {

    public record HinhThucKhacPhucInfo(
            String maHinhThucKhacPhuc,
            BigDecimal soTienKhacPhuc,
            String tinhTrangKhacPhuc) {
        public static HinhThucKhacPhucInfo from(HinhThucKhacPhuc h) {
            return new HinhThucKhacPhucInfo(
                    h.getMaHinhThucKhacPhuc(),
                    h.getSoTienKhacPhuc(),
                    h.getTinhTrangKhacPhuc());
        }
    }

    public static ViPhamResponse from(ViPham v) {
        var ds = v.getHinhThucKhacPhucList() == null
                ? List.<HinhThucKhacPhucInfo>of()
                : v.getHinhThucKhacPhucList().stream()
                        .map(HinhThucKhacPhucInfo::from)
                        .toList();

        BigDecimal tong = ds.stream()
                .map(HinhThucKhacPhucInfo::soTienKhacPhuc)
                .filter(java.util.Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Tổng hợp tinhTrangKhacPhuc: nếu mọi item là "Da khac phuc" thì hiển thị "Da khac phuc"
        String tinhTrang;
        if (ds.isEmpty()) {
            tinhTrang = "Chua co hinh thuc khac phuc";
        } else if (ds.stream().allMatch(h -> "Da khac phuc".equalsIgnoreCase(h.tinhTrangKhacPhuc()))) {
            tinhTrang = "Da khac phuc";
        } else if (ds.stream().anyMatch(h -> "Da khac phuc".equalsIgnoreCase(h.tinhTrangKhacPhuc()))) {
            tinhTrang = "Khac phuc mot phan";
        } else {
            tinhTrang = "Chua khac phuc";
        }

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
                tong,
                tinhTrang,
                ds);
    }
}
