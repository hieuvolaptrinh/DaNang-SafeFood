package com.danang.safefood.repository;

import com.danang.safefood.entity.MauKiemNghiem;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MauKiemNghiemRepository extends JpaRepository<MauKiemNghiem, String> {

    Page<MauKiemNghiem> findAllByOrderByNgayYeuCauDesc(Pageable pageable);

    Page<MauKiemNghiem> findByTrangThaiOrderByNgayYeuCauDesc(String trangThai, Pageable pageable);
}
