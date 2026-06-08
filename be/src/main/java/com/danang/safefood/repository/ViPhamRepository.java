package com.danang.safefood.repository;

import com.danang.safefood.util.TrangThaiViPham;
import com.danang.safefood.entity.ViPham;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
public interface ViPhamRepository extends JpaRepository<ViPham, String> {

    Page<ViPham> findByHoSoThanhTra_MaHoSoOrderByMaViPhamDesc(String maHoSo, Pageable pageable);

    Page<ViPham> findByTrangThaiPheDuyetOrderByMaViPhamDesc(TrangThaiViPham trangThaiPheDuyet, Pageable pageable);

    Page<ViPham> findAllByOrderByMaViPhamDesc(Pageable pageable);

    Integer countByCoSoKinhDoanh_MaCoSo(String maCoSo);
    
    List<ViPham> findByCoSoKinhDoanh_MaCoSo(String maCoSo);
    
    /** Fetch vi phạm + hình thức khắc phục (tránh LazyInitializationException) */
    @Query("SELECT DISTINCT v FROM ViPham v LEFT JOIN FETCH v.hinhThucKhacPhucList LEFT JOIN FETCH v.loaiViPham LEFT JOIN FETCH v.coSoKinhDoanh LEFT JOIN FETCH v.hoSoThanhTra WHERE v.coSoKinhDoanh.maCoSo IN :coSoIds")
    List<ViPham> findByCoSoIdsWithDetails(@Param("coSoIds") List<String> coSoIds);

    /** Fetch 1 vi phạm với đầy đủ quan hệ */
    @Query("SELECT v FROM ViPham v LEFT JOIN FETCH v.hinhThucKhacPhucList LEFT JOIN FETCH v.loaiViPham LEFT JOIN FETCH v.coSoKinhDoanh LEFT JOIN FETCH v.hoSoThanhTra WHERE v.maViPham = :id")
    Optional<ViPham> findByIdWithDetails(@Param("id") String id);
    // Thêm 2 method riêng biệt để tránh null parameter

    @Query(nativeQuery = true, value = """
    SELECT vp.* FROM vi_pham vp
    LEFT JOIN ho_so_thanh_tra hstt ON hstt.maHoSo = vp.maHoSo
    WHERE hstt.thoiGianKiemTra >= :fromStart 
      AND hstt.thoiGianKiemTra < :toEnd
    """)
    List<ViPham> findViPhamByThoiGianKiemTraBetween(
            @Param("fromStart") LocalDateTime fromStart,
            @Param("toEnd") LocalDateTime toEnd);

    @Query(nativeQuery = true, value = """
    SELECT vp.* FROM vi_pham vp
    LEFT JOIN ho_so_thanh_tra hstt ON hstt.maHoSo = vp.maHoSo
    """)
    List<ViPham> findAllViPham();

    @Query("""
    SELECT vp FROM ViPham vp
    LEFT JOIN FETCH vp.coSoKinhDoanh cs
    LEFT JOIN FETCH vp.loaiViPham lv
    LEFT JOIN FETCH vp.hoSoThanhTra ht
    ORDER BY ht.thoiGianKiemTra DESC NULLS LAST
    """)
    Page<ViPham> findRecentViPham(Pageable pageable);

    @Query("""
            SELECT COUNT(vp) FROM ViPham vp
            JOIN vp.hoSoThanhTra hs
            JOIN hs.lichThanhTra ltt
            WHERE EXISTS (
                SELECT 1 FROM LichThanhTraNguoiDung ln
                WHERE ln.maThanhTra = ltt.maThanhTra
                  AND ln.maNguoiThanhTra = :maNguoiThanhTra
                  AND ln.thoiGianTT >= :fromStart
                  AND ln.thoiGianTT < :toEnd
            )
            """)
    long countViPhamTheoCanBoTrongKhoangThoiGian(
            @Param("maNguoiThanhTra") String maNguoiThanhTra,
            @Param("fromStart") LocalDateTime fromStart,
            @Param("toEnd") LocalDateTime toEnd
    );
}
