package com.danang.safefood.repository;

import com.danang.safefood.entity.HoSoThanhTra;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface HoSoThanhTraRepository extends JpaRepository<HoSoThanhTra, String> {

    List<HoSoThanhTra> findByLichThanhTra_MaThanhTra(String maThanhTra);

    @Query("""
            SELECT h FROM HoSoThanhTra h
            WHERE (:from IS NULL OR h.thoiGianKiemTra >= :from)
              AND (:to   IS NULL OR h.thoiGianKiemTra <= :to)
            ORDER BY h.thoiGianKiemTra DESC
            """)
    List<HoSoThanhTra> findByThoiGianRange(
            @Param("from") LocalDateTime from,
            @Param("to") LocalDateTime to
    );
}
