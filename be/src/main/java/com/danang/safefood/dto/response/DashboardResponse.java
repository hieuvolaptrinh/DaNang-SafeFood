package com.danang.safefood.dto.response;

public record DashboardResponse(
        long tongCoSoKinhDoanh,
        long coSoHoatDong,
        long chungNhanHieuLuc,
        long chungNhanHetHan,    // hết hạn trong 30 ngày tới
        long thanhTraDangXuLy,
        long phanAnhChuaXuLy,
        long tongQuyDinhHieuLuc
) {}
