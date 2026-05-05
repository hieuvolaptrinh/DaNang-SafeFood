package com.danang.safefood.repository;

import com.danang.safefood.entity.XuPhat;
import com.danang.safefood.entity.TrangThaiXuPhat;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;

public interface XuPhatRepository extends JpaRepository<XuPhat, String> {
    Page<XuPhat> findAllByOrderByCreatedAtDesc(Pageable pageable);
    Page<XuPhat> findByTrangThaiOrderByCreatedAtDesc(TrangThaiXuPhat trangThai, Pageable pageable);
    Page<XuPhat> findByNgayXuPhatBetweenOrderByNgayXuPhatDesc(LocalDate from, LocalDate to, Pageable pageable);
    long countByTrangThai(TrangThaiXuPhat trangThai);
}
