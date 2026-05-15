package com.danang.safefood.entity;

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

        @Column(name = "trangThai", length = 30, nullable = false)
        @Builder.Default
        private String trangThai = "Hoat dong";

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "maChuSoHuu")
        private NguoiDung chuSoHuu;

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "maPX")
        private PhuongXa phuongXa;

        // Self-reference: trụ sở chính
        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "maCoSoTrue")
        private CoSoKinhDoanh coSoTruSo;

        @OneToMany(mappedBy = "coSoKinhDoanh", fetch = FetchType.LAZY)
        @Builder.Default
        private List<ViPham> viPhamList = new ArrayList<>();

        private String anhBia;
}
