package com.danang.safefood.dto.response;

public record YeuCauKiemNghiemStatsResponse(
        long tongYeuCau,
        long choDuyet,
        long dangXuLy,
        long hoanThanh
) {
    public static YeuCauKiemNghiemStatsResponse from(long total, long pending, long processing, long completed) {
        return new YeuCauKiemNghiemStatsResponse(total, pending, processing, completed);
    }
}
