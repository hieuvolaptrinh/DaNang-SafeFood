package com.danang.safefood;

import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class TestBCrypt {
    @Test
    public void testHash() {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String hash = "$2a$10$v3eu725GjfHQ34OHA43qN.oddPUR.Be6qDjfVo3iSErVaWpH5OuTq";
        String[] commonPasswords = {"123456", "12345678", "123456789", "password", "admin", "111111", "admin123", "Admin@123", "password123"};
        for (String p : commonPasswords) {
            if (encoder.matches(p, hash)) {
                System.out.println("============== FOUND PASSWORD: " + p + " ==============");
                return;
            }
        }
        System.out.println("============== NOT FOUND ==============");
    }
}
