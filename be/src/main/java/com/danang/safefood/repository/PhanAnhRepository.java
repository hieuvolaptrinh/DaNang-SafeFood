package com.danang.safefood.repository;

import com.danang.safefood.entity.PhanAnh;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;

public interface PhanAnhRepository extends JpaRepository<PhanAnh, String> {

    Page<PhanAnh> findAllByOrderByNgayGuiDesc(Pageable pageable);

    Page<PhanAnh> findByTrangThaiPhanAnhOrderByNgayGuiDesc(String trangThai, Pageable pageable);

    @Query("""
            SELECT p FROM PhanAnh p
            WHERE (:trangThai IS NULL OR p.trangThaiPhanAnh = :trangThai)
              AND (:from IS NULL OR p.ngayGui >= :from)
              AND (:to   IS NULL OR p.ngayGui <= :to)
            ORDER BY p.ngayGui DESC
            """)
    Page<PhanAnh> findWithFilter(
            @Param("trangThai") String trangThai,
            @Param("from") LocalDateTime from,
            @Param("to") LocalDateTime to,
            Pageable pageable
    );

    long countByTrangThaiPhanAnh(String trangThai);
}
