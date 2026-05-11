package com.danang.safefood.repository;

import com.danang.safefood.entity.NguoiDung;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface NguoiDungRepository extends JpaRepository<NguoiDung, String> {

    Optional<NguoiDung> findByCccd(String cccd);

    /** Tìm người dùng theo ID tài khoản (từ JWT userId) */
    Optional<NguoiDung> findByTaiKhoan_Id(Long taiKhoanId);
}
