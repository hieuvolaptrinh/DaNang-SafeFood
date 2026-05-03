package com.danang.safefood.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "QuyenHan")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuyenHan {

    @Id
    @Column(name = "maQuyenHan", length = 20, nullable = false)
    private String maQuyenHan;

    @Column(name = "quyenHan", length = 100, nullable = false)
    private String quyenHan;
}