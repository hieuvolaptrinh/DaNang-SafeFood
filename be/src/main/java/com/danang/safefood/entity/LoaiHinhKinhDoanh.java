package com.danang.safefood.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "LoaiHinhKinhDoanh")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoaiHinhKinhDoanh {

    @Id
    @Column(name = "maLoaiHinhKinhDoanh", length = 10, nullable = false)
    private String maLoaiHinhKinhDoanh;

    @Column(name = "tenLoaiHinhKinhDoanh", length = 100)
    private String tenLoaiHinhKinhDoanh;

    @Column(name = "moTa", columnDefinition = "TEXT")
    private String moTa;
}