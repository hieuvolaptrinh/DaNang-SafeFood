package com.danang.safefood.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "mau_kiem_nghiem",
        uniqueConstraints = {
                @UniqueConstraint(name = "UQ_MauKiemNghiem_TenMau", columnNames = "tenMau")
        }
)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MauKiemNghiem {

    @Id
    @Column(name = "maMau", length = 10, nullable = false)
    private String maMau;

    @Column(name = "tenMau", length = 200, nullable = false, unique = true)
    private String tenMau;

    @Column(name = "ngayThu", nullable = false)
    private LocalDate ngayThu;

    // CHECK: ngayKiemNghiem >= ngayThu enforced at DB level
    @Column(name = "ngayKiemNghiem")
    private LocalDate ngayKiemNghiem;

    // CHECK: IN ('Chờ xử lý','Chờ xét nghiệm','Đang kiểm nghiệm','Đang xét nghiệm','Hoàn thành','Có kết quả','Hủy')
    @Column(name = "trangThai", length = 30, nullable = false)
    private String trangThai;

    // CHECK: IN ('Thực phẩm','Nước','Môi trường','Khác')
    @Column(name = "loaiMau", length = 50, nullable = false)
    private String loaiMau;

    @Column(name = "noiDung", columnDefinition = "TEXT")
    private String noiDung;

    @Column(name = "ngayYeuCau", nullable = false)
    private LocalDate ngayYeuCau;

    // CHECK: hanHoanThanh >= ngayYeuCau enforced at DB level
    @Column(name = "hanHoanThanh", nullable = false)
    private LocalDate hanHoanThanh;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "maCoSo")
    private CoSoKinhDoanh coSoKinhDoanh;

    @Column(name = "phongLab", length = 255)
    private String phongLab;

    @Column(name = "ketQuaKiemNghiem", columnDefinition = "TEXT")
    private String ketQuaKiemNghiem;

    @Column(name = "lyDoKhongDat", columnDefinition = "TEXT")
    private String lyDoKhongDat;

    @Column(name = "chiTieuKiemDinh", columnDefinition = "TEXT")
    private String chiTieuKiemDinh;

    @Column(name = "fileCoDauMoc", length = 500)
    private String fileCoDauMoc;

    @Column(name = "ngayTao")
    private LocalDate ngayTao;

    @Column(name = "maNguoiTao", length = 10)
    private String maNguoiTao;
}
