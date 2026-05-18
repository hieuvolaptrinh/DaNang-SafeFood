package com.danang.safefood.repository;

import com.danang.safefood.entity.HoSoDangKiKinhDoanh;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

/**
 * Repository cho hồ sơ đăng kí kinh doanh (giấy tờ thực tế của CSKD).
 * Giữ tên cũ GiayPhepRepository để không ảnh hưởng nhiều file inject.
 */
public interface GiayPhepRepository extends JpaRepository<HoSoDangKiKinhDoanh, String> {

    /** Tìm tất cả hồ sơ/giấy tờ của 1 cơ sở */
    List<HoSoDangKiKinhDoanh> findByCoSoKinhDoanh_MaCoSoOrderByNgayNopDesc(String maCoSo);

    /** Tìm tất cả hồ sơ/giấy tờ của CSKD (qua chủ sở hữu) */
    List<HoSoDangKiKinhDoanh> findByCoSoKinhDoanh_ChuSoHuu_TaiKhoan_IdOrderByNgayNopDesc(Long taiKhoanId);

    /** Đếm số loại giấy tờ khác nhau mà 1 cơ sở đã nộp */
    @Query("SELECT COUNT(DISTINCT h.loaiGiayTo.maLoaiGiayTo) FROM HoSoDangKiKinhDoanh h WHERE h.coSoKinhDoanh.maCoSo = :maCoSo")
    long countDistinctLoaiGiayToByCoSo(@Param("maCoSo") String maCoSo);

    List<HoSoDangKiKinhDoanh> findByCoSoKinhDoanh_MaCoSo(String maCoSo);
    @Query("""
    SELECT g FROM HoSoDangKiKinhDoanh g
    LEFT JOIN FETCH g.coSoKinhDoanh c
    LEFT JOIN FETCH c.phuongXa p
    WHERE g.ngayHetHan <= :ngayCanhBao
      AND g.ngayHetHan >= :ngayBatDau
    ORDER BY g.ngayHetHan ASC
    """)
    List<HoSoDangKiKinhDoanh> findGiayPhepSapHetHan(
            @Param("ngayCanhBao") LocalDate ngayCanhBao,
            @Param("ngayBatDau") LocalDate ngayBatDau);


}
