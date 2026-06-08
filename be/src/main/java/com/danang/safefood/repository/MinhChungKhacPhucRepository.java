package com.danang.safefood.repository;

import com.danang.safefood.entity.MinhChungKhacPhuc;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MinhChungKhacPhucRepository extends JpaRepository<MinhChungKhacPhuc, String> {
    List<MinhChungKhacPhuc> findByViPham_MaViPham(String maViPham);
    boolean existsByViPham_MaViPham(String maViPham);
}
