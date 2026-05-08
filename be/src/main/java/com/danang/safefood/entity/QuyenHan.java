package com.danang.safefood.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "quyen_han")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuyenHan {

    @Id
    @Column(name = "ma_quyen_han", length = 20, nullable = false)  // ← Đổi thành snake_case
    private String maQuyenHan;

    @Column(name = "quyen_han", length = 100, nullable = false)
    private String quyenHan;
}