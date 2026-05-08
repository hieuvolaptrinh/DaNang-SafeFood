package com.danang.safefood.util;

import java.util.UUID;

/**
 * Generates 10-character business IDs: prefix (2 chars) + 8 UUID hex chars.
 * Example: "QD" + "a1b2c3d4" → "QDa1b2c3d4"
 */
public final class IdGenerator {

    private IdGenerator() {}

    public static String generate(String prefix) {
        String hex = UUID.randomUUID().toString().replace("-", "").substring(0, 10 - prefix.length());
        return prefix + hex;
    }
}
