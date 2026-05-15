package com.danang.safefood.repository;

import com.danang.safefood.entity.HinhThucKhacPhuc;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HinhThucKhacPhucRepository extends JpaRepository<HinhThucKhacPhuc, String> {
    List<HinhThucKhacPhuc> findByViPham_MaViPham(String maViPham);
}
