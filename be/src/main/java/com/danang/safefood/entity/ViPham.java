package com.danang.safefood.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "ViPham")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ViPham {

    @Id
    @Column(name = "maViPham", length = 10, nullable = false)
    private String maViPham;

    @Column(name = "moTaThem", columnDefinition = "TEXT")
    private String moTaThem;

    @Column(name = "khacPhuc", columnDefinition = "TEXT")
    private String khacPhuc;

    // CHECK: IN ('Chờ duyệt','Đã duyệt','Từ chối','Đã ghi nhận') enforced at DB level
    @Column(name = "trangThaiPheDuyet", length = 30, nullable = false)
    private String trangThaiPheDuyet;

    @Column(name = "mucDo", length = 30, nullable = false)
    @Builder.Default
    private String mucDo = "Trung binh";

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "maHoSo", nullable = false)
    private HoSoThanhTra hoSoThanhTra;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "maLoaiViPham", nullable = false)
    private LoaiViPham loaiViPham;
}
