package com.danang.safefood.entity;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;

@Entity
@Table(name = "ThongBao_NguoiDung")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@IdClass(ThongBaoNguoiDung.ThongBaoNguoiDungId.class)
public class ThongBaoNguoiDung {

    @Id
    @Column(name = "maNguoiDung", length = 10, nullable = false)
    private String maNguoiDung;

    @Id
    @Column(name = "maThongBao", length = 10, nullable = false)
    private String maThongBao;

    @Column(name = "trangThai", length = 30)
    private String trangThai;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "maNguoiDung", insertable = false, updatable = false)
    private NguoiDung nguoiDung;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "maThongBao", insertable = false, updatable = false)
    private ThongBao thongBao;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ThongBaoNguoiDungId implements Serializable {
        private String maNguoiDung;
        private String maThongBao;
    }
}

