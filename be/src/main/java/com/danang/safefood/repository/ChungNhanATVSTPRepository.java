package com.danang.safefood.repository;

import com.danang.safefood.entity.ChungNhanATVSTP;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface ChungNhanATVSTPRepository extends JpaRepository<ChungNhanATVSTP, String> {

    Page<ChungNhanATVSTP> findAllByOrderByNgayBanHanhDesc(Pageable pageable);

    Page<ChungNhanATVSTP> findByTrangThaiOrderByNgayBanHanhDesc(String trangThai, Pageable pageable);

    List<ChungNhanATVSTP> findByCoSoKinhDoanh_MaCoSo(String maCoSo);

    long countByTrangThai(String trangThai);

    /** Chứng nhận sắp hết hạn */
    List<ChungNhanATVSTP> findByNgayHetHanBetweenAndTrangThai(LocalDate from, LocalDate to, String trangThai);
}
