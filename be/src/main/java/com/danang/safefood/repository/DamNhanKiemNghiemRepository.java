package com.danang.safefood.repository;

import com.danang.safefood.entity.DamNhanKiemNghiem;
import com.danang.safefood.entity.DamNhanKiemNghiemId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;

public interface DamNhanKiemNghiemRepository extends JpaRepository<DamNhanKiemNghiem, DamNhanKiemNghiemId> {

    @Query(
            value = """
                    SELECT d
                    FROM DamNhanKiemNghiem d
                    JOIN d.mauKiemNghiem m
                    LEFT JOIN m.coSoKinhDoanh c
                    WHERE (:keyword IS NULL OR :keyword = ''
                           OR LOWER(CONCAT('YC-', d.id.maMau, '-', d.id.maNguoiKiemNghiem)) LIKE LOWER(CONCAT('%', :keyword, '%'))
                           OR LOWER(COALESCE(c.tenCoSo, '')) LIKE LOWER(CONCAT('%', :keyword, '%')))
                      AND (:statusesEmpty = true OR m.trangThai IN :statuses)
                    ORDER BY m.ngayYeuCau DESC, d.id.maMau DESC
                    """,
            countQuery = """
                    SELECT COUNT(d)
                    FROM DamNhanKiemNghiem d
                    JOIN d.mauKiemNghiem m
                    LEFT JOIN m.coSoKinhDoanh c
                    WHERE (:keyword IS NULL OR :keyword = ''
                           OR LOWER(CONCAT('YC-', d.id.maMau, '-', d.id.maNguoiKiemNghiem)) LIKE LOWER(CONCAT('%', :keyword, '%'))
                           OR LOWER(COALESCE(c.tenCoSo, '')) LIKE LOWER(CONCAT('%', :keyword, '%')))
                      AND (:statusesEmpty = true OR m.trangThai IN :statuses)
                    """
    )
    Page<DamNhanKiemNghiem> search(
            @Param("keyword") String keyword,
            @Param("statuses") List<String> statuses,
            @Param("statusesEmpty") boolean statusesEmpty,
            Pageable pageable
    );

    boolean existsByIdMaNguoiKiemNghiemAndIdMaMau(String maNguoiKiemNghiem, String maMau);

    boolean existsByIdMaMau(String maMau);

    long countByMauKiemNghiem_TrangThaiIn(Collection<String> trangThais);
}
