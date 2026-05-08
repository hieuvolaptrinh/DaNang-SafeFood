package com.danang.safefood.repository;

import com.danang.safefood.entity.LichThanhTra;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LichThanhTraRepository extends JpaRepository<LichThanhTra, String> {

    Page<LichThanhTra> findAllByOrderByMaThanhTraDesc(Pageable pageable);

    Page<LichThanhTra> findByTrangThaiOrderByMaThanhTraDesc(String trangThai, Pageable pageable);

    long countByTrangThai(String trangThai);
}
