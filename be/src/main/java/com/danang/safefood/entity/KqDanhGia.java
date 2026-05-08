package com.danang.safefood.entity;
import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;

@Entity
@Table(name = "kq_danh_gia")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@IdClass(KqDanhGia.KqDanhGiaId.class)
public class KqDanhGia {

    @Id
    @Column(name = "maHoSo", length = 10, nullable = false)
    private String maHoSo;

    @Id
    @Column(name = "MaTieuChi", length = 10, nullable = false)
    private String maTieuChi;

    @Column(name = "KetQuaDanhGia", columnDefinition = "TEXT")
    private String ketQuaDanhGia;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "maHoSo", insertable = false, updatable = false)
    private HoSoThanhTra hoSoThanhTra;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "MaTieuChi", insertable = false, updatable = false)
    private TieuChiDanhGia tieuChiDanhGia;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class KqDanhGiaId implements Serializable {
        private String maHoSo;
        private String maTieuChi;
    }
}
