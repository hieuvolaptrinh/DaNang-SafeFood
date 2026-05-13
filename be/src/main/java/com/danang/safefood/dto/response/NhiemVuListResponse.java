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
public class NhiemVuListResponse {
    private String maThanhTra;
    private String tenCoSo;
    private String trangThai;  // personal status
    private String ghiChu;     // personal notes
    private LocalDateTime thoiGianTT;
    private String nguoiPhuTrach;
}
