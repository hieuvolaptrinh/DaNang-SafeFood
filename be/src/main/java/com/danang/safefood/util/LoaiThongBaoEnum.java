package com.danang.safefood.util;

public enum LoaiThongBaoEnum {

    PHAP_QUY("Pháp Quy"),
    TIN_TUC("Tin Tức"),
    KHAN_CAP("Khẩn Cấp"),
    THONG_BAO("Thông báo"),
    HUONG_DAN("Hướng dẫn"),
    NGHI_DINH("Nghị định"),
    THONG_TU("Thông tư");

    private final String label;

    LoaiThongBaoEnum(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }

    // Convert từ DB string → enum
    public static LoaiThongBaoEnum fromLabel(String label) {
        for (LoaiThongBaoEnum e : values()) {
            if (e.name().equalsIgnoreCase(label)) {
                return e;
            }
        }
        throw new IllegalArgumentException("Unknown loaiThongBao: " + label);
    }
}