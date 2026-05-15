package com.danang.safefood.service;

import com.danang.safefood.dto.request.ChangePasswordRequest;
import com.danang.safefood.dto.request.UpdateProfileRequest;
import com.danang.safefood.dto.response.ProfileResponse;
import com.danang.safefood.entity.TaiKhoan;
import com.danang.safefood.repository.TaiKhoanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final TaiKhoanRepository taiKhoanRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * Lấy thông tin cá nhân theo userId (TaiKhoan.id).
     */
    public ProfileResponse getProfile(Long userId) {
        TaiKhoan tk = taiKhoanRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy tài khoản."));
        return toResponse(tk);
    }

    /**
     * Cập nhật thông tin cá nhân.
     */
    @Transactional
    public ProfileResponse updateProfile(Long userId, UpdateProfileRequest request) {
        TaiKhoan tk = taiKhoanRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy tài khoản."));

        if (request.fullName() != null) {
            tk.setFullName(request.fullName());
        }
        if (request.email() != null) {
            // Kiểm tra email trùng lặp
            taiKhoanRepository.findByEmail(request.email())
                    .filter(existing -> !existing.getId().equals(userId))
                    .ifPresent(existing -> {
                        throw new IllegalArgumentException("Email đã được sử dụng bởi tài khoản khác.");
                    });
            tk.setEmail(request.email());
        }
        if (request.phone() != null) {
            tk.setPhone(request.phone());
        }

        taiKhoanRepository.save(tk);
        return toResponse(tk);
    }

    /**
     * Đổi mật khẩu.
     */
    @Transactional
    public void changePassword(Long userId, ChangePasswordRequest request) {
        TaiKhoan tk = taiKhoanRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy tài khoản."));

        if (!passwordEncoder.matches(request.currentPassword(), tk.getPassword())) {
            throw new IllegalArgumentException("Mật khẩu cũ không chính xác.");
        }

        tk.setPassword(passwordEncoder.encode(request.newPassword()));
        taiKhoanRepository.save(tk);
    }

    private ProfileResponse toResponse(TaiKhoan tk) {
        var roles = tk.getQuyenHanNguoiDungList().stream()
                .map(q -> q.getQuyenHan().getQuyenHan())
                .collect(Collectors.toList());

        return new ProfileResponse(
                tk.getId(),
                tk.getUsername(),
                tk.getFullName(),
                tk.getEmail(),
                tk.getPhone(),
                roles
        );
    }
}
