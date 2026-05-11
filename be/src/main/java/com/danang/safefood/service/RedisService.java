package com.danang.safefood.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Optional;

/**
 * Service chung để thao tác với Redis.
 * Tái sử dụng cho OTP, cache, session, v.v.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class RedisService {

    private final StringRedisTemplate redisTemplate;

    /**
     * Lưu giá trị với TTL (tự hết hạn).
     */
    public void set(String key, String value, Duration ttl) {
        redisTemplate.opsForValue().set(key, value, ttl);
        log.debug("Redis SET key={}, TTL={}s", key, ttl.getSeconds());
    }

    /**
     * Lưu giá trị không có TTL.
     */
    public void set(String key, String value) {
        redisTemplate.opsForValue().set(key, value);
        log.debug("Redis SET key={} (no TTL)", key);
    }

    /**
     * Lấy giá trị theo key.
     *
     * @return Optional chứa giá trị, hoặc empty nếu key không tồn tại / đã hết hạn.
     */
    public Optional<String> get(String key) {
        return Optional.ofNullable(redisTemplate.opsForValue().get(key));
    }

    /**
     * Xóa key khỏi Redis.
     *
     * @return true nếu key đã tồn tại và bị xóa, false nếu key không tồn tại.
     */
    public boolean delete(String key) {
        Boolean deleted = redisTemplate.delete(key);
        log.debug("Redis DELETE key={}, result={}", key, deleted);
        return Boolean.TRUE.equals(deleted);
    }

    /**
     * Kiểm tra key có tồn tại không.
     */
    public boolean hasKey(String key) {
        return Boolean.TRUE.equals(redisTemplate.hasKey(key));
    }

    /**
     * Lấy thời gian sống còn lại của key (giây).
     *
     * @return số giây còn lại, hoặc -1 nếu không có TTL, -2 nếu key không tồn tại.
     */
    public long getExpire(String key) {
        Long ttl = redisTemplate.getExpire(key);
        return ttl != null ? ttl : -2;
    }
}
