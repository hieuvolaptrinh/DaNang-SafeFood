package com.danang.safefood.repository;

import com.danang.safefood.entity.FileDinhKem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FileDinhKemRepository extends JpaRepository<FileDinhKem, String> {
    List<FileDinhKem> findByPhanAnh_MaPhanAnh(String maPhanAnh);
}
