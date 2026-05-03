package com.danang.safefood.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tieuChiDanhGia")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TieuChiDanhGia {

    @Id
    @Column(name = "MaTieuChi", length = 10, nullable = false)
    private String maTieuChi;

    @Column(name = "TenTieuChi", length = 200)
    private String tenTieuChi;

    @Column(name = "Nhom", length = 100)
    private String nhom;

    @Column(name = "ThuTu")
    private Integer thuTu;
}