package com.danang.safefood.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "loai_phan_anh")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoaiPhanAnh {

    @Id
    @Column(name = "maLoaiPhanAnh", length = 10, nullable = false)
    private String maLoaiPhanAnh;

    @Column(name = "tenLoaiPhanAnh", length = 100)
    private String tenLoaiPhanAnh;
}
