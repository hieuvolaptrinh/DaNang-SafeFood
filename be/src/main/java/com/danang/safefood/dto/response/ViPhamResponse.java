package com.danang.safefood.dto.response;

import com.danang.safefood.entity.HinhThucKhacPhuc;
import com.danang.safefood.entity.ViPham;
import com.danang.safefood.util.TrangThaiKhacPhuc;
import com.danang.safefood.util.TrangThaiViPham;

import java.math.BigDecimal;
import java.util.List;

/**
 * Response chi tiết vi phạm (cho CSKD xem trong màn hình "Chi tiết vi phạm").
 *
 * Trường <code>tinhTrangKhacPhuc</code> = label tổng hợp từ các hình thức xử phạt:
 *  - Tất cả ĐÃ KHẮC PHỤC → "Đã khắc phục"
 *  - Có ít nhất 1 ĐANG KHẮC PHỤC → "Đang khắc phục"
 *  - Còn lại → "Chưa khắc phục"
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
        TrangThaiKhacPhuc tinhTrangKhacPhuc,
        String tinhTrangKhacPhucLabel,
        List<HinhThucKhacPhucInfo> danhSachKhacPhuc) {

    public record HinhThucKhacPhucInfo(
            String maHinhThucKhacPhuc,
            BigDecimal soTienKhacPhuc,
            TrangThaiKhacPhuc tinhTrangKhacPhuc,
            String tinhTrangKhacPhucLabel) {
        public static HinhThucKhacPhucInfo from(HinhThucKhacPhuc h) {
            var status = h.getTinhTrangKhacPhuc() == null
                    ? TrangThaiKhacPhuc.CHUA_KHAC_PHUC
                    : h.getTinhTrangKhacPhuc();
            return new HinhThucKhacPhucInfo(
                    h.getMaHinhThucKhacPhuc(),
                    h.getSoTienKhacPhuc(),
                    status,
                    status.label());
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

        TrangThaiKhacPhuc tinhTrang;
        if (ds.isEmpty()) {
            tinhTrang = TrangThaiKhacPhuc.CHUA_KHAC_PHUC;
        } else if (ds.stream().allMatch(h -> h.tinhTrangKhacPhuc() == TrangThaiKhacPhuc.DA_KHAC_PHUC)) {
            tinhTrang = TrangThaiKhacPhuc.DA_KHAC_PHUC;
        } else if (ds.stream().anyMatch(h -> h.tinhTrangKhacPhuc() == TrangThaiKhacPhuc.DANG_KHAC_PHUC
                || h.tinhTrangKhacPhuc() == TrangThaiKhacPhuc.DA_KHAC_PHUC)) {
            tinhTrang = TrangThaiKhacPhuc.DANG_KHAC_PHUC;
        } else {
            tinhTrang = TrangThaiKhacPhuc.CHUA_KHAC_PHUC;
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
                tinhTrang.label(),
                ds);
    }
}
