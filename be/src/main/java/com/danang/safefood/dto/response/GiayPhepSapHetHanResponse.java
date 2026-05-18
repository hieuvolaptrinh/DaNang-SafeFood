package com.danang.safefood.dto.response;

import com.danang.safefood.entity.GiayPhep;

import java.time.LocalDate;

public record GiayPhepSapHetHanResponse(
        String maGiayPhep,
        String tenCoSo,
        String soGiayPhep,           // nếu có
        String tenQuanHuyen,
        LocalDate ngayHetHan,
        String tinhTrang,            // "Quá hạn X ngày" hoặc "Còn X ngày"
        int soNgayConLai
) {

    public static GiayPhepSapHetHanResponse of(GiayPhep gp) {
        LocalDate today = LocalDate.now();
        long days = java.time.temporal.ChronoUnit.DAYS.between(today, gp.getNgayHetHan());

        String tinhTrang;
        if (days < 0) {
            tinhTrang = "Quá hạn " + Math.abs(days) + " ngày";
        } else if (days == 0) {
            tinhTrang = "Hết hạn hôm nay";
        } else {
            tinhTrang = "Còn " + days + " ngày";
        }

        String tenQuan = gp.getCoSoKinhDoanh() != null
                && gp.getCoSoKinhDoanh().getPhuongXa() != null
                ? getTenQuanHuyen(gp.getCoSoKinhDoanh().getPhuongXa().getTenPhuongXa())
                : "Khác";

        return new GiayPhepSapHetHanResponse(
                gp.getMaGiayPhep(),
                gp.getCoSoKinhDoanh() != null ? gp.getCoSoKinhDoanh().getTenCoSo() : "",
                gp.getLoaiGiayPhep(),           // hoặc soGiayPhep nếu bạn có
                tenQuan,
                gp.getNgayHetHan(),
                tinhTrang,
                (int) days
        );
    }

    private static String getTenQuanHuyen(String tenPhuong) {
        if (tenPhuong == null) return "Khác";
        String t = tenPhuong.toLowerCase();
        if (t.contains("hải châu")) return "Hải Châu";
        if (t.contains("thanh khê")) return "Thanh Khê";
        if (t.contains("sơn trà")) return "Sơn Trà";
        if (t.contains("ngũ hành")) return "Ngũ Hành Sơn";
        if (t.contains("liên chiểu")) return "Liên Chiểu";
        if (t.contains("cẩm lệ")) return "Cẩm Lệ";
        if (t.contains("hòa vang")) return "Hòa Vang";
        return "Khác";
    }
}