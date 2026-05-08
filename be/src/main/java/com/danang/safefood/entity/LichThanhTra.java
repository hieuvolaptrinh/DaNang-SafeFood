package com.danang.safefood.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "lich_thanh_tra")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LichThanhTra {

    @Id
    @Column(name = "maThanhTra", length = 10, nullable = false)
    private String maThanhTra;

    @Column(name = "trangThai", length = 30)
    private String trangThai;

    @Column(name = "noiDung", columnDefinition = "TEXT")
    private String noiDung;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "maCoSo")
    private CoSoKinhDoanh coSoKinhDoanh;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "maNguoiThanhTra")
    private NguoiDung nguoiPhuTrach;
}
