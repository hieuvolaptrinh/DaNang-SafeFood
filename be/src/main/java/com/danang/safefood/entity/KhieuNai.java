package com.danang.safefood.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "khieu_nai")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class KhieuNai {

    @Id
    @Column(name = "maKhieuNai", length = 10, nullable = false)
    private String maKhieuNai;

    @Column(name = "trangThai", length = 30)
    private String trangThai;

    // CHECK: thoiGianKhieuNai <= GETDATE() enforced at DB level
    @Column(name = "thoiGianKhieuNai")
    private LocalDateTime thoiGianKhieuNai;

    @Column(name = "moTaChiTiet", columnDefinition = "TEXT")
    private String moTaChiTiet;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "maCoSo")
    private CoSoKinhDoanh coSoKinhDoanh;
}
