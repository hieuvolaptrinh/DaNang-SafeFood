package com.danang.safefood.service;

import com.danang.safefood.config.security.jwt.JwtPrincipal;
import com.danang.safefood.dto.request.CapNhatTienDoRequest;
import com.danang.safefood.dto.response.NhiemVuDashboardResponse;
import com.danang.safefood.dto.response.NhiemVuDetailResponse;
import com.danang.safefood.dto.response.NhiemVuListResponse;
import com.danang.safefood.dto.response.ThongKeNhiemVuResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface NhiemVuService {

    ThongKeNhiemVuResponse getThongKeNhiemVu(JwtPrincipal jwtPrincipal);

    NhiemVuDashboardResponse getDashboard(JwtPrincipal jwtPrincipal, int limit);

    Page<NhiemVuListResponse> getDanhSachNhiemVu(JwtPrincipal jwtPrincipal, String keyword, String trangThai, Pageable pageable);

    NhiemVuDetailResponse getChiTietNhiemVu(JwtPrincipal jwtPrincipal, String maThanhTra);

    void nhanNhiemVu(JwtPrincipal jwtPrincipal, String maThanhTra);

    void capNhatTienDo(JwtPrincipal jwtPrincipal, String maThanhTra, CapNhatTienDoRequest request);

    void tuChoiNhiemVu(JwtPrincipal jwtPrincipal, String maThanhTra, com.danang.safefood.dto.request.TuChoiNhiemVuRequest request);
}
