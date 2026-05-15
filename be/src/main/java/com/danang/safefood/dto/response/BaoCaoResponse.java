package com.danang.safefood.dto.response;

import com.danang.safefood.entity.BaoCao;
import java.time.format.DateTimeFormatter;

public record BaoCaoResponse(
        String id,
        String tenCoSo,
        String loaiThanhTra,
        String thanhTraVien,
        String ngay,
        String ketQua,
        Double diem,
        String quanHuyen,
        String noiDung,
        String nhanXet,
        String tepDinhKem
) {
    public static BaoCaoResponse from(BaoCao e) {
        String tenCoSo = null;
        String loaiThanhTra = null;
        String thanhTraVien = null;
        String ngay = null;
        String ketQua = null;
        Double diem = null;
        String quanHuyen = null;

        if (e.getHoSoThanhTra() != null) {
            diem = e.getHoSoThanhTra().getDiem();
            ketQua = e.getHoSoThanhTra().getTinhTrangViPham();
            if (e.getHoSoThanhTra().getThoiGianKiemTra() != null) {
                // If it is LocalDateTime
                ngay = e.getHoSoThanhTra().getThoiGianKiemTra().toLocalDate().toString();
            }
            if (e.getHoSoThanhTra().getLichThanhTra() != null) {
                loaiThanhTra = e.getHoSoThanhTra().getLichThanhTra().getNoiDung();
                if (e.getHoSoThanhTra().getLichThanhTra().getNguoiPhuTrach() != null) {
                    thanhTraVien = e.getHoSoThanhTra().getLichThanhTra().getNguoiPhuTrach().getHoTen();
                }
                if (e.getHoSoThanhTra().getLichThanhTra().getCoSoKinhDoanh() != null) {
                    tenCoSo = e.getHoSoThanhTra().getLichThanhTra().getCoSoKinhDoanh().getTenCoSo();
                    if (e.getHoSoThanhTra().getLichThanhTra().getCoSoKinhDoanh().getPhuongXa() != null) {
                        quanHuyen = e.getHoSoThanhTra().getLichThanhTra().getCoSoKinhDoanh().getPhuongXa().getTenPhuongXa();
                    }
                }
            }
        }

        return new BaoCaoResponse(
                e.getMaBaoCao(),
                tenCoSo,
                loaiThanhTra,
                thanhTraVien,
                ngay,
                ketQua,
                diem,
                quanHuyen,
                e.getNoiDung(),
                e.getNhanXet(),
                e.getTepDinhKem()
        );
    }
}
