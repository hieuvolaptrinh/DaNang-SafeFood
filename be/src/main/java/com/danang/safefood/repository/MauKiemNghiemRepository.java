package com.danang.safefood.repository;

import com.danang.safefood.dto.response.MauSelectResponse;
import com.danang.safefood.entity.MauKiemNghiem;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MauKiemNghiemRepository extends JpaRepository<MauKiemNghiem, String> {

    Page<MauKiemNghiem> findAllByOrderByNgayYeuCauDesc(Pageable pageable);

    Page<MauKiemNghiem> findByTrangThaiOrderByNgayYeuCauDesc(String trangThai, Pageable pageable);

    @Query(
            value = """
                    SELECT m
                    FROM MauKiemNghiem m
                    LEFT JOIN m.coSoKinhDoanh c
                    WHERE EXISTS (
                        SELECT 1
                        FROM DamNhanKiemNghiem d
                        WHERE d.id.maMau = m.maMau
                    )
                      AND (:keyword IS NULL OR :keyword = ''
                           OR LOWER(m.maMau) LIKE LOWER(CONCAT('%', :keyword, '%'))
                           OR LOWER(CONCAT('KQ-', m.maMau)) LIKE LOWER(CONCAT('%', :keyword, '%'))
                           OR LOWER(COALESCE(m.tenMau, '')) LIKE LOWER(CONCAT('%', :keyword, '%'))
                           OR LOWER(COALESCE(c.tenCoSo, '')) LIKE LOWER(CONCAT('%', :keyword, '%')))
                      AND (:resultFilter IS NULL OR :resultFilter = ''
                           OR (:resultFilter = 'pending'
                               AND (m.ketQuaKiemNghiem IS NULL OR TRIM(m.ketQuaKiemNghiem) = ''))
                           OR (:resultFilter = 'fail'
                               AND m.ketQuaKiemNghiem IS NOT NULL AND TRIM(m.ketQuaKiemNghiem) <> ''
                               AND m.lyDoKhongDat IS NOT NULL AND TRIM(m.lyDoKhongDat) <> '')
                           OR (:resultFilter = 'pass'
                               AND m.ketQuaKiemNghiem IS NOT NULL AND TRIM(m.ketQuaKiemNghiem) <> ''
                               AND (m.lyDoKhongDat IS NULL OR TRIM(m.lyDoKhongDat) = '')))
                    ORDER BY COALESCE(m.ngayKiemNghiem, m.ngayYeuCau) DESC, m.maMau DESC
                    """,
            countQuery = """
                    SELECT COUNT(m)
                    FROM MauKiemNghiem m
                    LEFT JOIN m.coSoKinhDoanh c
                    WHERE EXISTS (
                        SELECT 1
                        FROM DamNhanKiemNghiem d
                        WHERE d.id.maMau = m.maMau
                    )
                      AND (:keyword IS NULL OR :keyword = ''
                           OR LOWER(m.maMau) LIKE LOWER(CONCAT('%', :keyword, '%'))
                           OR LOWER(CONCAT('KQ-', m.maMau)) LIKE LOWER(CONCAT('%', :keyword, '%'))
                           OR LOWER(COALESCE(m.tenMau, '')) LIKE LOWER(CONCAT('%', :keyword, '%'))
                           OR LOWER(COALESCE(c.tenCoSo, '')) LIKE LOWER(CONCAT('%', :keyword, '%')))
                      AND (:resultFilter IS NULL OR :resultFilter = ''
                           OR (:resultFilter = 'pending'
                               AND (m.ketQuaKiemNghiem IS NULL OR TRIM(m.ketQuaKiemNghiem) = ''))
                           OR (:resultFilter = 'fail'
                               AND m.ketQuaKiemNghiem IS NOT NULL AND TRIM(m.ketQuaKiemNghiem) <> ''
                               AND m.lyDoKhongDat IS NOT NULL AND TRIM(m.lyDoKhongDat) <> '')
                           OR (:resultFilter = 'pass'
                               AND m.ketQuaKiemNghiem IS NOT NULL AND TRIM(m.ketQuaKiemNghiem) <> ''
                               AND (m.lyDoKhongDat IS NULL OR TRIM(m.lyDoKhongDat) = '')))
                    """
    )
    Page<MauKiemNghiem> searchKetQua(
            @Param("keyword") String keyword,
            @Param("resultFilter") String resultFilter,
            Pageable pageable
    );

    @Query("""
            SELECT COUNT(m)
            FROM MauKiemNghiem m
            WHERE EXISTS (
                SELECT 1
                FROM DamNhanKiemNghiem d
                WHERE d.id.maMau = m.maMau
            )
            """)
    long countMauCoKetQuaWorkflow();

    @Query("""
            SELECT COUNT(m)
            FROM MauKiemNghiem m
            WHERE EXISTS (
                SELECT 1
                FROM DamNhanKiemNghiem d
                WHERE d.id.maMau = m.maMau
            )
              AND (m.ketQuaKiemNghiem IS NULL OR TRIM(m.ketQuaKiemNghiem) = '')
            """)
    long countKetQuaPending();

    @Query("""
            SELECT COUNT(m)
            FROM MauKiemNghiem m
            WHERE EXISTS (
                SELECT 1
                FROM DamNhanKiemNghiem d
                WHERE d.id.maMau = m.maMau
            )
              AND m.ketQuaKiemNghiem IS NOT NULL AND TRIM(m.ketQuaKiemNghiem) <> ''
              AND m.lyDoKhongDat IS NOT NULL AND TRIM(m.lyDoKhongDat) <> ''
            """)
    long countKetQuaFailed();

    @Query("""
            SELECT COUNT(m)
            FROM MauKiemNghiem m
            WHERE EXISTS (
                SELECT 1
                FROM DamNhanKiemNghiem d
                WHERE d.id.maMau = m.maMau
            )
              AND m.ketQuaKiemNghiem IS NOT NULL AND TRIM(m.ketQuaKiemNghiem) <> ''
              AND (m.lyDoKhongDat IS NULL OR TRIM(m.lyDoKhongDat) = '')
            """)
    long countKetQuaPassed();


    @Query("""
    SELECT DISTINCT new com.danang.safefood.dto.response.MauSelectResponse(
        m.maMau,
        m.tenMau,
        m.loaiMau,
        cs.tenCoSo
    )
    FROM MauKiemNghiem m
    JOIN MauChiTieu ct
        ON m.maMau = ct.maMau
    LEFT JOIN m.coSoKinhDoanh cs
    WHERE LOWER(ct.ketQua) = 'không đạt'
      AND m.trangThai = 'Có kết quả'
""")
    List<MauSelectResponse> findMauKhongDat();
}
