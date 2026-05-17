package com.danang.safefood.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.List;

public record PhanAnhCreateRequest(
        @NotBlank(message = "Tiêu đề không được để trống") @Size(max = 200, message = "Tiêu đề tối đa 200 ký tự") String tieuDe,
        @NotBlank(message = "Nội dung không được để trống") String noiDung,
        @NotBlank(message = "Loại phản ánh không được để trống") String maLoaiPhanAnh,
        String maCoSo,
        String diaDiem,
        List<String> fileUrls) {
}
