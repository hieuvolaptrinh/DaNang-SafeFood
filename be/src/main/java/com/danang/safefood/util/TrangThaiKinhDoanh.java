package com.danang.safefood.util;

/**
 * Trạng thái kinh doanh của một cơ sở.
 *
 * Lưu DB dạng String (enum name). Khi serialize JSON,
 * gọi {@link #label()} để trả label tiếng Việt cho mobile/web.
 */
public enum TrangThaiKinhDoanh {
    DANG_HOAT_DONG("Đang hoạt động"),
    DANG_DOI_PHE_DUYET("Đang đợi phê duyệt kinh doanh"),
    THIEU_HO_SO("Thiếu hồ sơ"),
    CANH_CAO_VI_PHAM("Cảnh cáo vi phạm"),
    BI_CAM("Bị cấm");

    private final String label;

    TrangThaiKinhDoanh(String label) {
        this.label = label;
    }

    public String label() {
        return label;
    }
}
