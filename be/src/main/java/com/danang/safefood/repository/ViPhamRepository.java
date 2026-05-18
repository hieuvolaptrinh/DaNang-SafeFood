package com.danang.safefood.repository;

import com.danang.safefood.util.TrangThaiViPham;
import com.danang.safefood.entity.ViPham;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface ViPhamRepository extends JpaRepository<ViPham, String> {

    Page<ViPham> findByHoSoThanhTra_MaHoSoOrderByMaViPhamDesc(String maHoSo, Pageable pageable);

    Page<ViPham> findByTrangThaiPheDuyetOrderByMaViPhamDesc(TrangThaiViPham trangThaiPheDuyet, Pageable pageable);

    Page<ViPham> findAllByOrderByMaViPhamDesc(Pageable pageable);

    Integer countByCoSoKinhDoanh_MaCoSo(String maCoSo);

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
}
