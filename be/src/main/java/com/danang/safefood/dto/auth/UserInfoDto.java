package com.danang.safefood.dto.auth;

import com.danang.safefood.entity.Role;
import com.danang.safefood.entity.TaiKhoan;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.List;

public record UserInfoDto(
        Long id,
        String username,
        String fullName,
        String email,
        String phone,
        List<String> role,
        boolean enabled
) {
    public static UserInfoDto fromEntity(TaiKhoan user) {
        return new UserInfoDto(
                user.getId(),
                user.getUsername(),
                user.getFullName(),
                user.getEmail(),
                user.getPhone(),
                user.getQuyenHanNguoiDungList().stream()
                        .map(qhnd -> "ROLE_" + qhnd.getQuyenHan().getMaQuyenHan())
                        .toList(),
                user.isEnabled()
        );
    }
}

