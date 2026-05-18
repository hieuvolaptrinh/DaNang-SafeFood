package com.danang.safefood.entity;

import com.danang.safefood.util.TrangThaiKinhDoanh;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "co_so_kinh_doanh", uniqueConstraints = {
        @UniqueConstraint(name = "UQ_CoSo_SoGiayPhep", columnNames = "soGiayPhep")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CoSoKinhDoanh {

    @Id
    @Column(name = "maCoSo", length = 10, nullable = false)
    private String maCoSo;

    @Column(name = "tenCoSo", length = 200)
    private String tenCoSo;

    @Column(name = "soGiayPhep", length = 50, unique = true)
    private String soGiayPhep;

    @Column(name = "ngayHetHanGiayPhep")
    private LocalDate ngayHetHanGiayPhep;

    /**
     * Trạng thái legacy (chuỗi tự do) — giữ cho tương thích ngược với data cũ.
     */
    @Column(name = "trangThai", length = 30, nullable = false)
    @Builder.Default
    private String trangThai = "Hoat dong";

    /**
     * Trạng thái kinh doanh (enum) — quyết định CSKD có được kinh doanh không.
     * Phải đủ 4 loại giấy tờ và được duyệt → DANG_HOAT_DONG.
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "trangThaiKinhDoanh", length = 30, nullable = false)
    @Builder.Default
    private TrangThaiKinhDoanh trangThaiKinhDoanh = TrangThaiKinhDoanh.DANG_DOI_PHE_DUYET;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "maChuSoHuu")
    private NguoiDung chuSoHuu;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "maPX")
    private PhuongXa phuongXa;

    /** Self-reference: trụ sở chính */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "maCoSoTrue")
    private CoSoKinhDoanh coSoTruSo;

    @OneToMany(mappedBy = "coSoKinhDoanh", fetch = FetchType.LAZY)
    @Builder.Default
    private List<ViPham> viPhamList = new ArrayList<>();

    @Column(name = "anhBia")
    private String anhBia;
}
