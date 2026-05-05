package com.danang.safefood.entity;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;

@Entity
@Table(name = "co_so_loai_hinh")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@IdClass(CoSoLoaiHinh.CoSoLoaiHinhId.class)
public class CoSoLoaiHinh {

    @Id
    @Column(name = "maCoSo", length = 10, nullable = false)
    private String maCoSo;

    @Id
    @Column(name = "maLoaiHinhKinhDoanh", length = 10, nullable = false)
    private String maLoaiHinhKinhDoanh;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "maCoSo", insertable = false, updatable = false)
    private CoSoKinhDoanh coSoKinhDoanh;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "maLoaiHinhKinhDoanh", insertable = false, updatable = false)
    private LoaiHinhKinhDoanh loaiHinhKinhDoanh;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CoSoLoaiHinhId implements Serializable {
        private String maCoSo;
        private String maLoaiHinhKinhDoanh;
    }
}