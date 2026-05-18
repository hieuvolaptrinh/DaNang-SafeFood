package com.danang.safefood.entity;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;

@Entity
@Table(name = "mau_chi_tieu")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@IdClass(MauChiTieu.MauChiTieuId.class)
public class MauChiTieu {

    @Id
    @Column(name = "maMau", length = 10, nullable = false)
    private String maMau;

    @Id
    @Column(name = "maChiTieu", length = 10, nullable = false)
    private String maChiTieu;

    @Column(name = "giaTriDo", columnDefinition = "TEXT")
    private String giaTriDo;

    @Column(name = "gioiHanChoPhep", columnDefinition = "TEXT")
    private String gioiHanChoPhep;

    @Column(name = "ketQua", columnDefinition = "TEXT")
    private String ketQua;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "maMau", insertable = false, updatable = false)
    private MauKiemNghiem mauKiemNghiem;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "maChiTieu", insertable = false, updatable = false)
    private ChiTieuKiemNghiem chiTieuKiemNghiem;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MauChiTieuId implements Serializable {
        private String maMau;
        private String maChiTieu;
    }
}
