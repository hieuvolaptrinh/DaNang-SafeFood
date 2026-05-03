package com.danang.safefood.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "LoaiViPham")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoaiViPham {

    @Id
    @Column(name = "maLoaiViPham", length = 10, nullable = false)
    private String maLoaiViPham;

    @Column(name = "tenLoaiViPham", length = 100)
    private String tenLoaiViPham;

    @Column(name = "moTaThem", columnDefinition = "TEXT")
    private String moTaThem;
}
