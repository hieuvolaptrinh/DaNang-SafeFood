package com.danang.safefood.repository;

import com.danang.safefood.util.TrangThaiViPham;
import com.danang.safefood.entity.ViPham;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ViPhamRepository extends JpaRepository<ViPham, String> {

    Page<ViPham> findByHoSoThanhTra_MaHoSoOrderByMaViPhamDesc(String maHoSo, Pageable pageable);

    Page<ViPham> findByTrangThaiPheDuyetOrderByMaViPhamDesc(TrangThaiViPham trangThaiPheDuyet, Pageable pageable);

    Page<ViPham> findAllByOrderByMaViPhamDesc(Pageable pageable);
    
    Integer countByCoSoKinhDoanh_MaCoSo(String maCoSo);

    /** Fetch vi phạm + hình thức khắc phục (tránh LazyInitializationException) */
    @Query("SELECT DISTINCT v FROM ViPham v LEFT JOIN FETCH v.hinhThucKhacPhucList LEFT JOIN FETCH v.loaiViPham LEFT JOIN FETCH v.coSoKinhDoanh LEFT JOIN FETCH v.hoSoThanhTra WHERE v.coSoKinhDoanh.maCoSo IN :coSoIds")
    List<ViPham> findByCoSoIdsWithDetails(@Param("coSoIds") List<String> coSoIds);

    /** Fetch 1 vi phạm với đầy đủ quan hệ */
    @Query("SELECT v FROM ViPham v LEFT JOIN FETCH v.hinhThucKhacPhucList LEFT JOIN FETCH v.loaiViPham LEFT JOIN FETCH v.coSoKinhDoanh LEFT JOIN FETCH v.hoSoThanhTra WHERE v.maViPham = :id")
    Optional<ViPham> findByIdWithDetails(@Param("id") String id);
}
