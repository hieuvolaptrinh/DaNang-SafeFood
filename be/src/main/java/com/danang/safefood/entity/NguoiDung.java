
package com.danang.safefood.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Pattern;
import lombok.*;

@Entity
@Table(name = "nguoi_dung", uniqueConstraints = {
        @UniqueConstraint(name = "UQ_NguoiDung_CCCD", columnNames = "CCCD")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NguoiDung {

    @Id
    @Column(name = "maNguoiDung", length = 10, nullable = false)
    private String maNguoiDung;

    @Column(name = "hoTen", length = 100)
    private String hoTen;

    // @Column(name = "email", length = 150, unique = true)
    // private String email;

    // @Column(name = "soDienThoai", length = 20, nullable = false)
    // @Pattern(regexp = "\\d{10}", message = "Số điện thoại phải đúng 10 chữ số")
    // private String soDienThoai;

    @Column(name = "gioiTinh", length = 10)
    private String gioiTinh;

    // @Column(name = "matKhau", length = 255)
    // private String matKhau;

    @Column(name = "CCCD", length = 20, unique = true)
    private String cccd;

    @OneToOne
    @JoinColumn(name = "taiKhoanId", nullable = false)
    private TaiKhoan taiKhoan;
}
