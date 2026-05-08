package com.danang.safefood.dto.request;

import com.danang.safefood.entity.LoaiQuyDinh;
import com.danang.safefood.entity.TrangThaiQuyDinh;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record QuyDinhRequest(
        @NotBlank(message = "Tiêu đề không được trống") String tieuDe,
        String noiDung,
        @NotNull(message = "Loại quy định không được trống") LoaiQuyDinh loai,
        TrangThaiQuyDinh trangThai,
        @NotNull(message = "Ngày ban hành không được trống") LocalDate ngayBanHanh
) {}
