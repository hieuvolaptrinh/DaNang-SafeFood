package com.danang.safefood.repository;

import com.danang.safefood.util.TrangThaiViPham;
import com.danang.safefood.entity.ViPham;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ViPhamRepository extends JpaRepository<ViPham, String> {

    Page<ViPham> findByHoSoThanhTra_MaHoSoOrderByMaViPhamDesc(String maHoSo, Pageable pageable);

    Page<ViPham> findByTrangThaiPheDuyetOrderByMaViPhamDesc(TrangThaiViPham trangThaiPheDuyet, Pageable pageable);

    Page<ViPham> findAllByOrderByMaViPhamDesc(Pageable pageable);
    
    Integer countByCoSoKinhDoanh_MaCoSo(String maCoSo);
}
