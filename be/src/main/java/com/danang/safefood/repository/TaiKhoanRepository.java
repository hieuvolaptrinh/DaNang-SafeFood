package com.danang.safefood.repository;

import com.danang.safefood.entity.TaiKhoan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface TaiKhoanRepository extends JpaRepository<TaiKhoan, Long> {
    @Query("""
        SELECT DISTINCT tk
        FROM TaiKhoan tk
        LEFT JOIN FETCH tk.quyenHanNguoiDungList qhnd
        LEFT JOIN FETCH qhnd.quyenHan
        WHERE tk.username = :username
    """)
    Optional<TaiKhoan> findByUsername(String username);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);

    @Query("""
        SELECT DISTINCT tk
        FROM TaiKhoan tk
        LEFT JOIN FETCH tk.quyenHanNguoiDungList qhnd
        LEFT JOIN FETCH qhnd.quyenHan
        WHERE tk.email = :email
    """)
    Optional<TaiKhoan> findByEmail(String email);

    @Query("""
        SELECT DISTINCT tk
        FROM TaiKhoan tk
        LEFT JOIN FETCH tk.quyenHanNguoiDungList qhnd
        LEFT JOIN FETCH qhnd.quyenHan
        WHERE tk.email = :identifier OR tk.phone = :identifier
    """)
    Optional<TaiKhoan> findByEmailOrPhone(String identifier);
}

