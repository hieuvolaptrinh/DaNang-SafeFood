package com.danang.safefood.repository;

import com.danang.safefood.entity.LichThanhTraNguoiDung;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface LichThanhTraNguoiDungRepository
        extends JpaRepository<LichThanhTraNguoiDung, LichThanhTraNguoiDung.LichThanhTraNguoiDungId> {

    List<LichThanhTraNguoiDung> findByMaThanhTra(String maThanhTra);

    boolean existsByMaThanhTraAndMaNguoiThanhTra(String maThanhTra, String maNguoiThanhTra);

    @org.springframework.data.jpa.repository.Query("SELECT COUNT(ln) FROM LichThanhTraNguoiDung ln " +
            "WHERE ln.maNguoiThanhTra = :maNguoiThanhTra")
    long countTongSoNhiemVu(@org.springframework.data.repository.query.Param("maNguoiThanhTra") String maNguoiThanhTra);

    @org.springframework.data.jpa.repository.Query("SELECT COUNT(ln) FROM LichThanhTraNguoiDung ln " +
            "WHERE ln.maNguoiThanhTra = :maNguoiThanhTra AND ln.trangThai = :trangThai")
    long countNhiemVuByTrangThai(@org.springframework.data.repository.query.Param("maNguoiThanhTra") String maNguoiThanhTra, 
                                 @org.springframework.data.repository.query.Param("trangThai") String trangThai);

    @Query("""
            SELECT COUNT(ln) FROM LichThanhTraNguoiDung ln
            WHERE ln.maNguoiThanhTra = :maNguoiThanhTra
              AND ln.thoiGianTT >= :fromStart
              AND ln.thoiGianTT < :toEnd
            """)
    long countTrongKhoangThoiGian(
            @Param("maNguoiThanhTra") String maNguoiThanhTra,
            @Param("fromStart") LocalDateTime fromStart,
            @Param("toEnd") LocalDateTime toEnd
    );

    @Query("""
            SELECT COUNT(ln) FROM LichThanhTraNguoiDung ln
            WHERE ln.maNguoiThanhTra = :maNguoiThanhTra
              AND ln.trangThai = :trangThai
              AND ln.thoiGianTT >= :fromStart
              AND ln.thoiGianTT < :toEnd
            """)
    long countTheoTrangThaiTrongKhoangThoiGian(
            @Param("maNguoiThanhTra") String maNguoiThanhTra,
            @Param("trangThai") String trangThai,
            @Param("fromStart") LocalDateTime fromStart,
            @Param("toEnd") LocalDateTime toEnd
    );

    @Query("""
            SELECT COUNT(ln) FROM LichThanhTraNguoiDung ln
            WHERE ln.maNguoiThanhTra = :maNguoiThanhTra
              AND ln.thoiGianTT >= :fromStart
              AND ln.thoiGianTT < :toEnd
              AND ln.thoiGianTT >= :now
              AND (ln.trangThai IS NULL OR ln.trangThai <> :hoanThanh)
            """)
    long countDangLenLichTrongThang(
            @Param("maNguoiThanhTra") String maNguoiThanhTra,
            @Param("fromStart") LocalDateTime fromStart,
            @Param("toEnd") LocalDateTime toEnd,
            @Param("now") LocalDateTime now,
            @Param("hoanThanh") String hoanThanh
    );

    @Query("""
            SELECT COUNT(ln) FROM LichThanhTraNguoiDung ln
            WHERE ln.maNguoiThanhTra = :maNguoiThanhTra
              AND ln.thoiGianTT >= :fromStart
              AND ln.thoiGianTT < :toEnd
              AND ln.thoiGianTT < :now
              AND (ln.trangThai IS NULL OR ln.trangThai <> :hoanThanh)
            """)
    long countQuaHanTrongThang(
            @Param("maNguoiThanhTra") String maNguoiThanhTra,
            @Param("fromStart") LocalDateTime fromStart,
            @Param("toEnd") LocalDateTime toEnd,
            @Param("now") LocalDateTime now,
            @Param("hoanThanh") String hoanThanh
    );

    @Query("""
            SELECT ln FROM LichThanhTraNguoiDung ln
            LEFT JOIN FETCH ln.lichThanhTra l
            LEFT JOIN FETCH l.coSoKinhDoanh c
            WHERE ln.maNguoiThanhTra = :maNguoiThanhTra
              AND ln.thoiGianTT >= :fromStart
              AND ln.thoiGianTT < :toEnd
            ORDER BY ln.thoiGianTT ASC
            """)
    List<LichThanhTraNguoiDung> findDashboardItemsTrongKhoangThoiGian(
            @Param("maNguoiThanhTra") String maNguoiThanhTra,
            @Param("fromStart") LocalDateTime fromStart,
            @Param("toEnd") LocalDateTime toEnd,
            org.springframework.data.domain.Pageable pageable
    );

    @org.springframework.data.jpa.repository.Query(
            value = "SELECT ln FROM LichThanhTraNguoiDung ln " +
                    "LEFT JOIN FETCH ln.lichThanhTra l " +
                    "LEFT JOIN FETCH l.coSoKinhDoanh c " +
                    "LEFT JOIN FETCH l.nguoiPhuTrach n " +
                    "WHERE ln.maNguoiThanhTra = :maNguoiThanhTra " +
                    "AND (:trangThai IS NULL OR ln.trangThai = :trangThai) " +
                    "AND (:keyword IS NULL OR " +
                    "     LOWER(CAST(l.maThanhTra AS String)) LIKE LOWER(CONCAT('%', CAST(:keyword AS String), '%')) OR " +
                    "     LOWER(CAST(c.tenCoSo AS String)) LIKE LOWER(CONCAT('%', CAST(:keyword AS String), '%'))) " +
                    "ORDER BY ln.thoiGianTT DESC",
            countQuery = "SELECT COUNT(ln) FROM LichThanhTraNguoiDung ln " +
                    "LEFT JOIN ln.lichThanhTra l " +
                    "LEFT JOIN l.coSoKinhDoanh c " +
                    "WHERE ln.maNguoiThanhTra = :maNguoiThanhTra " +
                    "AND (:trangThai IS NULL OR ln.trangThai = :trangThai) " +
                    "AND (:keyword IS NULL OR " +
                    "     LOWER(CAST(l.maThanhTra AS String)) LIKE LOWER(CONCAT('%', CAST(:keyword AS String), '%')) OR " +
                    "     LOWER(CAST(c.tenCoSo AS String)) LIKE LOWER(CONCAT('%', CAST(:keyword AS String), '%')))"
    )
    org.springframework.data.domain.Page<LichThanhTraNguoiDung> searchNhiemVu(
            @org.springframework.data.repository.query.Param("maNguoiThanhTra") String maNguoiThanhTra,
            @org.springframework.data.repository.query.Param("keyword") String keyword,
            @org.springframework.data.repository.query.Param("trangThai") String trangThai,
            org.springframework.data.domain.Pageable pageable);
}
