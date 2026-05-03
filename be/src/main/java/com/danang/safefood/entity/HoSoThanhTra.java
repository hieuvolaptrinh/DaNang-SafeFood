package com.danang.safefood.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "HoSoThanhTra")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HoSoThanhTra {

    @Id
    @Column(name = "maHoSo", length = 10, nullable = false)
    private String maHoSo;

    @Column(name = "diem")
    private Double diem;

    @Column(name = "tinhTrangViPham", length = 50)
    private String tinhTrangViPham;

    @Column(name = "KetLuan", columnDefinition = "TEXT")
    private String ketLuan;

    @Column(name = "NhanXetChung", columnDefinition = "TEXT")
    private String nhanXetChung;

    @Column(name = "BienPhapXuLy", columnDefinition = "TEXT")
    private String bienPhapXuLy;

    @Column(name = "KienNghi", columnDefinition = "TEXT")
    private String kienNghi;

    @Column(name = "thoiGianKiemTra")
    private LocalDateTime thoiGianKiemTra;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "maThanhTra")
    private LichThanhTra lichThanhTra;
}
