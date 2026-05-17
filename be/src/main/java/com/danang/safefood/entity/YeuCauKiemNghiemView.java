package com.danang.safefood.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDate;

@Entity
@Table(name = "yeu_cau_kiem_nghiem_view")
public class YeuCauKiemNghiemView {

    @Id
    @Column(name = "maYeuCau")
    private String maYeuCau;

    @Column(name = "maMau")
    private String maMau;

    @Column(name = "maNguoiKiem")
    private String maNguoiKiem;

    @Column(name = "maCoSo")
    private String maCoSo;

    @Column(name = "tenCoSo")
    private String tenCoSo;

    @Column(name = "loaiMau")
    private String loaiMau;

    @Column(name = "ngayYeuCau")
    private LocalDate ngayYeuCau;

    @Column(name = "hanHoanThanh")
    private LocalDate hanHoanThanh;

    @Column(name = "trangThai")
    private String trangThai;

    @Column(name = "phongLab")
    private String phongLab;

    @Column(name = "ketQuaKiemNghiem")
    private String ketQuaKiemNghiem;

    @Column(name = "lyDoKhongDat")
    private String lyDoKhongDat;

    @Column(name = "noidungYeuCau")
    private String noidungYeuCau;

    @Column(name = "chiTieuKiemDinh")
    private String chiTieuKiemDinh;

    @Column(name = "maMauLienQuan")
    private String maMauLienQuan;

    @Column(name = "ngayTao")
    private LocalDate ngayTao;

    @Column(name = "maNguoiTao")
    private String maNguoiTao;

    public YeuCauKiemNghiemView() {
    }

    public String getMaYeuCau() { return maYeuCau; }
    public String getMaMau() { return maMau; }
    public String getMaNguoiKiem() { return maNguoiKiem; }
    public String getMaCoSo() { return maCoSo; }
    public String getTenCoSo() { return tenCoSo; }
    public String getLoaiMau() { return loaiMau; }
    public LocalDate getNgayYeuCau() { return ngayYeuCau; }
    public LocalDate getHanHoanThanh() { return hanHoanThanh; }
    public String getTrangThai() { return trangThai; }
    public String getPhongLab() { return phongLab; }
    public String getKetQuaKiemNghiem() { return ketQuaKiemNghiem; }
    public String getLyDoKhongDat() { return lyDoKhongDat; }
    public String getNoidungYeuCau() { return noidungYeuCau; }
    public String getChiTieuKiemDinh() { return chiTieuKiemDinh; }
    public String getMaMauLienQuan() { return maMauLienQuan; }
    public LocalDate getNgayTao() { return ngayTao; }
    public String getMaNguoiTao() { return maNguoiTao; }
}
