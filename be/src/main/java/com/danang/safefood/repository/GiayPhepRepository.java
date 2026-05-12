package com.danang.safefood.repository;

import com.danang.safefood.entity.GiayPhep;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GiayPhepRepository extends JpaRepository<GiayPhep, String> {
    List<GiayPhep> findByCoSoKinhDoanh_MaCoSo(String maCoSo);
}
