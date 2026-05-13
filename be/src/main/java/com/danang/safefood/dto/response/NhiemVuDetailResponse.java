package com.danang.safefood.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NhiemVuDetailResponse {
    private String maThanhTra;
    private String trangThai;  // personal status
    private String ghiChu;     // personal notes
    private String noiDung;
    private LocalDateTime thoiGianTT;
    private String maCoSo;
    private String tenCoSo;
    private String diaChiCoSo; // phường xã
    private String maNguoiPhuTrach;
    private String tenNguoiPhuTrach;
}
