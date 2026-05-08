package com.danang.safefood.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "giay_phep",
        uniqueConstraints = {
                @UniqueConstraint(name = "UQ_GiayPhep_CoSo_Loai", columnNames = {"maCoSo", "loaiGiayPhep"})
        }
)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GiayPhep {

    @Id
    @Column(name = "maGiayPhep", length = 10, nullable = false)
    private String maGiayPhep;

    @Column(name = "loaiGiayPhep", length = 100)
    private String loaiGiayPhep;

    @Column(name = "trangThai", length = 30)
    private String trangThai;

    // CHECK: ngayCap < ngayHetHan enforced at DB level
    @Column(name = "ngayCap", nullable = false)
    private LocalDate ngayCap;

    @Column(name = "ngayHetHan", nullable = false)
    private LocalDate ngayHetHan;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "maCoSo")
    private CoSoKinhDoanh coSoKinhDoanh;
}
