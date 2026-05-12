package com.danang.safefood.dto.response;

import java.util.List;

public record CoSoKinhDoanhDetailResponse(
        CoSoKinhDoanhResponse coSo,
        String anhBia,
        Integer soViPham,
        List<String> loaiHinhKinhDoanh,
        List<GiayChungNhanResponse> chungNhan,
        List<GiayPhepResponse> giayPhep
) {
}
