package com.danang.safefood.dto.response;

import com.danang.safefood.entity.CoSoKinhDoanh;
import com.danang.safefood.entity.KhieuNai;
import com.danang.safefood.entity.NguoiDung;
import com.danang.safefood.entity.TaiKhoan;

import java.time.LocalDateTime;

public record KhieuNaiSummaryResponse(
        String id,
        String title,
        String submitter,
        String submitterPhone,
        LocalDateTime submittedAt,
        String status,
        String statusLabel,
        String facilityId,
        String facilityName
) {
    public static KhieuNaiSummaryResponse from(KhieuNai entity) {
        String statusLabel = entity.getTrangThai();
        CoSoKinhDoanh coSo = entity.getCoSoKinhDoanh();
        NguoiDung chuSoHuu = coSo != null ? coSo.getChuSoHuu() : null;
        TaiKhoan taiKhoan = chuSoHuu != null ? chuSoHuu.getTaiKhoan() : null;

        return new KhieuNaiSummaryResponse(
                entity.getMaKhieuNai(),
                entity.getTieuDe(),
                chuSoHuu != null ? chuSoHuu.getHoTen() : null,
                taiKhoan != null ? taiKhoan.getPhone() : null,
                entity.getThoiGianKhieuNai(),
                KhieuNaiStatusMapper.toCode(statusLabel),
                statusLabel,
                coSo != null ? coSo.getMaCoSo() : null,
                coSo != null ? coSo.getTenCoSo() : null
        );
    }
}
