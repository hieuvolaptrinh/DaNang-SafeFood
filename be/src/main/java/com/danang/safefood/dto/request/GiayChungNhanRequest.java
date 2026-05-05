package com.danang.safefood.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record GiayChungNhanRequest(
        @NotBlank(message = "Mã cơ sở kinh doanh không được trống") String maCoSo,
        @NotBlank(message = "Tên chứng nhận không được trống") String tenChungNhan,
        @NotNull(message = "Ngày ban hành không được trống") LocalDate ngayBanHanh,
        @NotNull(message = "Ngày hết hạn không được trống") LocalDate ngayHetHan,
        /** "Cap moi", "Gia han", "Thu hoi" */
        @NotBlank(message = "Trạng thái không được trống") String trangThai
) {}
