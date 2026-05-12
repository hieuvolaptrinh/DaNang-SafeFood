package com.danang.safefood.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "vi_pham")
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

    @Convert(converter = TrangThaiViPhamConverter.class)
    @Column(name = "trangThaiPheDuyet", length = 30, nullable = false)
    @Builder.Default
    private TrangThaiViPham trangThaiPheDuyet = TrangThaiViPham.CHO_DUYET;

    @Column(name = "mucDo", length = 30, nullable = false)
    @Builder.Default
    private String mucDo = "Trung binh";

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "maHoSo", nullable = false)
    private HoSoThanhTra hoSoThanhTra;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "maLoaiViPham", nullable = false)
    private LoaiViPham loaiViPham;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "maCoSo")
    private CoSoKinhDoanh coSoKinhDoanh;

    @OneToMany(mappedBy = "viPham", fetch = FetchType.LAZY)
    @Builder.Default
    private List<HinhThucKhacPhuc> hinhThucKhacPhucList = new ArrayList<>();
}
