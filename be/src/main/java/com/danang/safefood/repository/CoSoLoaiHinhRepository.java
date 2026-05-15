package com.danang.safefood.repository;

import com.danang.safefood.entity.CoSoLoaiHinh;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CoSoLoaiHinhRepository extends JpaRepository<CoSoLoaiHinh, CoSoLoaiHinh.CoSoLoaiHinhId> {
    
    @Query("SELECT lh.tenLoaiHinhKinhDoanh FROM CoSoLoaiHinh cl JOIN cl.loaiHinhKinhDoanh lh WHERE cl.maCoSo = :maCoSo")
    List<String> findLoaiHinhByMaCoSo(@Param("maCoSo") String maCoSo);
}
