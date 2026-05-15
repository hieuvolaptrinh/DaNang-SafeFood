package com.danang.safefood.util;

/**
 * Trạng thái khắc phục của một hình thức xử phạt.
 *
 * Lưu vào DB dạng String (CHUA_KHAC_PHUC / DANG_KHAC_PHUC / DA_KHAC_PHUC).
 * Khi serialize JSON cho mobile sẽ trả về label tiếng Việt qua method {@link #label()}.
 */
public enum TrangThaiKhacPhuc {
    CHUA_KHAC_PHUC("Chưa khắc phục"),
    DANG_KHAC_PHUC("Đang khắc phục"),
    DA_KHAC_PHUC("Đã khắc phục");

    private final String label;

    TrangThaiKhacPhuc(String label) {
        this.label = label;
    }

    public String label() {
        return label;
    }
}
