package com.danang.safefood.util;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

/**
 * Converter chuyển đổi giữa enum {@link TrangThaiKhacPhuc} và String trong DB.
 *
 * Tương thích ngược: chấp nhận giá trị String cũ trong DB
 * ("Chua khac phuc", "Da khac phuc", "Dang khac phuc"...) cũng như enum mới.
 */
@Converter(autoApply = false)
public class TrangThaiKhacPhucConverter implements AttributeConverter<TrangThaiKhacPhuc, String> {

    @Override
    public String convertToDatabaseColumn(TrangThaiKhacPhuc attr) {
        return attr == null ? TrangThaiKhacPhuc.CHUA_KHAC_PHUC.name() : attr.name();
    }

    @Override
    public TrangThaiKhacPhuc convertToEntityAttribute(String dbValue) {
        if (dbValue == null || dbValue.isBlank()) return TrangThaiKhacPhuc.CHUA_KHAC_PHUC;

        String trimmed = dbValue.trim();

        // Khớp chuẩn (enum name)
        try {
            return TrangThaiKhacPhuc.valueOf(trimmed);
        } catch (IllegalArgumentException ignored) {
            // tiếp tục mapping legacy
        }

        // Map các giá trị tiếng Việt cũ
        String lower = removeDiacritics(trimmed).toLowerCase();
        if (lower.contains("da khac phuc") || lower.contains("da hoan tat")) {
            return TrangThaiKhacPhuc.DA_KHAC_PHUC;
        }
        if (lower.contains("dang khac phuc") || lower.contains("dang xu ly")) {
            return TrangThaiKhacPhuc.DANG_KHAC_PHUC;
        }
        return TrangThaiKhacPhuc.CHUA_KHAC_PHUC;
    }

    private static String removeDiacritics(String s) {
        return java.text.Normalizer.normalize(s, java.text.Normalizer.Form.NFD)
                .replaceAll("\\p{InCombiningDiacriticalMarks}+", "")
                .replace("đ", "d").replace("Đ", "D");
    }
}
