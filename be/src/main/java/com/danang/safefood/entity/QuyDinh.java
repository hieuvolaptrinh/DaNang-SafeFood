package com.danang.safefood.entity;

import com.danang.safefood.util.LoaiQuyDinh;
import com.danang.safefood.util.TrangThaiQuyDinh;
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
    @Column(name = "maQuyDinh", length = 10, nullable = false)
    private String maQuyDinh;

    @Column(name = "tieuDe", length = 200, nullable = false)
    private String tieuDe;

    @Column(name = "noiDung", columnDefinition = "TEXT")
    private String noiDung;

    @Enumerated(EnumType.STRING)
    @Column(name = "loai", length = 30, nullable = false)
    private LoaiQuyDinh loai;

    @Enumerated(EnumType.STRING)
    @Column(name = "trangThai", length = 30, nullable = false)
    @Builder.Default
    private TrangThaiQuyDinh trangThai = TrangThaiQuyDinh.NHAP;

    @Column(name = "ngayBanHanh", nullable = false)
    private LocalDate ngayBanHanh;

    /** Tài khoản lãnh đạo ban hành */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "nguoiBanHanhId")
    private TaiKhoan nguoiBanHanh;

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
