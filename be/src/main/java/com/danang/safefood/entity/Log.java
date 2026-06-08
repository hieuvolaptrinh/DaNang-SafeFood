package com.danang.safefood.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "log")
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

    private String location;

    private String device;

    private Boolean isAbnormal; // trạng thái phiên đăng nhập này có bất thường ko

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "maNguoiDung", nullable = false)
    private NguoiDung nguoiDung;

}
