package com.danang.safefood.dto.request;

import java.time.LocalDate;

public record CoSoKinhDoanhDangKyRequest(
        String tenCoSo,
        String soGiayPhep,
        LocalDate ngayHetHanGiayPhep,
        String trangThai,
        String maPX
) {}
