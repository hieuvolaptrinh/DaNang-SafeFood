package com.danang.safefood.dto.request;

public record DeviceTokenRequest(
        String token,
        String deviceType
) {
}
