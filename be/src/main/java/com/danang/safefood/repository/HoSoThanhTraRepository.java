package com.danang.safefood.repository;

import com.danang.safefood.entity.HoSoThanhTra;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface HoSoThanhTraRepository extends JpaRepository<HoSoThanhTra, String> {

    @Query("SELECT h FROM HoSoThanhTra h " +
           "WHERE (:keyword IS NULL OR LOWER(h.maHoSo) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(h.lichThanhTra.coSoKinhDoanh.tenCoSo) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
           "AND (:resultFilter IS NULL OR h.ketLuan = :resultFilter) " +
           "AND (:inspectorFilter IS NULL OR LOWER(h.lichThanhTra.nguoiPhuTrach.hoTen) LIKE LOWER(CONCAT('%', :inspectorFilter, '%')))")
    Page<HoSoThanhTra> searchHoSo(
            @Param("keyword") String keyword, 
            @Param("resultFilter") String resultFilter, 
            @Param("inspectorFilter") String inspectorFilter, 
            Pageable pageable);

    @Query("SELECT COUNT(h) FROM HoSoThanhTra h WHERE h.ketLuan IN ('pass', 'fail')")
    long countCompleted();

    @Query("SELECT COUNT(h) FROM HoSoThanhTra h WHERE h.ketLuan = 'fail'")
    long countFailed();

    @Query("SELECT COUNT(h) FROM HoSoThanhTra h WHERE h.ketLuan = 'scheduled' OR h.ketLuan IS NULL")
    long countScheduled();

    List<HoSoThanhTra> findByLichThanhTra_MaThanhTra(String maThanhTra);

    @Query("""
            SELECT h FROM HoSoThanhTra h
            WHERE (:from IS NULL OR h.thoiGianKiemTra >= :from)
              AND (:to   IS NULL OR h.thoiGianKiemTra <= :to)
            ORDER BY h.thoiGianKiemTra DESC
            """)
    List<HoSoThanhTra> findByThoiGianRange(
            @Param("from") java.time.LocalDateTime from,
            @Param("to") java.time.LocalDateTime to
    );
}
