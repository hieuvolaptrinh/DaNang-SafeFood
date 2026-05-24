package com.danang.safefood.repository;

import com.danang.safefood.entity.HinhThucKhacPhuc;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface HinhThucKhacPhucRepository extends JpaRepository<HinhThucKhacPhuc, String> {
    List<HinhThucKhacPhuc> findByViPham_MaViPham(String maViPham);

    @Query(value = """
            SELECT * FROM hinh_thuc_khac_phuc h
            WHERE (CAST(:tinhTrang AS VARCHAR) IS NULL OR h.tinhTrangKhacPhuc = :tinhTrang)
              AND (CAST(:maViPham AS VARCHAR) IS NULL OR h.maViPham = :maViPham)
            """,
            nativeQuery = true,
            countQuery = """
            SELECT COUNT(*) FROM hinh_thuc_khac_phuc h
            WHERE (CAST(:tinhTrang AS VARCHAR) IS NULL OR h.tinhTrangKhacPhuc = :tinhTrang)
              AND (CAST(:maViPham AS VARCHAR) IS NULL OR h.maViPham = :maViPham)
            """)
    Page<HinhThucKhacPhuc> findWithFilter(
            @Param("tinhTrang") String tinhTrang,
            @Param("maViPham") String maViPham,
            Pageable pageable);
}
