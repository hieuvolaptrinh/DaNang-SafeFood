package com.danang.safefood.repository;

import com.danang.safefood.entity.ThongBao;
import com.danang.safefood.util.LoaiThongBaoEnum;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ThongBaoRepository extends JpaRepository<ThongBao, String> {

    Page<ThongBao> findAllByOrderByNgayGuiDesc(Pageable pageable);

    Page<ThongBao> findByLoaiThongBaoOrderByNgayGuiDesc(LoaiThongBaoEnum loaiThongBao, Pageable pageable);

    Page<ThongBao> findByIsCongDongOrderByNgayGuiDesc(Boolean isCongDong, Pageable pageable);

    /** Lấy tất cả thông báo cộng đồng, sắp xếp ngày gửi giảm dần */
    List<ThongBao> findByIsCongDongTrueOrderByNgayGuiDesc();
}
