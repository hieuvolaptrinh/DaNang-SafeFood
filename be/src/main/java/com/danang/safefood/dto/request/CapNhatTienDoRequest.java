package com.danang.safefood.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CapNhatTienDoRequest {
    private String trangThai;
    private String ghiChu;
}
