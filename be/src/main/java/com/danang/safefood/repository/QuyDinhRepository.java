package com.danang.safefood.repository;

import com.danang.safefood.entity.QuyDinh;
import com.danang.safefood.entity.TrangThaiQuyDinh;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QuyDinhRepository extends JpaRepository<QuyDinh, String> {
    Page<QuyDinh> findAllByOrderByCreatedAtDesc(Pageable pageable);
    Page<QuyDinh> findByTrangThaiOrderByCreatedAtDesc(TrangThaiQuyDinh trangThai, Pageable pageable);
    long countByTrangThai(TrangThaiQuyDinh trangThai);
}
