package com.danang.safefood.entity;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "dam_nhan_kiem_nghiem")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(of = "id")
@ToString(exclude = {"nguoiKiemNghiem", "mauKiemNghiem"})
public class DamNhanKiemNghiem {

    @EmbeddedId
    private DamNhanKiemNghiemId id;

    @MapsId("maNguoiKiemNghiem")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "maNguoiKiemNghiem", nullable = false)
    private NguoiDung nguoiKiemNghiem;

    @MapsId("maMau")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "maMau", nullable = false)
    private MauKiemNghiem mauKiemNghiem;
}
