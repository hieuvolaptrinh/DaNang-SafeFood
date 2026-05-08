package com.danang.safefood.entity;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;

@Entity
@Table(name = "dam_nhan_kiem_nghiem")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@IdClass(DamNhanKiemNghiem.DamNhanKiemNghiemId.class)
public class DamNhanKiemNghiem {

    @Id
    @Column(name = "maNguoiKiemNghiem", length = 10, nullable = false)
    private String maNguoiKiemNghiem;

    @Id
    @Column(name = "maMau", length = 10, nullable = false)
    private String maMau;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "maNguoiKiemNghiem", insertable = false, updatable = false)
    private NguoiDung nguoiKiemNghiem;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "maMau", insertable = false, updatable = false)
    private MauKiemNghiem mauKiemNghiem;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DamNhanKiemNghiemId implements Serializable {
        private String maNguoiKiemNghiem;
        private String maMau;
    }
}
