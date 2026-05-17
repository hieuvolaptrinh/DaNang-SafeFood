package com.danang.safefood.dto.response;

import com.danang.safefood.entity.FileDinhKem;

public record KhieuNaiEvidenceResponse(
        String id,
        String label,
        String kind,
        String note,
        String url
) {
    public static KhieuNaiEvidenceResponse from(FileDinhKem entity) {
        String fileType = entity.getLoaiFile() == null ? "" : entity.getLoaiFile().toLowerCase();
        String kind = fileType.startsWith("image") ? "image" : "file";
        String label = entity.getUrlFile();

        if (label == null || label.isBlank()) {
            label = entity.getMaFile();
        }

        String note = kind.equals("image")
                ? "Ảnh đính kèm của khiếu nại"
                : "Tệp đính kèm của khiếu nại";

        return new KhieuNaiEvidenceResponse(
                entity.getMaFile(),
                label,
                kind,
                note,
                entity.getUrlFile()
        );
    }
}
