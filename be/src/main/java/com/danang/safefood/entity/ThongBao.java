package com.danang.safefood.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "thong_bao")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ThongBao {

    @Id
    @Column(name = "maThongBao", length = 10, nullable = false)
    private String maThongBao;

    @Column(name = "tieuDe", length = 200)
    private String tieuDe;

    @Column(name = "noiDung", columnDefinition = "TEXT")
    private String noiDung;

    @Column(name = "ngayGui")
    private LocalDateTime ngayGui;

    @Column(name = "loaiThongBao", length = 50)
    private String loaiThongBao;

    @Column(name = "isCongDong")
    private Boolean isCongDong;
}
