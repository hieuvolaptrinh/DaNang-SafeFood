package com.danang.safefood.repository;

import com.danang.safefood.entity.PhanAnh;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface PhanAnhRepository extends JpaRepository<PhanAnh, String> {

    Page<PhanAnh> findAllByOrderByNgayGuiDesc(Pageable pageable);

    Page<PhanAnh> findByTrangThaiPhanAnhOrderByNgayGuiDesc(String trangThai, Pageable pageable);

    List<PhanAnh> findByNguoiPhanAnh_MaNguoiDungOrderByNgayGuiDesc(String maNguoiDung);

    java.util.Optional<PhanAnh> findByMaPhanAnhAndNguoiPhanAnh_MaNguoiDung(String maPhanAnh, String maNguoiDung);

    @Query(value = """
            SELECT * FROM phan_anh p
            WHERE (CAST(:trangThai AS VARCHAR) IS NULL OR p.trangThaiPhanAnh = :trangThai)
              AND (CAST(:from AS TIMESTAMP) IS NULL OR p.ngayGui >= :from)
              AND (CAST(:to AS TIMESTAMP) IS NULL OR p.ngayGui <= :to)
            ORDER BY p.ngayGui DESC
            """, nativeQuery = true,
            countQuery = """
                    SELECT COUNT(*) FROM phan_anh p
                    WHERE (CAST(:trangThai AS VARCHAR) IS NULL OR p.trangThaiPhanAnh = :trangThai)
                      AND (CAST(:from AS TIMESTAMP) IS NULL OR p.ngayGui >= :from)
                      AND (CAST(:to AS TIMESTAMP) IS NULL OR p.ngayGui <= :to)
                    """)
    Page<PhanAnh> findWithFilter(
            @Param("trangThai") String trangThai,
            @Param("from") LocalDateTime from,
            @Param("to") LocalDateTime to,
            Pageable pageable);

    long countByTrangThaiPhanAnh(String trangThai);
}
