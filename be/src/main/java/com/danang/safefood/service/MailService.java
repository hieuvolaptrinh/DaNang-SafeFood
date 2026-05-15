package com.danang.safefood.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

@Service
@RequiredArgsConstructor
@Slf4j
public class MailService {

    private final JavaMailSender mailSender;

    /**
     * Gửi mail OTP đặt lại mật khẩu.
     *
     * @param toEmail email người nhận
     * @param otpCode mã OTP 6 chữ số
     */
    public void sendOtpEmail(String toEmail, String otpCode) {
        try {
            String htmlTemplate = loadTemplate();
            String htmlContent = htmlTemplate.replace("{{OTP_CODE}}", otpCode);

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(toEmail);
            helper.setSubject("🔒 Mã OTP đặt lại mật khẩu - Đà Nẵng SafeFood");
            helper.setText(htmlContent, true);

            mailSender.send(message);
            log.info("OTP email sent successfully to {}", toEmail);
        } catch (MessagingException e) {
            log.error("Failed to send OTP email to {}: {}", toEmail, e.getMessage());
            throw new RuntimeException("Không thể gửi email. Vui lòng thử lại sau.");
        }
    }

    /**
     * Gửi mail OTP xác nhận đăng ký.
     *
     * @param toEmail email người nhận
     * @param otpCode mã OTP 6 chữ số
     */
    public void sendRegisterOtpEmail(String toEmail, String otpCode) {
        try {
            String htmlTemplate = loadTemplate();
            String htmlContent = htmlTemplate.replace("{{OTP_CODE}}", otpCode);

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(toEmail);
            helper.setSubject("✅ Mã OTP xác nhận đăng ký - Đà Nẵng SafeFood");
            helper.setText(htmlContent, true);

            mailSender.send(message);
            log.info("Register OTP email sent successfully to {}", toEmail);
        } catch (MessagingException e) {
            log.error("Failed to send register OTP email to {}: {}", toEmail, e.getMessage());
            throw new RuntimeException("Không thể gửi email. Vui lòng thử lại sau.");
        }
    }

    private String loadTemplate() {
        try {
            ClassPathResource resource = new ClassPathResource("mail.html");
            return new String(resource.getInputStream().readAllBytes(), StandardCharsets.UTF_8);
        } catch (IOException e) {
            log.error("Failed to load mail template: {}", e.getMessage());
            throw new RuntimeException("Lỗi hệ thống: không tìm thấy template email.");
        }
    }
}
