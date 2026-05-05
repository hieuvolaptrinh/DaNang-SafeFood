package com.danang.safefood.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "xu_phat")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class XuPhat {

    @Id
    @Column(name = "ma_xu_phat", length = 10, nullable = false)
    private String maXuPhat;

    @Column(name = "so_quyet_dinh", length = 50)
    private String soQuyetDinh;

    @Column(name = "muc_phat", precision = 15, scale = 2)
    private BigDecimal mucPhat;

    @Column(name = "ly_do_xu_phat", columnDefinition = "TEXT")
    private String lyDoXuPhat;

    @Enumerated(EnumType.STRING)
    @Column(name = "trang_thai", length = 30, nullable = false)
    @Builder.Default
    private TrangThaiXuPhat trangThai = TrangThaiXuPhat.CHO_NOP;

    @Column(name = "ngay_xu_phat", nullable = false)
    private LocalDate ngayXuPhat;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ma_co_so")
    private CoSoKinhDoanh coSoKinhDoanh;

    /** Lãnh đạo ký quyết định */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "nguoi_ra_quyet_dinh_id")
    private TaiKhoan nguoiRaQuyetDinh;

    @Column(name = "created_by", length = 100)
    private String createdBy;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @PrePersist
    void prePersist() {
        var now = Instant.now();
        this.createdAt = now;
        this.updatedAt = now;
    }

    @PreUpdate
    void preUpdate() {
        this.updatedAt = Instant.now();
    }
}
