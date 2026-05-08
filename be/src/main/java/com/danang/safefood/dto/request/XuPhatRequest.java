package com.danang.safefood.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;

public record XuPhatRequest(
        @NotBlank(message = "Mã cơ sở kinh doanh không được trống") String maCoSo,
        String soQuyetDinh,
        @DecimalMin(value = "0", message = "Mức phạt không âm") BigDecimal mucPhat,
        String lyDoXuPhat,
        @NotNull(message = "Ngày xử phạt không được trống") LocalDate ngayXuPhat
) {}
