package com.danang.safefood.repository;

import com.danang.safefood.entity.LichThanhTraNguoiDung;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LichThanhTraNguoiDungRepository
        extends JpaRepository<LichThanhTraNguoiDung, LichThanhTraNguoiDung.LichThanhTraNguoiDungId> {

    List<LichThanhTraNguoiDung> findByMaThanhTra(String maThanhTra);

    boolean existsByMaThanhTraAndMaNguoiThanhTra(String maThanhTra, String maNguoiThanhTra);
}
