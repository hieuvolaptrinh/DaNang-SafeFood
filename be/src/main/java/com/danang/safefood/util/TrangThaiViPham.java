package com.danang.safefood.util;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

import java.util.Arrays;

public enum TrangThaiViPham {
    DA_DUYET("Đã Duyệt"),
    HUY_BO("Hủy Bỏ"),
    CHO_DUYET("Chờ Duyệt");

    private final String label;

    TrangThaiViPham(String label) {
        this.label = label;
    }

    @JsonValue
    public String getLabel() {
        return label;
    }

    @JsonCreator
    public static TrangThaiViPham fromValue(String value) {
        if (value == null) {
            return null;
        }
        return Arrays.stream(values())
                .filter(v -> v.label.equalsIgnoreCase(value) || v.name().equalsIgnoreCase(value))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Unknown trangThaiViPham: " + value));
    }
}
