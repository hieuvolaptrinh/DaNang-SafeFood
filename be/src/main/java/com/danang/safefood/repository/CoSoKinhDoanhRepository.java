package com.danang.safefood.repository;

import com.danang.safefood.entity.CoSoKinhDoanh;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CoSoKinhDoanhRepository extends JpaRepository<CoSoKinhDoanh, String> {
    java.util.Optional<CoSoKinhDoanh> findFirstByTenCoSo(String tenCoSo);

    Page<CoSoKinhDoanh> findAllByOrderByTenCoSoAsc(Pageable pageable);

    Page<CoSoKinhDoanh> findByTrangThaiOrderByTenCoSoAsc(String trangThai, Pageable pageable);

    @Query("""
            SELECT c FROM CoSoKinhDoanh c
            WHERE (:trangThai IS NULL OR c.trangThai = :trangThai)
              AND (:maPX IS NULL OR c.phuongXa.maPX = :maPX)
            ORDER BY c.tenCoSo ASC
            """)
    Page<CoSoKinhDoanh> findWithFilter(
            @Param("trangThai") String trangThai,
            @Param("maPX") String maPX,
            Pageable pageable
    );

    long countByTrangThai(String trangThai);
}
