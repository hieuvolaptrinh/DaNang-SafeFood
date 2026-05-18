package com.danang.safefood.repository;

import com.danang.safefood.entity.KhieuNai;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface KhieuNaiRepository extends JpaRepository<KhieuNai, String> {

    @Query("""
            SELECT k FROM KhieuNai k
            LEFT JOIN k.coSoKinhDoanh c
            LEFT JOIN c.chuSoHuu nd
            WHERE (:keyword IS NULL
                OR LOWER(k.maKhieuNai) LIKE LOWER(CONCAT('%', CAST(:keyword AS String), '%'))
                OR LOWER(COALESCE(k.tieuDe, '')) LIKE LOWER(CONCAT('%', CAST(:keyword AS String), '%'))
                OR LOWER(COALESCE(nd.hoTen, '')) LIKE LOWER(CONCAT('%', CAST(:keyword AS String), '%'))
                OR LOWER(COALESCE(c.tenCoSo, '')) LIKE LOWER(CONCAT('%', CAST(:keyword AS String), '%')))
              AND (:trangThai IS NULL OR k.trangThai = :trangThai)
            """)
    Page<KhieuNai> search(
            @Param("keyword") String keyword,
            @Param("trangThai") String trangThai,
            Pageable pageable
    );
}
