package com.danang.safefood.dto.response;

import java.util.Map;

public record ThongKeViPhamResponse(
        long tongViPham,
        Map<String, Long> theoMucDo,       // mucDo → count
        Map<String, Long> theoKhuVuc,      // maPX  → count
        Map<String, Long> theoLoai         // loaiViPham → count
) {}
