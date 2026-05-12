package com.danang.safefood.repository;

import com.danang.safefood.entity.ThongBaoNguoiDung;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ThongBaoNguoiDungRepository
        extends JpaRepository<ThongBaoNguoiDung, ThongBaoNguoiDung.ThongBaoNguoiDungId> {

    @Query("SELECT tbnd FROM ThongBaoNguoiDung tbnd " +
            "JOIN FETCH tbnd.thongBao tb " +
            "WHERE tbnd.maNguoiDung = :maNguoiDung " +
            "ORDER BY tb.ngayGui DESC")
    List<ThongBaoNguoiDung> findByMaNguoiDungWithThongBao(@Param("maNguoiDung") String maNguoiDung);
}
