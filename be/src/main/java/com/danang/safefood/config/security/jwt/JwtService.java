package com.danang.safefood.config.security.jwt;

import com.danang.safefood.config.security.user.CustomUserDetails;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.time.Instant;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class JwtService {

    private final SecretKey signingKey;
    private final long accessTokenExpirationMs;
    private final long refreshTokenExpirationMs;

    public JwtService(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.access-token-expiration-ms:900000}") long accessTokenExpirationMs,
            @Value("${jwt.refresh-token-expiration-ms:604800000}") long refreshTokenExpirationMs
    ) {
        this.signingKey = Keys.hmacShaKeyFor(Decoders.BASE64.decode(secret));
        this.accessTokenExpirationMs = accessTokenExpirationMs;
        this.refreshTokenExpirationMs = refreshTokenExpirationMs;
    }

    /**
     * Access token mang đầy đủ thông tin user (id, fullName, email, phone, roles)
     * để phía client (mobile) có thể decode JWT lấy thông tin mà không cần gọi API thêm,
     * và phía server dùng @AuthenticationPrincipal Jwt jwt để truy xuất trực tiếp.
     */
    public String generateAccessToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("typ", "access");
        claims.put("roles", extractRoles(userDetails));

        if (userDetails instanceof CustomUserDetails customUser) {
            var user = customUser.getUser();
            claims.put("userId", user.getId());
            claims.put("fullName", user.getFullName());
            claims.put("email", user.getEmail());
            claims.put("phone", user.getPhone());
        }

        return generateToken(claims, userDetails.getUsername(), accessTokenExpirationMs);
    }

    /**
     * Refresh token chỉ chứa subject (username) + typ, không chứa thông tin nhạy cảm.
     */
    public String generateRefreshToken(UserDetails userDetails) {
        return generateToken(Map.of("typ", "refresh"), userDetails.getUsername(), refreshTokenExpirationMs);
    }

    public String extractUsername(String token) {
        return extractAllClaims(token).getSubject();
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        String username = extractUsername(token);
        return username.equals(userDetails.getUsername()) && !isTokenExpired(token);
    }

    public Instant getExpirationTime(String token) {
        return extractAllClaims(token).getExpiration().toInstant();
    }

    public Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(signingKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private String generateToken(Map<String, Object> extraClaims, String subject, long expirationMs) {
        Instant now = Instant.now();
        Instant exp = now.plusMillis(expirationMs);
        return Jwts.builder()
                .claims(extraClaims)
                .subject(subject)
                .issuedAt(Date.from(now))
                .expiration(Date.from(exp))
                .signWith(signingKey, Jwts.SIG.HS256)
                .compact();
    }

    private boolean isTokenExpired(String token) {
        return getExpirationTime(token).isBefore(Instant.now());
    }

    private List<String> extractRoles(UserDetails userDetails) {
        return userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .toList();
    }
}


