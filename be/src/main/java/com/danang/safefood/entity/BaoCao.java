package com.danang.safefood.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "bao_cao")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BaoCao {

    @Id
    @Column(name = "maBaoCao", length = 10, nullable = false)
    private String maBaoCao;

    @Column(name = "NoiDung", columnDefinition = "TEXT")
    private String noiDung;

    @Column(name = "nhanXet", columnDefinition = "TEXT")
    private String nhanXet;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "maHoSo")
    private HoSoThanhTra hoSoThanhTra;
}