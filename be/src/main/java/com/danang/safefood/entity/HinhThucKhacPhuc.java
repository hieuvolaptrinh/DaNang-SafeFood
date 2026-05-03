package com.danang.safefood.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "HinhThucKhacPhuc")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HinhThucKhacPhuc {

    @Id
    @Column(name = "maHinhThucKhacPhuc", length = 10, nullable = false)
    private String maHinhThucKhacPhuc;

    // CHECK: soTienKhacPhuc >= 0 enforced at DB level
    @Column(name = "soTienKhacPhuc", nullable = false, precision = 18, scale = 2)
    private BigDecimal soTienKhacPhuc;

    @Column(name = "tinhTrangKhacPhuc", length = 50)
    private String tinhTrangKhacPhuc;
}
