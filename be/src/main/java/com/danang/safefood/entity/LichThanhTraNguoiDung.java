package com.danang.safefood.entity;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.time.LocalDateTime;

@Entity
@Table(name = "lich_thanh_tra_nguoi_dung")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@IdClass(LichThanhTraNguoiDung.LichThanhTraNguoiDungId.class)
public class LichThanhTraNguoiDung {

    @Id
    @Column(name = "maThanhTra", length = 10, nullable = false)
    private String maThanhTra;

    @Id
    @Column(name = "maNguoiThanhTra", length = 10, nullable = false)
    private String maNguoiThanhTra;

    @Column(name = "thoiGianTT")
    private LocalDateTime thoiGianTT;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "maThanhTra", insertable = false, updatable = false)
    private LichThanhTra lichThanhTra;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "maNguoiThanhTra", insertable = false, updatable = false)
    private NguoiDung nguoiDung;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LichThanhTraNguoiDungId implements Serializable {
        private String maThanhTra;
        private String maNguoiThanhTra;
    }
}