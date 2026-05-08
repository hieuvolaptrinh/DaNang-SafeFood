package com.danang.safefood.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "quy_dinh")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuyDinh {

    @Id
    @Column(name = "ma_quy_dinh", length = 10, nullable = false)
    private String maQuyDinh;

    @Column(name = "tieu_de", length = 200, nullable = false)
    private String tieuDe;

    @Column(name = "noi_dung", columnDefinition = "TEXT")
    private String noiDung;

    @Enumerated(EnumType.STRING)
    @Column(name = "loai", length = 30, nullable = false)
    private LoaiQuyDinh loai;

    @Enumerated(EnumType.STRING)
    @Column(name = "trang_thai", length = 30, nullable = false)
    @Builder.Default
    private TrangThaiQuyDinh trangThai = TrangThaiQuyDinh.NHAP;

    @Column(name = "ngay_ban_hanh", nullable = false)
    private LocalDate ngayBanHanh;

    /** Tài khoản lãnh đạo ban hành */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "nguoi_ban_hanh_id")
    private TaiKhoan nguoiBanHanh;

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
