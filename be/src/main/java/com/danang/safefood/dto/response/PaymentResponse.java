package com.danang.safefood.dto.response;

import com.danang.safefood.entity.GiaoDichThanhToan;
import com.danang.safefood.util.TrangThaiThanhToan;

import java.math.BigDecimal;
import java.time.Instant;

/**
 * Response trả về cho mobile khi tạo / xem giao dịch thanh toán.
 * Mobile dùng `qrCode` để render QR (vẽ qrcode từ string), hoặc `checkoutUrl`
 * để mở web view PayOS.
 */
public record PaymentResponse(
        String maGiaoDich,
        Long orderCode,
        BigDecimal soTien,
        String moTa,
        String qrCode,
        String checkoutUrl,
        String bankName,
        String accountNumber,
        String accountName,
        TrangThaiThanhToan trangThai,
        String maXuPhat,
        Instant createdAt,
        Instant paidAt,
        Instant expiresAt) {

    public static PaymentResponse from(GiaoDichThanhToan e) {
        return new PaymentResponse(
                e.getMaGiaoDich(),
                e.getOrderCode(),
                e.getSoTien(),
                e.getMoTa(),
                e.getQrCode(),
                e.getCheckoutUrl(),
                e.getBankName(),
                e.getAccountNumber(),
                e.getAccountName(),
                e.getTrangThai(),
                e.getXuPhat() != null ? e.getXuPhat().getMaXuPhat() : null,
                e.getCreatedAt(),
                e.getPaidAt(),
                e.getExpiresAt());
    }
}
