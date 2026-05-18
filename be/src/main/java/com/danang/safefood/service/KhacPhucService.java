package com.danang.safefood.service;

import com.danang.safefood.dto.response.PaymentResponse;
import com.danang.safefood.dto.response.ViPhamResponse;
import com.danang.safefood.entity.GiaoDichThanhToan;
import com.danang.safefood.entity.HinhThucKhacPhuc;
import com.danang.safefood.entity.NguoiDung;
import com.danang.safefood.entity.ViPham;
import com.danang.safefood.repository.GiaoDichThanhToanRepository;
import com.danang.safefood.repository.HinhThucKhacPhucRepository;
import com.danang.safefood.repository.NguoiDungRepository;
import com.danang.safefood.repository.ViPhamRepository;
import com.danang.safefood.util.IdGenerator;
import com.danang.safefood.util.TrangThaiKhacPhuc;
import com.danang.safefood.util.TrangThaiThanhToan;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Optional;

/**
 * Service xử lý quy trình khắc phục vi phạm:
 *  - Tạo link thanh toán PayOS cho 1 vi phạm
 *  - Theo dõi trạng thái giao dịch
 *  - Khi PayOS webhook xác nhận PAID → đánh dấu HinhThucKhacPhuc.tinhTrangKhacPhuc = "Da khac phuc"
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class KhacPhucService {

    private final ViPhamRepository viPhamRepository;
    private final HinhThucKhacPhucRepository hinhThucKhacPhucRepository;
    private final GiaoDichThanhToanRepository giaoDichRepo;
    private final NguoiDungRepository nguoiDungRepository;
    private final PayOSService payOSService;

    @Value("${payos.webhook-url}")
    private String webhookUrl;

    /**
     * Lấy chi tiết 1 vi phạm.
     */
    @Transactional(readOnly = true)
    public ViPhamResponse getViPhamDetail(String maViPham) {
        ViPham vp = viPhamRepository.findByIdWithDetails(maViPham)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy vi phạm: " + maViPham));
        return ViPhamResponse.from(vp);
    }

    /**
     * Tạo link thanh toán PayOS cho 1 vi phạm.
     * Số tiền = tổng các HinhThucKhacPhuc CHƯA khắc phục.
     */
    @Transactional
    public PaymentResponse createPaymentForViPham(String maViPham, Long taiKhoanId, String description) {
        ViPham vp = viPhamRepository.findById(maViPham)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy vi phạm: " + maViPham));

        // Tổng tiền chưa khắc phục (tức trạng thái != DA_KHAC_PHUC)
        BigDecimal totalUnpaid = vp.getHinhThucKhacPhucList().stream()
                .filter(h -> h.getTinhTrangKhacPhuc() != TrangThaiKhacPhuc.DA_KHAC_PHUC)
                .map(HinhThucKhacPhuc::getSoTienKhacPhuc)
                .filter(java.util.Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        if (totalUnpaid.compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Vi phạm này đã được khắc phục đầy đủ");
        }

        long amount = totalUnpaid.longValueExact();
        long orderCode = generateOrderCode();

        NguoiDung nd = nguoiDungRepository.findByTaiKhoan_Id(taiKhoanId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        String safeDesc = (description == null || description.isBlank())
                ? ("VP" + maViPham)
                : description;

        var result = payOSService.createPaymentLink(
                orderCode,
                amount,
                safeDesc,
                nd.getHoTen(),
                getEmail(nd),
                getPhone(nd),
                webhookUrl);

        GiaoDichThanhToan gd = GiaoDichThanhToan.builder()
                .maGiaoDich(IdGenerator.generate("GD"))
                .orderCode(result.orderCode())
                .soTien(result.amount() != null ? result.amount() : BigDecimal.valueOf(amount))
                .moTa(safeDesc)
                .qrCode(result.qrCode())
                .checkoutUrl(result.checkoutUrl())
                .bankName(result.bin())
                .accountNumber(result.accountNumber())
                .accountName(result.accountName())
                .trangThai(TrangThaiThanhToan.PENDING)
                .xuPhat(null) // hệ thống hiện tại lưu phạt qua HinhThucKhacPhuc của ViPham
                .nguoiDung(nd)
                .expiresAt(result.expiredAt() != null
                        ? Instant.ofEpochSecond(result.expiredAt())
                        : null)
                .build();

        // Tham chiếu ViPham qua mã lưu trong description (để webhook tra cứu lại)
        gd = giaoDichRepo.save(gd);

        // Đánh dấu các hình thức chưa khắc phục → đang khắc phục
        markStatus(maViPham, TrangThaiKhacPhuc.CHUA_KHAC_PHUC, TrangThaiKhacPhuc.DANG_KHAC_PHUC);

        return PaymentResponse.from(gd);
    }

    /**
     * Lấy chi tiết 1 giao dịch theo mã.
     */
    @Transactional(readOnly = true)
    public PaymentResponse getPaymentByOrderCode(Long orderCode) {
        GiaoDichThanhToan gd = giaoDichRepo.findByOrderCode(orderCode)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy giao dịch: " + orderCode));
        return PaymentResponse.from(gd);
    }

    /**
     * Mobile gọi để check trạng thái giao dịch (poll).
     * Nếu PayOS đã PAID nhưng webhook chưa về → tự sync lại.
     */
    @Transactional
    public PaymentResponse syncPaymentStatus(Long orderCode) {
        GiaoDichThanhToan gd = giaoDichRepo.findByOrderCode(orderCode)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy giao dịch: " + orderCode));

        if (gd.getTrangThai() == TrangThaiThanhToan.PAID) {
            return PaymentResponse.from(gd);
        }

        try {
            JsonNode info = payOSService.getPaymentInfo(orderCode);
            String status = info.path("data").path("status").asText("");
            switch (status) {
                case "PAID" -> {
                    markPaid(gd, info.path("data").path("id").asText(null));
                }
                case "CANCELLED" -> {
                    gd.setTrangThai(TrangThaiThanhToan.CANCELLED);
                    giaoDichRepo.save(gd);
                    revertDangKhacPhuc(gd);
                }
                case "EXPIRED" -> {
                    gd.setTrangThai(TrangThaiThanhToan.EXPIRED);
                    giaoDichRepo.save(gd);
                    revertDangKhacPhuc(gd);
                }
                default -> { /* keep PENDING */ }
            }
        } catch (Exception e) {
            log.warn("[KhacPhuc] sync status fail for orderCode={}", orderCode, e);
        }

        return PaymentResponse.from(gd);
    }

    /**
     * Webhook PayOS gọi khi giao dịch hoàn tất.
     * Xác thực signature → cập nhật trạng thái giao dịch → đánh dấu khắc phục đã thanh toán.
     */
    @Transactional
    public void handleWebhook(JsonNode payload) {
        if (!payOSService.verifyWebhookSignature(payload)) {
            log.warn("[Webhook PayOS] signature không hợp lệ");
            throw new RuntimeException("Invalid signature");
        }

        JsonNode data = payload.path("data");
        long orderCode = data.path("orderCode").asLong();
        String code = payload.path("code").asText();

        Optional<GiaoDichThanhToan> opt = giaoDichRepo.findByOrderCode(orderCode);
        if (opt.isEmpty()) {
            log.warn("[Webhook PayOS] không tìm thấy giao dịch orderCode={}", orderCode);
            return;
        }

        GiaoDichThanhToan gd = opt.get();
        if ("00".equals(code)) {
            String txId = data.path("paymentLinkId").asText(null);
            markPaid(gd, txId);
        }
    }

    private void markPaid(GiaoDichThanhToan gd, String txId) {
        if (gd.getTrangThai() == TrangThaiThanhToan.PAID) return;

        gd.setTrangThai(TrangThaiThanhToan.PAID);
        gd.setPayOSTransId(txId);
        gd.setPaidAt(Instant.now());
        giaoDichRepo.save(gd);

        // Tìm lại mã vi phạm từ description
        String desc = gd.getMoTa();
        if (desc != null && desc.startsWith("VP")) {
            String maVP = desc.substring(2);
            updateKhacPhucDone(maVP);
        }
        log.info("[Webhook PayOS] Đã đánh dấu giao dịch PAID orderCode={}", gd.getOrderCode());
    }

    /**
     * Đánh dấu mọi HinhThucKhacPhuc của ViPham là DA_KHAC_PHUC
     */
    private void updateKhacPhucDone(String maViPham) {
        List<HinhThucKhacPhuc> list = hinhThucKhacPhucRepository.findByViPham_MaViPham(maViPham);
        for (HinhThucKhacPhuc h : list) {
            h.setTinhTrangKhacPhuc(TrangThaiKhacPhuc.DA_KHAC_PHUC);
        }
        hinhThucKhacPhucRepository.saveAll(list);
        log.info("[KhacPhuc] Đã cập nhật trạng thái Da khac phuc cho VP {}", maViPham);
    }

    /**
     * Đổi trạng thái cho các hình thức khắc phục đang ở `from` → `to`.
     */
    private void markStatus(String maViPham, TrangThaiKhacPhuc from, TrangThaiKhacPhuc to) {
        List<HinhThucKhacPhuc> list = hinhThucKhacPhucRepository.findByViPham_MaViPham(maViPham);
        boolean changed = false;
        for (HinhThucKhacPhuc h : list) {
            if (h.getTinhTrangKhacPhuc() == from) {
                h.setTinhTrangKhacPhuc(to);
                changed = true;
            }
        }
        if (changed) hinhThucKhacPhucRepository.saveAll(list);
    }

    /**
     * Khi giao dịch bị huỷ/hết hạn → revert các hình thức về CHUA_KHAC_PHUC
     */
    private void revertDangKhacPhuc(GiaoDichThanhToan gd) {
        String desc = gd.getMoTa();
        if (desc != null && desc.startsWith("VP")) {
            String maVP = desc.substring(2);
            markStatus(maVP, TrangThaiKhacPhuc.DANG_KHAC_PHUC, TrangThaiKhacPhuc.CHUA_KHAC_PHUC);
        }
    }

    /**
     * Sinh orderCode dạng số duy nhất (PayOS yêu cầu Long).
     * Dùng timestamp + random 3 chữ số.
     */
    private long generateOrderCode() {
        long ts = System.currentTimeMillis() / 1000; // 10 chữ số
        long rand = (long) (Math.random() * 1000);
        return ts * 1000 + rand;
    }

    private String getEmail(NguoiDung nd) {
        try {
            if (nd.getTaiKhoan() != null) {
                return nd.getTaiKhoan().getEmail();
            }
        } catch (Exception ignored) {
        }
        return null;
    }

    private String getPhone(NguoiDung nd) {
        try {
            if (nd.getTaiKhoan() != null) {
                return nd.getTaiKhoan().getPhone();
            }
        } catch (Exception ignored) {
        }
        return null;
    }
}
