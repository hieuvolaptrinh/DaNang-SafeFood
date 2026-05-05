package com.danang.safefood.dto.response;

import java.util.Map;

public record ThongKeHoKinhDoanhResponse(
        long tongCoSo,
        long coSoHoatDong,
        long coSoNgungHoatDong,
        Map<String, Long> theoKhuVuc,      // maPX → count
        Map<String, Long> theoTinhTrang    // trangThai → count
) {}
