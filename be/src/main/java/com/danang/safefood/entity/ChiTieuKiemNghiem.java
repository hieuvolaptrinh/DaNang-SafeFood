package com.danang.safefood.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "chi_tieu_kiem_nghiem",
        uniqueConstraints = {
                @UniqueConstraint(name = "UQ_ChiTieuKiemNghiem_Ten", columnNames = "tenChiTieu")
        }
)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChiTieuKiemNghiem {

    @Id
    @Column(name = "maChiTieu", length = 10, nullable = false)
    private String maChiTieu;

    @Column(name = "tenChiTieu", length = 200, nullable = false, unique = true)
    private String tenChiTieu;
}

