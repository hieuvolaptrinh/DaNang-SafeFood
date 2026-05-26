package com.danang.safefood.dto.response;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoaiViPhamResponse {
    private String maLoaiViPham;
    private String tenLoaiViPham;
    private String moTaThem;
}