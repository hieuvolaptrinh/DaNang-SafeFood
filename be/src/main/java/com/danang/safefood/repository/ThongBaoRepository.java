package com.danang.safefood.repository;

import com.danang.safefood.entity.ThongBao;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ThongBaoRepository extends JpaRepository<ThongBao, String> {

    Page<ThongBao> findAllByOrderByNgayGuiDesc(Pageable pageable);

    Page<ThongBao> findByLoaiThongBaoOrderByNgayGuiDesc(String loaiThongBao, Pageable pageable);

    Page<ThongBao> findByIsCongDongOrderByNgayGuiDesc(Boolean isCongDong, Pageable pageable);
}
