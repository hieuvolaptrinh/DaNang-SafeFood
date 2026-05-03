package com.danang.safefood.dto.auth;

public record AuthResponse(
        String accessToken,
        String refreshToken,
        UserInfoDto user
) {
}

