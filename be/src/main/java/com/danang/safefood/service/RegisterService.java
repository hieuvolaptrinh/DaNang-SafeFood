package com.danang.safefood.service;

import com.danang.safefood.config.security.jwt.JwtService;
import com.danang.safefood.dto.auth.AuthResponse;
import com.danang.safefood.dto.auth.UserInfoDto;
import com.danang.safefood.dto.request.RegisterVerifyRequest;
import com.danang.safefood.entity.CoSoKinhDoanh;
import com.danang.safefood.entity.NguoiDung;
import com.danang.safefood.entity.QuyenHanNguoiDung;
import com.danang.safefood.entity.RefreshToken;
import com.danang.safefood.entity.TaiKhoan;
import com.danang.safefood.repository.CoSoKinhDoanhRepository;
import com.danang.safefood.repository.NguoiDungRepository;
import com.danang.safefood.repository.QuyenHanNguoiDungRepository;
import com.danang.safefood.repository.RefreshTokenRepository;
import com.danang.safefood.repository.TaiKhoanRepository;
import com.danang.safefood.util.IdGenerator;
import com.danang.safefood.util.Role;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.Duration;

@Service
@RequiredArgsConstructor
@Slf4j
public class RegisterService {

    private static final String OTP_PREFIX = "otp:register:";
    private static final Duration OTP_TTL = Duration.ofMinutes(5);
    private static final int OTP_LENGTH = 6;

    private final RedisService redisService;
    private final MailService mailService;
    private final TaiKhoanRepository taiKhoanRepository;
    private final NguoiDungRepository nguoiDungRepository;
    private final CoSoKinhDoanhRepository coSoKinhDoanhRepository;
    private final QuyenHanNguoiDungRepository quyenHanNguoiDungRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final UserDetailsService userDetailsService;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    public String sendOtp(String email) {
        if (taiKhoanRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email đã tồn tại trong hệ thống.");
        }

        String otp = generateOtp();
        redisService.set(OTP_PREFIX + email, otp, OTP_TTL);
        log.info("Register OTP stored for email: {}, TTL: {}s", email, OTP_TTL.getSeconds());

        mailService.sendRegisterOtpEmail(email, otp);
        return email;
    }

    @Transactional
    public AuthResponse verifyOtpAndRegister(RegisterVerifyRequest request) {
        String email = request.email().trim();
        String username = email;
        String otpKey = OTP_PREFIX + email;

        String storedOtp = redisService.get(otpKey)
                .orElseThrow(() -> new IllegalArgumentException("Mã OTP đã hết hạn. Vui lòng gửi lại."));

        if (!storedOtp.equals(request.otp())) {
            throw new IllegalArgumentException("Mã OTP không chính xác.");
        }

        if (taiKhoanRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email đã tồn tại trong hệ thống.");
        }
        if (taiKhoanRepository.existsByUsername(username)) {
            throw new IllegalArgumentException("Username đã tồn tại trong hệ thống.");
        }
        if (request.phone() != null && !request.phone().isBlank()) {
            if (taiKhoanRepository.existsByPhone(request.phone())) {
                throw new IllegalArgumentException("Số điện thoại đã tồn tại trong hệ thống.");
            }
        }

        Role role = parseRole(request.role());

        TaiKhoan taiKhoan = TaiKhoan.builder()
                .username(username)
                .password(passwordEncoder.encode(request.password()))
                .fullName(request.fullName())
                .email(email)
                .phone(normalizeOptional(request.phone()))
                .enabled(true)
                .build();
        taiKhoanRepository.save(taiKhoan);

        NguoiDung nguoiDung = NguoiDung.builder()
                .maNguoiDung(IdGenerator.generate("ND"))
                .hoTen(request.fullName())
                .taiKhoan(taiKhoan)
                .build();
        nguoiDungRepository.save(nguoiDung);

        if (role == Role.CSKD) {
            String businessName = normalizeOptional(request.businessName());
            CoSoKinhDoanh coSo = CoSoKinhDoanh.builder()
                    .maCoSo(IdGenerator.generate("CS"))
                    .tenCoSo(businessName)
                    .chuSoHuu(nguoiDung)
                    .build();
            coSoKinhDoanhRepository.save(coSo);
        }

        quyenHanNguoiDungRepository.save(QuyenHanNguoiDung.builder()
                .maQuyenHan(role.name())
                .taiKhoanId(taiKhoan.getId())
                .build());

        redisService.delete(otpKey);

        return issueTokens(username);
    }

    private AuthResponse issueTokens(String username) {
        UserDetails userDetails = userDetailsService.loadUserByUsername(username);
        String accessToken = jwtService.generateAccessToken(userDetails);
        String refreshTokenJwt = jwtService.generateRefreshToken(userDetails);

        TaiKhoan user = taiKhoanRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalStateException("User not found after registration"));

        refreshTokenRepository.save(RefreshToken.builder()
                .token(refreshTokenJwt)
                .user(user)
                .expiresAt(jwtService.getExpirationTime(refreshTokenJwt))
                .revoked(false)
                .build());

        return new AuthResponse(accessToken, refreshTokenJwt, UserInfoDto.fromEntity(user));
    }

    private String normalizeOptional(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        return value.trim();
    }

    private Role parseRole(String value) {
        if (value == null || value.isBlank()) {
            return Role.NTD;
        }
        try {
            return Role.valueOf(value.trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new IllegalArgumentException("Vai trò không hợp lệ.");
        }
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
