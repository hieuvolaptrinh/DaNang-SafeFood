package com.danang.safefood.repository;

import com.danang.safefood.entity.UserDeviceToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserDeviceTokenRepository
        extends JpaRepository<UserDeviceToken, Long> {

    Optional<UserDeviceToken> findByFcmToken(String token);

    List<UserDeviceToken> findByTaiKhoan_IdIn(List<Long> ids);
}
