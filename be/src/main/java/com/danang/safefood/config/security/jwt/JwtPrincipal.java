package com.danang.safefood.config.security.jwt;

import io.jsonwebtoken.Claims;

import java.util.Collections;
import java.util.List;

/**
 * Principal chứa thông tin được extract từ JWT token.
 * Sử dụng với @AuthenticationPrincipal JwtPrincipal jwt trong Controller
 * để lấy thông tin user mà không cần query DB thêm.
 *
 * Ví dụ:
 *   @GetMapping("/me")
 *   public ResponseEntity<?> getMe(@AuthenticationPrincipal JwtPrincipal jwt) {
 *       Long userId = jwt.getUserId();
 *       List<String> roles = jwt.getRoles();
 *   }
 *
 *   @PreAuthorize("hasRole('ADMIN')")
 *   @PostMapping("/admin/action")
 *   public ResponseEntity<?> adminAction(@AuthenticationPrincipal JwtPrincipal jwt) { ... }
 */
public record JwtPrincipal(
        String username,
        Long userId,
        String fullName,
        String email,
        String phone,
        List<String> roles
) implements java.security.Principal {
    
    @Override
    public String getName() {
        return this.username;
    }
    @SuppressWarnings("unchecked")
    public static JwtPrincipal fromClaims(Claims claims) {
        return new JwtPrincipal(
                claims.getSubject(),
                claims.get("userId", Long.class),
                claims.get("fullName", String.class),
                claims.get("email", String.class),
                claims.get("phone", String.class),
                claims.get("roles") instanceof List<?> list
                        ? list.stream().map(Object::toString).toList()
                        : Collections.emptyList()
        );
    }
}
