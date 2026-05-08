package com.danang.safefood.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "phuong_xa")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PhuongXa {

    @Id
    @Column(name = "maPX", length = 10, nullable = false)
    private String maPX;

    @Column(name = "TenPhuongXa", length = 100)
    private String tenPhuongXa;
}
