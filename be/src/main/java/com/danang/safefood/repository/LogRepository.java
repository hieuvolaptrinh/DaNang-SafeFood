package com.danang.safefood.repository;

import com.danang.safefood.entity.Log;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LogRepository extends JpaRepository<Log, String> {

    /**
     * Lấy lịch sử đăng nhập của một người dùng theo thứ tự thời gian giảm dần
     * (mới nhất → cũ nhất).
     */
    List<Log> findByNguoiDung_MaNguoiDungOrderByTimeDesc(String maNguoiDung);
}
