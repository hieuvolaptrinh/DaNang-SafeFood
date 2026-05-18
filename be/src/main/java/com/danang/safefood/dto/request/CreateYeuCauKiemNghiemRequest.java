package com.danang.safefood.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record CreateYeuCauKiemNghiemRequest(
        @NotBlank(message = "Ma co so khong duoc de trong")
        String maCoSo,

        @NotBlank(message = "Loai mau khong duoc de trong")
        String loaiMau,

        @NotNull(message = "Ngay yeu cau khong duoc de trong")
        LocalDate ngayYeuCau,

        @NotNull(message = "Han hoan thanh khong duoc de trong")
        LocalDate hanHoanThanh,

        @NotBlank(message = "Phong lab khong duoc de trong")
        String phongLab,

        @NotBlank(message = "Noi dung yeu cau khong duoc de trong")
        String noidungYeuCau,

        @NotBlank(message = "Chi tieu kiem dinh khong duoc de trong")
        String chiTieuKiemDinh,

        String maMauLienQuan,

        String maNguoiKiemNghiem
) {
}
