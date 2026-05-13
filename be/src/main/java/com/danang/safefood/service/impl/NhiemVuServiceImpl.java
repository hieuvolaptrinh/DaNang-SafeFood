package com.danang.safefood.service.impl;

import com.danang.safefood.config.security.jwt.JwtPrincipal;
import com.danang.safefood.dto.request.CapNhatTienDoRequest;
import com.danang.safefood.dto.response.NhiemVuDetailResponse;
import com.danang.safefood.dto.response.NhiemVuListResponse;
import com.danang.safefood.dto.response.ThongKeNhiemVuResponse;
import com.danang.safefood.entity.LichThanhTra;
import com.danang.safefood.entity.LichThanhTraNguoiDung;
import com.danang.safefood.entity.NguoiDung;
import com.danang.safefood.repository.LichThanhTraRepository;
import com.danang.safefood.repository.LichThanhTraNguoiDungRepository;
import com.danang.safefood.repository.NguoiDungRepository;
import com.danang.safefood.service.NhiemVuService;
import com.danang.safefood.util.NhiemVuStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NhiemVuServiceImpl implements NhiemVuService {

    private final LichThanhTraRepository lichThanhTraRepository;
    private final LichThanhTraNguoiDungRepository lichThanhTraNguoiDungRepository;
    private final NguoiDungRepository nguoiDungRepository;

    private NguoiDung getNguoiDung(JwtPrincipal jwtPrincipal) {
        return nguoiDungRepository.findByTaiKhoan_Id(jwtPrincipal.userId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng hiện tại"));
    }

    @Override
    public ThongKeNhiemVuResponse getThongKeNhiemVu(JwtPrincipal jwtPrincipal) {
        NguoiDung nguoiDung = getNguoiDung(jwtPrincipal);
        String maNguoiDung = nguoiDung.getMaNguoiDung();

        long tongSo = lichThanhTraNguoiDungRepository.countTongSoNhiemVu(maNguoiDung);
        long chuaNhan = lichThanhTraNguoiDungRepository.countNhiemVuByTrangThai(maNguoiDung, NhiemVuStatus.CHUA_NHAN);
        long daNhan = lichThanhTraNguoiDungRepository.countNhiemVuByTrangThai(maNguoiDung, NhiemVuStatus.DA_NHAN);

        return ThongKeNhiemVuResponse.builder()
                .tongSo(tongSo)
                .chuaNhan(chuaNhan)
                .daNhan(daNhan)
                .build();
    }

    @Override
    public Page<NhiemVuListResponse> getDanhSachNhiemVu(JwtPrincipal jwtPrincipal, String keyword, String trangThai, Pageable pageable) {
        NguoiDung nguoiDung = getNguoiDung(jwtPrincipal);
        
        Page<LichThanhTraNguoiDung> pageData = lichThanhTraNguoiDungRepository.searchNhiemVu(nguoiDung.getMaNguoiDung(), keyword, trangThai, pageable);
        
        return pageData.map(ln -> {
            LichThanhTra l = ln.getLichThanhTra();
            String tenCoSo = l.getCoSoKinhDoanh() != null ? l.getCoSoKinhDoanh().getTenCoSo() : null;
            String tenNguoiPhuTrach = l.getNguoiPhuTrach() != null ? l.getNguoiPhuTrach().getHoTen() : null;
            
            return NhiemVuListResponse.builder()
                    .maThanhTra(l.getMaThanhTra())
                    .tenCoSo(tenCoSo)
                    .trangThai(ln.getTrangThai())
                    .ghiChu(ln.getGhiChu())
                    .thoiGianTT(ln.getThoiGianTT())
                    .nguoiPhuTrach(tenNguoiPhuTrach)
                    .build();
        });
    }

    @Override
    public NhiemVuDetailResponse getChiTietNhiemVu(JwtPrincipal jwtPrincipal, String maThanhTra) {
        NguoiDung nguoiDung = getNguoiDung(jwtPrincipal);
        
        if (!lichThanhTraNguoiDungRepository.existsByMaThanhTraAndMaNguoiThanhTra(maThanhTra, nguoiDung.getMaNguoiDung())) {
            throw new RuntimeException("Bạn không được phân công nhiệm vụ này");
        }
        
        LichThanhTra lichThanhTra = lichThanhTraRepository.findById(maThanhTra)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lịch thanh tra"));
                
        LichThanhTraNguoiDung assignment = lichThanhTraNguoiDungRepository.findById(new LichThanhTraNguoiDung.LichThanhTraNguoiDungId(maThanhTra, nguoiDung.getMaNguoiDung()))
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thông tin phân công"));

        NhiemVuDetailResponse.NhiemVuDetailResponseBuilder builder = NhiemVuDetailResponse.builder()
                .maThanhTra(lichThanhTra.getMaThanhTra())
                .trangThai(assignment.getTrangThai())
                .ghiChu(assignment.getGhiChu())
                .noiDung(lichThanhTra.getNoiDung())
                .thoiGianTT(assignment.getThoiGianTT());
                
        if (lichThanhTra.getCoSoKinhDoanh() != null) {
            builder.maCoSo(lichThanhTra.getCoSoKinhDoanh().getMaCoSo())
                   .tenCoSo(lichThanhTra.getCoSoKinhDoanh().getTenCoSo());
                   
            if (lichThanhTra.getCoSoKinhDoanh().getPhuongXa() != null) {
                builder.diaChiCoSo(lichThanhTra.getCoSoKinhDoanh().getPhuongXa().getTenPhuongXa());
            }
        }
        
        if (lichThanhTra.getNguoiPhuTrach() != null) {
            builder.maNguoiPhuTrach(lichThanhTra.getNguoiPhuTrach().getMaNguoiDung())
                   .tenNguoiPhuTrach(lichThanhTra.getNguoiPhuTrach().getHoTen());
        }
        
        return builder.build();
    }

    @Override
    @Transactional
    public void nhanNhiemVu(JwtPrincipal jwtPrincipal, String maThanhTra) {
        NguoiDung nguoiDung = getNguoiDung(jwtPrincipal);
        
        if (!lichThanhTraNguoiDungRepository.existsByMaThanhTraAndMaNguoiThanhTra(maThanhTra, nguoiDung.getMaNguoiDung())) {
            throw new RuntimeException("Bạn không được phân công nhiệm vụ này");
        }
        
        LichThanhTraNguoiDung assignment = lichThanhTraNguoiDungRepository.findById(new LichThanhTraNguoiDung.LichThanhTraNguoiDungId(maThanhTra, nguoiDung.getMaNguoiDung()))
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thông tin phân công"));
                
        if (NhiemVuStatus.CHUA_NHAN.equalsIgnoreCase(assignment.getTrangThai())) {
            assignment.setTrangThai(NhiemVuStatus.DA_NHAN);
            lichThanhTraNguoiDungRepository.save(assignment);
            updateLichThanhTraStatus(maThanhTra);
        } else {
            throw new IllegalArgumentException("Nhiệm vụ này không ở trạng thái có thể nhận");
        }
    }

    @Override
    @Transactional
    public void capNhatTienDo(JwtPrincipal jwtPrincipal, String maThanhTra, CapNhatTienDoRequest request) {
        NguoiDung nguoiDung = getNguoiDung(jwtPrincipal);
        
        if (!lichThanhTraNguoiDungRepository.existsByMaThanhTraAndMaNguoiThanhTra(maThanhTra, nguoiDung.getMaNguoiDung())) {
            throw new RuntimeException("Bạn không được phân công nhiệm vụ này");
        }
        
        LichThanhTraNguoiDung assignment = lichThanhTraNguoiDungRepository.findById(new LichThanhTraNguoiDung.LichThanhTraNguoiDungId(maThanhTra, nguoiDung.getMaNguoiDung()))
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thông tin phân công"));
                
        if (request.getTrangThai() != null && !request.getTrangThai().isBlank()) {
            assignment.setTrangThai(request.getTrangThai());
        }
        
        if (request.getGhiChu() != null) {
            assignment.setGhiChu(request.getGhiChu());
        }
        
        lichThanhTraNguoiDungRepository.save(assignment);
        updateLichThanhTraStatus(maThanhTra);
    }

    private void updateLichThanhTraStatus(String maThanhTra) {
        List<LichThanhTraNguoiDung> assignments = lichThanhTraNguoiDungRepository.findByMaThanhTra(maThanhTra);
        if (assignments.isEmpty()) {
            return;
        }

        String trangThaiLichThanhTra = assignments.stream()
                .map(LichThanhTraNguoiDung::getTrangThai)
                .filter(trangThai -> NhiemVuStatus.getPriority(trangThai) != Integer.MAX_VALUE)
                .min(Comparator.comparingInt(NhiemVuStatus::getPriority))
                .orElse(null);

        if (trangThaiLichThanhTra == null) {
            return;
        }

        LichThanhTra lichThanhTra = lichThanhTraRepository.findById(maThanhTra)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lịch thanh tra"));
        lichThanhTra.setTrangThai(trangThaiLichThanhTra);
        lichThanhTraRepository.save(lichThanhTra);
    }
}
