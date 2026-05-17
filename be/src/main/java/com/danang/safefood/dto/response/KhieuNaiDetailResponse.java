package com.danang.safefood.dto.response;

import com.danang.safefood.entity.FileDinhKem;
import com.danang.safefood.entity.KhieuNai;

import java.time.LocalDateTime;
import java.util.List;

public record KhieuNaiDetailResponse(
        String id,
        String title,
        String content,
        String status,
        String statusLabel,
        LocalDateTime submittedAt,
        String facilityId,
        String facilityName,
        KhieuNaiSubmitterResponse submitterInfo,
        List<KhieuNaiEvidenceResponse> evidence,
        String inspectionSummary,
        boolean inspectionCompleted,
        String handlingResult
) {
    public static KhieuNaiDetailResponse from(KhieuNai entity, List<FileDinhKem> files) {
        List<KhieuNaiEvidenceResponse> evidence = files.stream()
                .map(KhieuNaiEvidenceResponse::from)
                .toList();

        String inspectionSummary = entity.getTomTatKiemTra();

        return new KhieuNaiDetailResponse(
                entity.getMaKhieuNai(),
                entity.getTieuDe(),
                entity.getMoTaChiTiet(),
                KhieuNaiStatusMapper.toCode(entity.getTrangThai()),
                entity.getTrangThai(),
                entity.getThoiGianKhieuNai(),
                entity.getCoSoKinhDoanh() != null ? entity.getCoSoKinhDoanh().getMaCoSo() : null,
                entity.getCoSoKinhDoanh() != null ? entity.getCoSoKinhDoanh().getTenCoSo() : null,
                KhieuNaiSubmitterResponse.from(entity),
                evidence,
                inspectionSummary,
                inspectionSummary != null && !inspectionSummary.isBlank(),
                entity.getKetQuaXuLy()
        );
    }
}
