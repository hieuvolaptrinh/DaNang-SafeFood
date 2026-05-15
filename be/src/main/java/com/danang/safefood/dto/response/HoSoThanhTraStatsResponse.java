package com.danang.safefood.dto.response;

public record HoSoThanhTraStatsResponse(
        long total,
        long completed,
        long scheduled,
        long failed
) {}
