package com.danang.safefood.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "ho_so_kinh_doanh")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HoSoDangKiKinhDoanh {

    @Id
    @Column(name = "maHoSo", length = 10, nullable = false)
    private String maHoSo;

    // ngayNop <= GETDATE() enforced at DB level
    @Column(name = "ngayNop")
    private LocalDate ngayNop;

    @Column(name = "trangThai", length = 30)
    private String trangThai;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "maCoSo")
    private CoSoKinhDoanh coSoKinhDoanh;
}

