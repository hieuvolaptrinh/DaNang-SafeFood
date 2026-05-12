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
           "LEFT JOIN b.hoSoThanhTra hs " +
           "LEFT JOIN hs.lichThanhTra ltt " +
           "LEFT JOIN ltt.coSoKinhDoanh cskd " +
           "WHERE (:keyword IS NULL OR LOWER(b.maBaoCao) LIKE LOWER(CONCAT('%', CAST(:keyword AS String), '%')) OR LOWER(cskd.tenCoSo) LIKE LOWER(CONCAT('%', CAST(:keyword AS String), '%'))) " +
           "AND (:resultFilter IS NULL OR hs.tinhTrangViPham = :resultFilter)")
    Page<BaoCao> searchBaoCao(@Param("keyword") String keyword, @Param("resultFilter") String resultFilter, Pageable pageable);

    @Query("SELECT COUNT(b) FROM BaoCao b WHERE b.hoSoThanhTra.tinhTrangViPham IN ('pass', 'fail')")
    long countCompleted();

    @Query("SELECT COUNT(b) FROM BaoCao b WHERE b.hoSoThanhTra.tinhTrangViPham = 'scheduled' OR b.hoSoThanhTra.tinhTrangViPham IS NULL")
    long countProcessing();

    @Query("SELECT COUNT(b) FROM BaoCao b WHERE b.hoSoThanhTra.tinhTrangViPham = 'fail'")
    long countFailed();
}
