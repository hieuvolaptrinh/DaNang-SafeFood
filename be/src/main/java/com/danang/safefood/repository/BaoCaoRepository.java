package com.danang.safefood.repository;

import com.danang.safefood.entity.BaoCao;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface BaoCaoRepository extends JpaRepository<BaoCao, String>, JpaSpecificationExecutor<BaoCao> {

    @Query("SELECT b FROM BaoCao b " +
           "WHERE (:keyword IS NULL OR LOWER(b.maBaoCao) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(b.hoSoThanhTra.lichThanhTra.coSoKinhDoanh.tenCoSo) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
           "AND (:resultFilter IS NULL OR b.hoSoThanhTra.tinhTrangViPham = :resultFilter)")
    Page<BaoCao> searchBaoCao(@Param("keyword") String keyword, @Param("resultFilter") String resultFilter, Pageable pageable);

    @Query("SELECT COUNT(b) FROM BaoCao b WHERE b.hoSoThanhTra.tinhTrangViPham IN ('pass', 'fail')")
    long countCompleted();

    @Query("SELECT COUNT(b) FROM BaoCao b WHERE b.hoSoThanhTra.tinhTrangViPham = 'scheduled' OR b.hoSoThanhTra.tinhTrangViPham IS NULL")
    long countProcessing();

    @Query("SELECT COUNT(b) FROM BaoCao b WHERE b.hoSoThanhTra.tinhTrangViPham = 'fail'")
    long countFailed();
}
