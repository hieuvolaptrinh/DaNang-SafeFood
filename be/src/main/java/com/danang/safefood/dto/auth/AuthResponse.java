package com.danang.safefood.dto.auth;

import com.danang.safefood.dto.response.LogResponse;

public record AuthResponse(
        String accessToken,
        String refreshToken,
        UserInfoDto user,
        LogResponse loginLog
) {
    public AuthResponse(String accessToken, String refreshToken, UserInfoDto user) {
        this(accessToken, refreshToken, user, null);
    }
}
