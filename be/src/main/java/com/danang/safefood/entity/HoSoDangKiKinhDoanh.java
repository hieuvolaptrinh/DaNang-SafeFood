package com.danang.safefood.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

/**
 * Hồ sơ đăng kí kinh doanh = 1 giấy tờ thực tế của CSKD.
 *
 * Quan hệ:
 *  - N-1 với CoSoKinhDoanh (1 cơ sở có nhiều hồ sơ/giấy tờ)
 *  - N-1 với LoaiGiayTo (1 loại giấy tờ có nhiều hồ sơ thuộc loại đó)
 *
 * Logic: Khi 1 cơ sở có đủ 4 hồ sơ (mỗi loại 1 cái, còn hiệu lực)
 *        → đủ điều kiện kinh doanh → trangThaiKinhDoanh = DANG_HOAT_DONG
 */
@Entity
@Table(name = "ho_so_dang_ki_kinh_doanh")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HoSoDangKiKinhDoanh {

    @Id
    @Column(name = "maHoSo", length = 10, nullable = false)
    private String maHoSo;

    @Column(name = "ngayNop")
    private LocalDate ngayNop;

    @Column(name = "trangThai", length = 30)
    private String trangThai;

    @Column(name = "ngayCap")
    private LocalDate ngayCap;

    @Column(name = "ngayHetHan")
    private LocalDate ngayHetHan;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "maCoSo")
    private CoSoKinhDoanh coSoKinhDoanh;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "maLoaiGiayTo")
    private LoaiGiayTo loaiGiayTo;
}
