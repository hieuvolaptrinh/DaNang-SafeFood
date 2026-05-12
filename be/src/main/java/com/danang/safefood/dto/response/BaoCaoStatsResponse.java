package com.danang.safefood.dto.response;

public record BaoCaoStatsResponse(
        long total,
        long completed,
        long processing,
        long failed
) {}
