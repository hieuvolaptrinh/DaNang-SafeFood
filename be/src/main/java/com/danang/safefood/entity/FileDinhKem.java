package com.danang.safefood.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "file_dinh_kem")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FileDinhKem {

    @Id
    @Column(name = "maFile", length = 10, nullable = false)
    private String maFile;

    @Column(name = "loaiFile", length = 50)
    private String loaiFile;

    @Column(name = "thoiGianGui")
    private LocalDateTime thoiGianGui;

    @Column(name = "urlFile")
    private String urlFile;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "maMinhChung")
    private MinhChungKhacPhuc minhChungKhacPhuc;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "maPhanAnh")
    private PhanAnh phanAnh;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "maKhieuNai")
    private KhieuNai khieuNai;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "maThongBao")
    private ThongBao thongBao;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "maHoSoDangKiKinhDoanh")
    private HoSoDangKiKinhDoanh hoSoDangKiKinhDoanh;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "maTinhTrangKhacPhuc")
    private HinhThucKhacPhuc hinhThucKhacPhuc;
}
