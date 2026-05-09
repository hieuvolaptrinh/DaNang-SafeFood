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
    @Column(name = "maXuPhat", length = 10, nullable = false)
    private String maXuPhat;

    @Column(name = "soQuyetDinh", length = 50)
    private String soQuyetDinh;

    @Column(name = "mucPhat", precision = 15, scale = 2)
    private BigDecimal mucPhat;

    @Column(name = "lyDoXuPhat", columnDefinition = "TEXT")
    private String lyDoXuPhat;

    @Enumerated(EnumType.STRING)
    @Column(name = "trangThai", length = 30, nullable = false)
    @Builder.Default
    private TrangThaiXuPhat trangThai = TrangThaiXuPhat.CHO_NOP;

    @Column(name = "ngayXuPhat", nullable = false)
    private LocalDate ngayXuPhat;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "maCoSo")
    private CoSoKinhDoanh coSoKinhDoanh;

    /** Lãnh đạo ký quyết định */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "nguoiRaQuyetDinhId")
    private TaiKhoan nguoiRaQuyetDinh;

    @Column(name = "createdBy", length = 100)
    private String createdBy;

    @Column(name = "createdAt", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updatedAt", nullable = false)
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
