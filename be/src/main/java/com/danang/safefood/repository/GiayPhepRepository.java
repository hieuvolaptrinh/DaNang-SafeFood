package com.danang.safefood.repository;

import com.danang.safefood.entity.GiayPhep;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface GiayPhepRepository extends JpaRepository<GiayPhep, String> {
    List<GiayPhep> findByCoSoKinhDoanh_MaCoSo(String maCoSo);
    @Query("""
    SELECT g FROM GiayPhep g
    LEFT JOIN FETCH g.coSoKinhDoanh c
    LEFT JOIN FETCH c.phuongXa p
    WHERE g.ngayHetHan <= :ngayCanhBao
      AND g.ngayHetHan >= :ngayBatDau
    ORDER BY g.ngayHetHan ASC
    """)
    List<GiayPhep> findGiayPhepSapHetHan(
            @Param("ngayCanhBao") LocalDate ngayCanhBao,
            @Param("ngayBatDau") LocalDate ngayBatDau);
}
