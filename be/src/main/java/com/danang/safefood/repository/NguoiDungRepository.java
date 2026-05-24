package com.danang.safefood.repository;

import com.danang.safefood.entity.NguoiDung;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface NguoiDungRepository extends JpaRepository<NguoiDung, String> {

    Optional<NguoiDung> findByCccd(String cccd);

    Optional<NguoiDung> findByTaiKhoan_Username(String username);
    /** Tìm người dùng theo ID tài khoản (từ JWT userId) */
    Optional<NguoiDung> findByTaiKhoan_Id(Long taiKhoanId);

    @Query("""
        SELECT DISTINCT n FROM NguoiDung n
        JOIN n.taiKhoan t
        JOIN t.quyenHanNguoiDungList q
        WHERE q.maQuyenHan = :maQuyenHan
        ORDER BY n.hoTen ASC
        """)
    List<NguoiDung> findByQuyenHan(@Param("maQuyenHan") String maQuyenHan);
}
