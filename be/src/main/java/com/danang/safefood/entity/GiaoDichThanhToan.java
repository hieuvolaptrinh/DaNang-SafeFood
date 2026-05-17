package com.danang.safefood.entity;

import com.danang.safefood.util.TrangThaiThanhToan;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;

/**
 * Lưu giao dịch thanh toán xử phạt qua PayOS.
 */
@Entity
@Table(name = "giao_dich_thanh_toan", indexes = {
        @Index(name = "idx_gdtt_order_code", columnList = "orderCode", unique = true)
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GiaoDichThanhToan {

    @Id
    @Column(name = "maGiaoDich", length = 20, nullable = false)
    private String maGiaoDich;

    /** Mã đơn hàng dạng số (yêu cầu của PayOS, unique) */
    @Column(name = "orderCode", nullable = false, unique = true)
    private Long orderCode;

    @Column(name = "soTien", precision = 15, scale = 2, nullable = false)
    private BigDecimal soTien;

    @Column(name = "moTa", length = 255)
    private String moTa;

    /** URL ảnh QR / payload QR text từ PayOS */
    @Column(name = "qrCode", columnDefinition = "TEXT")
    private String qrCode;

    /** URL trang checkout của PayOS */
    @Column(name = "checkoutUrl", columnDefinition = "TEXT")
    private String checkoutUrl;

    /** Thông tin tài khoản nhận: ngân hàng / số tài khoản / chủ tài khoản */
    @Column(name = "bankName", length = 100)
    private String bankName;

    @Column(name = "accountNumber", length = 50)
    private String accountNumber;

    @Column(name = "accountName", length = 200)
    private String accountName;

    @Enumerated(EnumType.STRING)
    @Column(name = "trangThai", length = 20, nullable = false)
    @Builder.Default
    private TrangThaiThanhToan trangThai = TrangThaiThanhToan.PENDING;

    /** Mã giao dịch nhận được từ PayOS khi thanh toán thành công */
    @Column(name = "payOSTransId", length = 100)
    private String payOSTransId;

    /** Quan hệ với XuPhat (1 xử phạt có thể có nhiều giao dịch) */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "maXuPhat")
    private XuPhat xuPhat;

    /** Người tạo giao dịch (CSKD nộp phạt) */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "maNguoiDung")
    private NguoiDung nguoiDung;

    @Column(name = "createdAt", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "paidAt")
    private Instant paidAt;

    @Column(name = "expiresAt")
    private Instant expiresAt;

    @PrePersist
    void prePersist() {
        if (createdAt == null) createdAt = Instant.now();
    }
}
