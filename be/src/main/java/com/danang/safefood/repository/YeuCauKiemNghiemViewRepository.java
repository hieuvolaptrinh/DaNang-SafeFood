package com.danang.safefood.repository;

import com.danang.safefood.entity.YeuCauKiemNghiemView;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface YeuCauKiemNghiemViewRepository extends JpaRepository<YeuCauKiemNghiemView, String> {

    @Query("SELECT v FROM YeuCauKiemNghiemView v WHERE (:keyword IS NULL OR lower(v.maYeuCau) LIKE lower(concat('%',:keyword,'%')) OR lower(v.tenCoSo) LIKE lower(concat('%',:keyword,'%'))) AND (:status IS NULL OR v.trangThai = :status)")
    Page<YeuCauKiemNghiemView> search(@Param("keyword") String keyword, @Param("status") String status, Pageable pageable);
}
