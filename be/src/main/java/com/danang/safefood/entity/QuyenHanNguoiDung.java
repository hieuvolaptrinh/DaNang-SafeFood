package com.danang.safefood.entity;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;

@Entity
@Table(name = "QuyenHan_NguoiDung")
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
    @Column(name = "maNguoiDung", length = 10, nullable = false)
    private String maNguoiDung;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "maQuyenHan", insertable = false, updatable = false)
    private QuyenHan quyenHan;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "maNguoiDung", insertable = false, updatable = false)
    private NguoiDung nguoiDung;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class QuyenHanNguoiDungId implements Serializable {
        private String maQuyenHan;
        private String maNguoiDung;
    }
}
