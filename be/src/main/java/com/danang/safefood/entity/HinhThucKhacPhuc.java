package com.danang.safefood.entity;

import com.danang.safefood.util.TrangThaiKhacPhuc;
import com.danang.safefood.util.TrangThaiKhacPhucConverter;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "hinh_thuc_khac_phuc")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HinhThucKhacPhuc {

    @Id
    @Column(name = "maHinhThucKhacPhuc", length = 10, nullable = false)
    private String maHinhThucKhacPhuc;

    @Column(name = "soTienKhacPhuc", nullable = false, precision = 18, scale = 2)
    private BigDecimal soTienKhacPhuc;

    @Convert(converter = TrangThaiKhacPhucConverter.class)
    @Column(name = "tinhTrangKhacPhuc", length = 50, nullable = false)
    @Builder.Default
    private TrangThaiKhacPhuc tinhTrangKhacPhuc = TrangThaiKhacPhuc.CHUA_KHAC_PHUC;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "maViPham")
    private ViPham viPham;
}
