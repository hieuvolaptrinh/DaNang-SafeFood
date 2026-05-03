package com.danang.safefood.dto.auth;

import com.danang.safefood.entity.Role;
import com.danang.safefood.entity.TaiKhoan;

public record UserInfoDto(
        Long id,
        String username,
        String fullName,
        String email,
        String phone,
        Role role,
        boolean enabled
) {
    public static UserInfoDto fromEntity(TaiKhoan user) {
        return new UserInfoDto(
                user.getId(),
                user.getUsername(),
                user.getFullName(),
                user.getEmail(),
                user.getPhone(),
                user.getRole(),
                user.isEnabled()
        );
    }
}

