package com.danang.safefood.repository;

import com.danang.safefood.entity.ChiNhanh;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChiNhanhRepository extends JpaRepository<ChiNhanh, String> {
    
    @Query("SELECT c.diaChi FROM ChiNhanh c WHERE c.coSoKinhDoanh.maCoSo = :maCoSo AND c.diaChi IS NOT NULL")
    List<String> findDiaChiByMaCoSo(@Param("maCoSo") String maCoSo);

    List<ChiNhanh> findByCoSoKinhDoanh_MaCoSo(String maCoSo);
}
