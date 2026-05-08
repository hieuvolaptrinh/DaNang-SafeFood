package com.danang.safefood.entity;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;

@Entity
@Table(name = "quyen_han_nguoi_dung")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@IdClass(QuyenHanNguoiDung.QuyenHanNguoiDungId.class)
public class QuyenHanNguoiDung {

    @Id
    @Column(name = "ma_quyen_han", length = 20, nullable = false)
    private String maQuyenHan;

    @Id
    @Column(name = "tai_khoan_id", nullable = false)
    private Long taiKhoanId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ma_quyen_han", insertable = false, updatable = false)
    private QuyenHan quyenHan;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tai_khoan_id", insertable = false, updatable = false)
    private TaiKhoan taiKhoan;

    // IdClass
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class QuyenHanNguoiDungId implements Serializable {
        private String maQuyenHan;
        private Long taiKhoanId;
    }
}