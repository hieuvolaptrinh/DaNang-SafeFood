package com.danang.safefood.service;

import com.danang.safefood.dto.request.HoSoThanhTraRequest;
import com.danang.safefood.dto.response.HoSoThanhTraResponse;
import com.danang.safefood.dto.response.HoSoThanhTraStatsResponse;
import com.danang.safefood.entity.CoSoKinhDoanh;
import com.danang.safefood.entity.HoSoThanhTra;
import com.danang.safefood.entity.LichThanhTra;
import com.danang.safefood.entity.NguoiDung;
import com.danang.safefood.repository.CoSoKinhDoanhRepository;
import com.danang.safefood.repository.HoSoThanhTraRepository;
import com.danang.safefood.repository.LichThanhTraRepository;
import com.danang.safefood.repository.NguoiDungRepository;
import com.danang.safefood.util.IdGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class HoSoThanhTraService {

    private final HoSoThanhTraRepository hoSoThanhTraRepository;
    private final LichThanhTraRepository lichThanhTraRepository;
    private final CoSoKinhDoanhRepository coSoKinhDoanhRepository;
    private final NguoiDungRepository nguoiDungRepository;

    @Transactional(readOnly = true)
    public Page<HoSoThanhTraResponse> getAll(String keyword, String resultFilter, String inspectorFilter, Pageable pageable) {
        String kw = (keyword != null && !keyword.trim().isEmpty()) ? keyword.trim() : null;
        String res = (resultFilter != null && !resultFilter.trim().isEmpty()) ? resultFilter.trim() : null;
        String ins = (inspectorFilter != null && !inspectorFilter.trim().isEmpty()) ? inspectorFilter.trim() : null;
        return hoSoThanhTraRepository.searchHoSo(kw, res, ins, pageable).map(HoSoThanhTraResponse::from);
    }

    @Transactional(readOnly = true)
    public HoSoThanhTraStatsResponse getStats() {
        long total = hoSoThanhTraRepository.count();
        long completed = hoSoThanhTraRepository.countCompleted();
        long scheduled = hoSoThanhTraRepository.countScheduled();
        long failed = hoSoThanhTraRepository.countFailed();
        return new HoSoThanhTraStatsResponse(total, completed, scheduled, failed);
    }

    @Transactional(readOnly = true)
    public HoSoThanhTraResponse getById(String id) {
        return hoSoThanhTraRepository.findById(id)
                .map(HoSoThanhTraResponse::from)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hồ sơ: " + id));
    }

    @Transactional
    public HoSoThanhTraResponse create(HoSoThanhTraRequest req) {
        // Tìm Cơ sở kinh doanh theo ID
        CoSoKinhDoanh coSo = coSoKinhDoanhRepository.findById(req.facilityId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy cơ sở kinh doanh với ID: " + req.facilityId()));

        // Lấy người phụ trách (user đang đăng nhập)
        String username = null;
        try {
            username = SecurityContextHolder.getContext().getAuthentication().getName();
        } catch (Exception ignored) {}
        
        NguoiDung currentUser = null;
        if (username != null) {
            currentUser = nguoiDungRepository.findByTaiKhoan_Username(username).orElse(null);
        }

        // Tạo Lịch thanh tra
        LichThanhTra lich = new LichThanhTra();
        lich.setMaThanhTra(IdGenerator.generate("TT"));
        lich.setCoSoKinhDoanh(coSo);
        lich.setNguoiPhuTrach(currentUser);
        lich.setTrangThai("Hoàn thành");
        lich.setNoiDung("Kiểm tra ATVSTP");
        lich = lichThanhTraRepository.save(lich);

        // Tạo Hồ sơ thanh tra
        HoSoThanhTra hs = new HoSoThanhTra();
        hs.setMaHoSo(IdGenerator.generate("HS"));
        hs.setLichThanhTra(lich);
        try {
            hs.setThoiGianKiemTra(LocalDateTime.parse(req.inspectionTime()));
        } catch (Exception e) {
            hs.setThoiGianKiemTra(LocalDateTime.now());
        }
        hs.setKetLuan(req.conclusion());
        hs.setNhanXetChung(req.generalComment());
        hs.setBienPhapXuLy(req.actionMeasure());
        hs.setKienNghi(req.recommendation());
        
        // Tính điểm từ checklist
        double score = 0.0;
        if (req.checklist() != null && !req.checklist().isEmpty()) {
            long passCount = req.checklist().values().stream().filter("pass"::equals).count();
            score = (double) passCount / req.checklist().size() * 100;
        }
        hs.setDiem(score);
        hs.setTinhTrangViPham(req.violationDescription() != null ? req.violationDescription() : req.violationStatus());

        hs = hoSoThanhTraRepository.save(hs);
        return HoSoThanhTraResponse.from(hs);
    }

    @Transactional
    public HoSoThanhTraResponse update(String id, HoSoThanhTraRequest req) {
        HoSoThanhTra hs = hoSoThanhTraRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hồ sơ: " + id));

        hs.setKetLuan(req.conclusion());
        hs.setNhanXetChung(req.generalComment());
        hs.setBienPhapXuLy(req.actionMeasure());
        hs.setKienNghi(req.recommendation());
        try {
            hs.setThoiGianKiemTra(LocalDateTime.parse(req.inspectionTime()));
        } catch (Exception ignored) {}

        double score = 0.0;
        if (req.checklist() != null && !req.checklist().isEmpty()) {
            long passCount = req.checklist().values().stream().filter("pass"::equals).count();
            score = (double) passCount / req.checklist().size() * 100;
        }
        hs.setDiem(score);
        hs.setTinhTrangViPham(req.violationDescription() != null ? req.violationDescription() : req.violationStatus());

        return HoSoThanhTraResponse.from(hoSoThanhTraRepository.save(hs));
    }
}
