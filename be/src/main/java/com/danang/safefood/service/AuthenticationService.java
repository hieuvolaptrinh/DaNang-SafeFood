package com.danang.safefood.service;

import com.danang.safefood.dto.auth.AuthResponse;
import com.danang.safefood.dto.auth.UserInfoDto;
import com.danang.safefood.entity.RefreshToken;
import com.danang.safefood.entity.TaiKhoan;
import com.danang.safefood.repository.RefreshTokenRepository;
import com.danang.safefood.repository.TaiKhoanRepository;
import com.danang.safefood.security.jwt.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final TaiKhoanRepository taiKhoanRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtService jwtService;

    /**
     * Login bằng username (dành cho Web).
     */
    @Transactional
    public AuthResponse login(String username, String password) {
        return authenticate(username, password);
    }

    /**
     * Login bằng email hoặc số điện thoại (dành cho Mobile).
     * Tìm user bằng email/phone trước, sau đó authenticate bằng username thực tế.
     */
    @Transactional
    public AuthResponse loginMobile(String identifier, String password) {
        TaiKhoan user = taiKhoanRepository.findByEmailOrPhone(identifier)
                .orElseThrow(() -> new UsernameNotFoundException(
                        "Không tìm thấy tài khoản với email hoặc số điện thoại: " + identifier));

        return authenticate(user.getUsername(), password);
    }

    @Transactional
    public AuthResponse refreshToken(String refreshToken) {
        RefreshToken stored = refreshTokenRepository.findByToken(refreshToken)
                .orElseThrow(() -> new IllegalArgumentException("Refresh token not found"));

        if (stored.isRevoked()) {
            throw new IllegalArgumentException("Refresh token revoked");
        }
        if (stored.getExpiresAt().isBefore(Instant.now())) {
            throw new IllegalArgumentException("Refresh token expired");
        }

        String username = jwtService.extractUsername(refreshToken);
        UserDetails userDetails = userDetailsService.loadUserByUsername(username);
        if (!jwtService.isTokenValid(refreshToken, userDetails)) {
            throw new IllegalArgumentException("Refresh token invalid");
        }

        String newAccessToken = jwtService.generateAccessToken(userDetails);
        String newRefreshTokenJwt = jwtService.generateRefreshToken(userDetails);

        stored.setRevoked(true);
        refreshTokenRepository.save(stored);

        var user = taiKhoanRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalStateException("User not found"));

        refreshTokenRepository.save(RefreshToken.builder()
                .token(newRefreshTokenJwt)
                .user(user)
                .expiresAt(jwtService.getExpirationTime(newRefreshTokenJwt))
                .revoked(false)
                .build());

        return new AuthResponse(newAccessToken, newRefreshTokenJwt, UserInfoDto.fromEntity(user));
    }

    @Transactional
    public void logout(String refreshToken) {
        refreshTokenRepository.findByToken(refreshToken).ifPresent(rt -> {
            rt.setRevoked(true);
            refreshTokenRepository.save(rt);
        });
    }

    // ── Private helper ──────────────────────────────────────────────────

    private AuthResponse authenticate(String username, String password) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(username, password)
        );

        UserDetails userDetails = (UserDetails) auth.getPrincipal();
        String accessToken = jwtService.generateAccessToken(userDetails);
        String refreshTokenJwt = jwtService.generateRefreshToken(userDetails);

        var user = taiKhoanRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalStateException("User not found after authentication"));

        RefreshToken refreshToken = RefreshToken.builder()
                .token(refreshTokenJwt)
                .user(user)
                .expiresAt(jwtService.getExpirationTime(refreshTokenJwt))
                .revoked(false)
                .build();
        refreshTokenRepository.save(refreshToken);

        return new AuthResponse(accessToken, refreshTokenJwt, UserInfoDto.fromEntity(user));
    }
}


