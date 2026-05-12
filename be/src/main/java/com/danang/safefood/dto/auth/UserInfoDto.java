package com.danang.safefood.dto.auth;

import com.danang.safefood.entity.TaiKhoan;

import java.util.List;

public record UserInfoDto(
                Long id,
                String username,
                String fullName,
                String email,
                String phone,
                List<String> role,
                boolean enabled) {
        public static UserInfoDto fromEntity(TaiKhoan user) {
                var roles = user.getQuyenHanNguoiDungList() == null
                                ? List.<String>of()
                                : user.getQuyenHanNguoiDungList().stream()
                                                .map(qhnd -> "ROLE_" + qhnd.getQuyenHan().getMaQuyenHan())
                                                .toList();
                return new UserInfoDto(
                                user.getId(),
                                user.getUsername(),
                                user.getFullName(),
                                user.getEmail(),
                                user.getPhone(),
                                roles,
                                user.isEnabled());
        }
}
