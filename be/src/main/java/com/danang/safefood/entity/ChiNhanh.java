package com.danang.safefood.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "chi_nhanh")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChiNhanh {

    @Id
    @Column(name = "maChiNhanh", length = 10, nullable = false)
    private String maChiNhanh;

    @Column(name = "diaChi", length = 200)
    private String diaChi;

    @Column(name = "soDienThoai", length = 20)
    private String soDienThoai;

    @Column(name = "trangThai", length = 30)
    private String trangThai;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "maCoSo")
    private CoSoKinhDoanh coSoKinhDoanh;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lianThanhTraGanNhat")
    private LichThanhTra lichThanhTraGanNhat;
}

