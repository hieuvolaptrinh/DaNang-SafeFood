package com.danang.safefood.dto.response;

import com.danang.safefood.entity.PhanAnh;

import java.time.LocalDateTime;
import java.util.List;

public record PhanAnhUserResponse(
        String maPhanAnh,
        String trangThaiPhanAnh,
        String tieuDe,
        String noiDung,
        String diaDiem,
        LocalDateTime ngayGui,
        String maLoaiPhanAnh,
        String tenLoaiPhanAnh,
        String maCoSo,
        String tenCoSo,
        List<String> fileUrls) {
    public static PhanAnhUserResponse from(PhanAnh entity, List<String> fileUrls) {
        return new PhanAnhUserResponse(
                entity.getMaPhanAnh(),
                entity.getTrangThaiPhanAnh(),
                entity.getTieuDe(),
                entity.getLyDo(),
                entity.getDiaDiem(),
                entity.getNgayGui(),
                entity.getLoaiPhanAnh() != null ? entity.getLoaiPhanAnh().getMaLoaiPhanAnh() : null,
                entity.getLoaiPhanAnh() != null ? entity.getLoaiPhanAnh().getTenLoaiPhanAnh() : null,
                entity.getCoSoKinhDoanh() != null ? entity.getCoSoKinhDoanh().getMaCoSo() : null,
                entity.getCoSoKinhDoanh() != null ? entity.getCoSoKinhDoanh().getTenCoSo() : null,
                fileUrls);
    }
}
