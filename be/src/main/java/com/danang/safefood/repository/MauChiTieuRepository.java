package com.danang.safefood.repository;

import com.danang.safefood.entity.MauChiTieu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MauChiTieuRepository extends JpaRepository<MauChiTieu, MauChiTieu.MauChiTieuId> {

    List<MauChiTieu> findByMaMau(String maMau);

    @Modifying
    @Query("""
            UPDATE MauChiTieu m
            SET m.giaTriDo = :giaTriDo,
                m.gioiHanChoPhep = :gioiHanChoPhep,
                m.ketQua = :ketQua
            WHERE m.maMau = :maMau AND m.maChiTieu = :maChiTieu
            """)
    int updateKetQua(@Param("maMau") String maMau,
                     @Param("maChiTieu") String maChiTieu,
                     @Param("giaTriDo") String giaTriDo,
                     @Param("gioiHanChoPhep") String gioiHanChoPhep,
                     @Param("ketQua") String ketQua);
}
