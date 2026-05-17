package com.danang.safefood.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * Bảng danh mục loại giấy tờ.
 * Có 4 loại cố định:
 *  - HOP_DONG_THUE_MAT_BANG
 *  - GIAY_PHEP_ATTP
 *  - GIAY_TO_PCCC
 *  - GIAY_PHEP_KINH_DOANH
 *
 * Quan hệ: 1 LoaiGiayTo → nhiều HoSoDangKiKinhDoanh
 */
@Entity
@Table(name = "loai_giay_to")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoaiGiayTo {

    @Id
    @Column(name = "maLoaiGiayTo", length = 30, nullable = false)
    private String maLoaiGiayTo;

    @Column(name = "tenLoaiGiayTo", length = 100)
    private String tenLoaiGiayTo;

    @Column(name = "moTa", length = 255)
    private String moTa;
}
