package com.danang.safefood.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "phan_anh")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PhanAnh {

    @Id
    @Column(name = "maPhanAnh", length = 10, nullable = false)
    private String maPhanAnh;

    @Column(name = "trangThaiPhanAnh", length = 30)
    private String trangThaiPhanAnh;

    @Column(name = "tieuDe", length = 200)
    private String tieuDe;

    @Column(name = "lyDo", columnDefinition = "TEXT")
    private String lyDo;

    @Column(name = "diaDiem", length = 255)
    private String diaDiem;

    @Column(name = "ghiChu", columnDefinition = "TEXT")
    private String ghiChu;

    // CHECK: ngayGui <= GETDATE() enforced at DB level
    @Column(name = "ngayGui")
    private LocalDateTime ngayGui;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "maNguoiPhanAnh")
    private NguoiDung nguoiPhanAnh;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "maCoSo")
    private CoSoKinhDoanh coSoKinhDoanh;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "maLoaiPhanAnh")
    private LoaiPhanAnh loaiPhanAnh;
}
