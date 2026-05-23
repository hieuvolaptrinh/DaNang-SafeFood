package com.danang.safefood.dto.response;

import com.danang.safefood.entity.Log;

import java.time.LocalDateTime;

public record LogResponse(
        String maLog,
        String ip,
        LocalDateTime time,
        String location,
        String device,
        Boolean isAbnormal) {

    public static LogResponse fromEntity(Log entity) {
        if (entity == null) {
            return null;
        }
        return new LogResponse(
                entity.getMaLog(),
                entity.getIp(),
                entity.getTime(),
                entity.getLocation(),
                entity.getDevice(),
                entity.getIsAbnormal());
    }
}
