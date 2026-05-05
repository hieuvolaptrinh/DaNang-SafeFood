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
    @Column(name = "maQuyenHan", length = 20, nullable = false)
    private String maQuyenHan;

    @Id
    @Column(name = "tai_khoan_id")
    private Long taiKhoanId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "maQuyenHan", insertable = false, updatable = false)
    private QuyenHan quyenHan;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tai_khoan_id", insertable = false, updatable = false)
    private TaiKhoan taiKhoan;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class QuyenHanNguoiDungId implements Serializable {
        private String maQuyenHan;
        private Long taiKhoanId;
    }
}
