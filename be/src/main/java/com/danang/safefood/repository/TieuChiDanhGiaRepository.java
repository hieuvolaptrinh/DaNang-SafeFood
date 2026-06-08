package com.danang.safefood.repository;

import com.danang.safefood.entity.TieuChiDanhGia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface TieuChiDanhGiaRepository extends JpaRepository<TieuChiDanhGia, String> {

    @Query("""
            SELECT DISTINCT t.nhom
            FROM TieuChiDanhGia t
            WHERE t.nhom IS NOT NULL AND TRIM(t.nhom) <> ''
            ORDER BY t.nhom
            """)
    List<String> findDistinctNhom();
}
