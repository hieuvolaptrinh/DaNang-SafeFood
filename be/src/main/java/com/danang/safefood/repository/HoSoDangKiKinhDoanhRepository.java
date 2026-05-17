package com.danang.safefood.repository;

import com.danang.safefood.entity.HoSoDangKiKinhDoanh;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HoSoDangKiKinhDoanhRepository extends JpaRepository<HoSoDangKiKinhDoanh, String> {
    List<HoSoDangKiKinhDoanh> findByCoSoKinhDoanh_MaCoSoOrderByNgayNopDesc(String maCoSo);

    List<HoSoDangKiKinhDoanh> findByCoSoKinhDoanh_ChuSoHuu_TaiKhoan_IdOrderByNgayNopDesc(Long taiKhoanId);
}
