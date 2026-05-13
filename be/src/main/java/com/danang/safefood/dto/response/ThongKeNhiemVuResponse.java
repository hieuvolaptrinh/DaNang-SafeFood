package com.danang.safefood.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ThongKeNhiemVuResponse {
    private long tongSo;
    private long chuaNhan;
    private long daNhan;
}
