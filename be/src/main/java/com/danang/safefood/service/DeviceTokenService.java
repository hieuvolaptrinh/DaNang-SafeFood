package com.danang.safefood.service;

import com.danang.safefood.entity.TaiKhoan;
import com.danang.safefood.entity.UserDeviceToken;
import com.danang.safefood.repository.UserDeviceTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class DeviceTokenService {

    private final UserDeviceTokenRepository repo;

    public void saveToken(String token, TaiKhoan user) {

        Optional<UserDeviceToken> existing = repo.findByFcmToken(token);

        if (existing.isPresent()) {
            existing.get().setTaiKhoan(user);
            repo.save(existing.get());
        } else {
            repo.save(UserDeviceToken.builder()
                    .fcmToken(token)
                    .taiKhoan(user)
                    .build());
        }
    }
}
