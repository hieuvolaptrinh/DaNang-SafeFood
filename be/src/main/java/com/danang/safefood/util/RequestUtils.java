package com.danang.safefood.util;

import jakarta.servlet.http.HttpServletRequest;

public final class RequestUtils {

    private RequestUtils() {
    }

    public static String getClientIp(HttpServletRequest request) {
        String forwardedFor = request.getHeader("X-Forwarded-For");
        if (forwardedFor != null && !forwardedFor.isBlank()) {
            String[] parts = forwardedFor.split(",");
            if (parts.length > 0 && !parts[0].isBlank()) {
                return parts[0].trim();
            }
        }

        String realIp = request.getHeader("X-Real-IP");
        if (realIp != null && !realIp.isBlank()) {
            return realIp.trim();
        }

        return request.getRemoteAddr();
    }

    public static String resolveDevice(String deviceFromBody, HttpServletRequest request) {
        if (deviceFromBody != null && !deviceFromBody.isBlank()) {
            return deviceFromBody.trim();
        }

        String userAgent = request.getHeader("User-Agent");
        return userAgent != null ? userAgent.trim() : "";
    }
}
