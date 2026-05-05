package com.danang.safefood.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "chung_nhanatvstp")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChungNhanATVSTP {

    @Id
    @Column(name = "maCN", length = 10, nullable = false)
    private String maCN;

    @Column(name = "tenChungNhan", length = 200)
    private String tenChungNhan;

    // CHECK: ngayBanHanh < ngayHetHan enforced at DB level
    @Column(name = "ngayBanHanh", nullable = false)
    private LocalDate ngayBanHanh;

    @Column(name = "ngayHetHan", nullable = false)
    private LocalDate ngayHetHan;

    @Column(name = "trangThai", length = 30)
    private String trangThai;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "maCoSoKinhDoanh")
    private CoSoKinhDoanh coSoKinhDoanh;
}
