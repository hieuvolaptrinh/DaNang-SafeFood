package com.danang.safefood.repository;

import com.danang.safefood.entity.CoSoKinhDoanh;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

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

    @Query("SELECT c FROM CoSoKinhDoanh c LEFT JOIN FETCH c.phuongXa LEFT JOIN FETCH c.viPhamList")
    List<CoSoKinhDoanh> findAllWithPhuongXa();

    @Query("""
            SELECT c FROM CoSoKinhDoanh c
            LEFT JOIN c.phuongXa px
            WHERE (:keyword IS NULL OR :keyword = '' 
                   OR LOWER(c.tenCoSo) LIKE LOWER(CONCAT('%', :keyword, '%'))
                   OR LOWER(c.soGiayPhep) LIKE LOWER(CONCAT('%', :keyword, '%')))
              AND (:trangThai IS NULL OR :trangThai = '' OR c.trangThai = :trangThai)
              AND (:maPX IS NULL OR :maPX = '' OR px.maPX = :maPX)
            ORDER BY c.tenCoSo ASC
            """)
    Page<CoSoKinhDoanh> searchWithFilters(
            @Param("keyword") String keyword,
            @Param("trangThai") String trangThai,
            @Param("maPX") String maPX,
            Pageable pageable
    );

    long countByTrangThai(String trangThai);

    java.util.List<CoSoKinhDoanh> findByChuSoHuu_TaiKhoan_Id(Long taiKhoanId);


    @Query(value = """
    SELECT * FROM co_so_kinh_doanh c 
    WHERE (:keyword IS NULL 
           OR LOWER(COALESCE(CAST(c.tencoso AS text), '')) LIKE LOWER(CONCAT('%', COALESCE(:keyword, ''), '%')) 
           OR LOWER(COALESCE(CAST(c.macoso AS text), '')) LIKE LOWER(CONCAT('%', COALESCE(:keyword, ''), '%')))
      AND (:trangThai IS NULL OR c.trangthai = :trangThai)
    ORDER BY c.tencoso ASC
    """, nativeQuery = true)
    List<CoSoKinhDoanh> findForDropdown(
            @Param("keyword") String keyword,
            @Param("trangThai") String trangThai
    );
}
