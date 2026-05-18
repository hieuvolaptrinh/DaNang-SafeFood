package com.danang.safefood.util;

public final class NhiemVuStatus {

    public static final String CHUA_NHAN = "Chưa nhận";
    public static final String DA_NHAN = "Đã nhận";
    public static final String DANG_THUC_HIEN = "Đang thực hiện";
    public static final String HOAN_THANH = "Hoàn thành";

    private NhiemVuStatus() {
    }

    public static int getPriority(String trangThai) {
        if (trangThai == null || trangThai.isBlank()) {
            return Integer.MAX_VALUE;
        }

        return switch (trangThai.trim().toLowerCase()) {
            case "chưa nhận" -> 0;
            case "đã nhận" -> 1;
            case "đang thực hiện" -> 2;
            case "hoàn thành" -> 3;
            default -> Integer.MAX_VALUE;
        };
    }
}