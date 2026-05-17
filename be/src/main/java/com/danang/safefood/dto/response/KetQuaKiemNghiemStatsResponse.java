package com.danang.safefood.dto.response;

public record KetQuaKiemNghiemStatsResponse(
        long tongMau,
        long datChuan,
        long khongDat,
        long choKetQua
) {
    public static KetQuaKiemNghiemStatsResponse from(long tongMau, long datChuan, long khongDat, long choKetQua) {
        return new KetQuaKiemNghiemStatsResponse(tongMau, datChuan, khongDat, choKetQua);
    }
}
