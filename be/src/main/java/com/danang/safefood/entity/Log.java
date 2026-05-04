package com.danang.safefood.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "Log")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Log {

    @Id
    @Column(name = "maLog", length = 10, nullable = false)
    private String maLog;

    @Column(name = "ip", length = 50, nullable = false)
    private String ip;

    @Column(name = "time", nullable = false)
    private LocalDateTime time;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "maNguoiDung", nullable = false)
    private NguoiDung nguoiDung;
}

