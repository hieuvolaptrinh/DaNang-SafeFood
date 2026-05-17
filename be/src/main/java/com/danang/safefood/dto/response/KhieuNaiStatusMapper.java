package com.danang.safefood.dto.response;

public final class KhieuNaiStatusMapper {

    private KhieuNaiStatusMapper() {
    }

    public static String toCode(String statusLabel) {
        if (statusLabel == null || statusLabel.isBlank()) {
            return "pending";
        }

        String normalized = normalize(statusLabel);
        return switch (normalized) {
            case "dang xu ly", "processing" -> "processing";
            case "da xu ly", "da giai quyet", "resolved" -> "resolved";
            default -> "pending";
        };
    }

    public static String toLabel(String value) {
        if (value == null || value.isBlank()) {
            return "Chưa xử lý";
        }

        String normalized = normalize(value);
        return switch (normalized) {
            case "processing", "dang xu ly" -> "Đang xử lý";
            case "resolved", "da xu ly", "da giai quyet" -> "Đã xử lý";
            case "pending", "chua xu ly" -> "Chưa xử lý";
            default -> throw new IllegalArgumentException("Trạng thái khiếu nại không hợp lệ: " + value);
        };
    }

    private static String normalize(String value) {
        String normalized = java.text.Normalizer.normalize(value.trim(), java.text.Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "");
        return normalized.toLowerCase();
    }
}
