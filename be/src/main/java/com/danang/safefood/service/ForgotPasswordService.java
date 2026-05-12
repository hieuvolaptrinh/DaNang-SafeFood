package com.danang.safefood.service;

import com.danang.safefood.entity.TaiKhoan;
import com.danang.safefood.repository.TaiKhoanRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Duration;

@Service
@RequiredArgsConstructor
@Slf4j
public class ForgotPasswordService {

    private static final String OTP_PREFIX = "otp:forgot:";
    private static final Duration OTP_TTL = Duration.ofMinutes(5);
    private static final int OTP_LENGTH = 6;

    private final RedisService redisService;
    private final TaiKhoanRepository taiKhoanRepository;
    private final MailService mailService;
    private final PasswordEncoder passwordEncoder;

    /**
     * Gửi OTP qua email.
     * Trả về email đã gửi (để FE hiển thị).
     */
    public String sendOtp(String email) {
        // 1. Kiểm tra email có tồn tại không
        taiKhoanRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Email không tồn tại trong hệ thống."));

        // 2. Tạo mã OTP 6 số
        String otp = generateOtp();

        // 3. Lưu vào Redis với TTL 5 phút
        redisService.set(OTP_PREFIX + email, otp, OTP_TTL);
        log.info("OTP stored for email: {}, TTL: {}s", email, OTP_TTL.getSeconds());

        // 4. Gửi mail
        mailService.sendOtpEmail(email, otp);

        return email;
    }

    /**
     * Xác thực OTP và đặt lại mật khẩu.
     */
    public void verifyOtpAndResetPassword(String email, String otp, String newPassword) {
        String redisKey = OTP_PREFIX + email;

        // 1. Lấy OTP từ Redis
        String storedOtp = redisService.get(redisKey)
                .orElseThrow(() -> new IllegalArgumentException("Mã OTP đã hết hạn. Vui lòng gửi lại."));

        if (!storedOtp.equals(otp)) {
            throw new IllegalArgumentException("Mã OTP không chính xác.");
        }

        // 2. Tìm tài khoản và đổi mật khẩu
        TaiKhoan taiKhoan = taiKhoanRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Email không tồn tại trong hệ thống."));

        taiKhoan.setPassword(passwordEncoder.encode(newPassword));
        taiKhoanRepository.save(taiKhoan);

        // 3. Xóa OTP khỏi Redis sau khi dùng thành công
        redisService.delete(redisKey);
        log.info("Password reset successfully for email: {}", email);
    }

    private String generateOtp() {
        SecureRandom random = new SecureRandom();
        StringBuilder sb = new StringBuilder(OTP_LENGTH);
        for (int i = 0; i < OTP_LENGTH; i++) {
            sb.append(random.nextInt(10));
        }
        return sb.toString();
    }
}
