package com.danang.safefood.repository;

import com.danang.safefood.entity.TaiKhoan;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TaiKhoanRepository extends JpaRepository<TaiKhoan, Long> {
    Optional<TaiKhoan> findByUsername(String username);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
}

