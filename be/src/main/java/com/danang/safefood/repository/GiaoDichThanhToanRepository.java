package com.danang.safefood.repository;

import com.danang.safefood.entity.GiaoDichThanhToan;
import com.danang.safefood.util.TrangThaiThanhToan;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface GiaoDichThanhToanRepository extends JpaRepository<GiaoDichThanhToan, String> {
    Optional<GiaoDichThanhToan> findByOrderCode(Long orderCode);

    List<GiaoDichThanhToan> findByXuPhat_MaXuPhatOrderByCreatedAtDesc(String maXuPhat);

    Optional<GiaoDichThanhToan> findFirstByXuPhat_MaXuPhatAndTrangThaiOrderByCreatedAtDesc(
            String maXuPhat, TrangThaiThanhToan trangThai);
}
