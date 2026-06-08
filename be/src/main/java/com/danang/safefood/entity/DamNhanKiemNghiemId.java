package com.danang.safefood.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DamNhanKiemNghiemId implements Serializable {

    @Column(name = "maNguoiKiemNghiem", length = 10, nullable = false)
    private String maNguoiKiemNghiem;

    @Column(name = "maMau", length = 10, nullable = false)
    private String maMau;
}
