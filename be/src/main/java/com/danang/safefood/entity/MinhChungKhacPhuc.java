package com.danang.safefood.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "minh_chung_khac_phuc")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MinhChungKhacPhuc {

    @Id
    @Column(name = "maMinhChung", length = 10, nullable = false)
    private String maMinhChung;

    @Column(name = "thoiGianGui")
    private LocalDateTime thoiGianGui;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "maViPham")
    private ViPham viPham;

    @OneToMany(mappedBy = "minhChungKhacPhuc", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private java.util.List<FileDinhKem> fileDinhKems = new java.util.ArrayList<>();
}
