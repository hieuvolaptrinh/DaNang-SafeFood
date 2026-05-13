package com.danang.safefood.service;

import com.danang.safefood.dto.request.BaoCaoRequest;
import com.danang.safefood.dto.response.BaoCaoResponse;
import com.danang.safefood.dto.response.BaoCaoStatsResponse;
import com.danang.safefood.entity.*;
import com.danang.safefood.repository.*;
import com.danang.safefood.util.IdGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class BaoCaoService {

    private final BaoCaoRepository baoCaoRepository;
    private final HoSoThanhTraRepository hoSoThanhTraRepository;
    private final LichThanhTraRepository lichThanhTraRepository;
    private final CoSoKinhDoanhRepository coSoKinhDoanhRepository;
    private final NguoiDungRepository nguoiDungRepository;

    @Transactional
    public BaoCaoResponse createBaoCao(BaoCaoRequest req) {
        CoSoKinhDoanh coSo = coSoKinhDoanhRepository.findById(req.facilityId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy cơ sở kinh doanh: " + req.facilityId()));

        String username = null;
        try {
            username = SecurityContextHolder.getContext().getAuthentication().getName();
        } catch (Exception e) {
            // Ignored, maybe not authenticated in some context
        }
        
        NguoiDung currentUser = null;
        if (username != null) {
            currentUser = nguoiDungRepository.findByTaiKhoan_Username(username).orElse(null);
        }

        LichThanhTra lich = new LichThanhTra();
        lich.setMaThanhTra(IdGenerator.generate("TT"));
        lich.setCoSoKinhDoanh(coSo);
        lich.setTrangThai("Hoàn thành");
        lich.setNoiDung(req.inspectionType());
        lich.setNguoiPhuTrach(currentUser);
        lich = lichThanhTraRepository.save(lich);

        HoSoThanhTra hoSo = new HoSoThanhTra();
        hoSo.setMaHoSo(IdGenerator.generate("HS"));
        hoSo.setLichThanhTra(lich);
        hoSo.setDiem(req.score());
        hoSo.setTinhTrangViPham(req.result());
        try {
            hoSo.setThoiGianKiemTra(LocalDate.parse(req.inspectionDate()).atStartOfDay());
        } catch (Exception e) {
            hoSo.setThoiGianKiemTra(LocalDateTime.now());
        }
        hoSo = hoSoThanhTraRepository.save(hoSo);

        BaoCao bc = new BaoCao();
        bc.setMaBaoCao(IdGenerator.generate("BC"));
        bc.setHoSoThanhTra(hoSo);
        bc.setNoiDung(req.content());
        bc.setNhanXet(req.comment());
        bc.setTepDinhKem(req.fileName());
        bc = baoCaoRepository.save(bc);

        return BaoCaoResponse.from(bc);
    }

    @Transactional(readOnly = true)
    public Page<BaoCaoResponse> getAll(String keyword, String resultFilter, Pageable pageable) {
        String queryKeyword = (keyword != null && !keyword.trim().isEmpty()) ? keyword.trim() : null;
        String queryFilter = (resultFilter != null && !resultFilter.trim().isEmpty()) ? resultFilter.trim() : null;
        return baoCaoRepository.searchBaoCao(queryKeyword, queryFilter, pageable).map(BaoCaoResponse::from);
    }

    @Transactional(readOnly = true)
    public BaoCaoStatsResponse getStats() {
        long total = baoCaoRepository.count();
        long completed = baoCaoRepository.countCompleted();
        long processing = baoCaoRepository.countProcessing();
        long failed = baoCaoRepository.countFailed();
        return new BaoCaoStatsResponse(total, completed, processing, failed);
    }

    @Transactional(readOnly = true)
    public BaoCaoResponse getBaoCaoById(String id) {
        BaoCao bc = baoCaoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy báo cáo với mã: " + id));
        return BaoCaoResponse.from(bc);
    }

    @Transactional
    public BaoCaoResponse updateBaoCao(String id, BaoCaoRequest req) {
        BaoCao bc = baoCaoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy báo cáo với mã: " + id));

        bc.setNoiDung(req.content());
        bc.setNhanXet(req.comment());
        if (req.fileName() != null) {
            bc.setTepDinhKem(req.fileName());
        }

        HoSoThanhTra hoSo = bc.getHoSoThanhTra();
        if (hoSo != null) {
            hoSo.setDiem(req.score());
            hoSo.setTinhTrangViPham(req.result());
            try {
                hoSo.setThoiGianKiemTra(LocalDate.parse(req.inspectionDate()).atStartOfDay());
            } catch (Exception e) {
                // Ignore parsing error, keep old value
            }

            LichThanhTra lich = hoSo.getLichThanhTra();
            if (lich != null) {
                lich.setNoiDung(req.inspectionType());
                if (req.facilityId() != null && (lich.getCoSoKinhDoanh() == null || !req.facilityId().equals(lich.getCoSoKinhDoanh().getMaCoSo()))) {
                    CoSoKinhDoanh coSo = coSoKinhDoanhRepository.findById(req.facilityId())
                            .orElseThrow(() -> new RuntimeException("Không tìm thấy cơ sở kinh doanh: " + req.facilityId()));
                    lich.setCoSoKinhDoanh(coSo);
                }
                lichThanhTraRepository.save(lich);
            }
            hoSoThanhTraRepository.save(hoSo);
        }

        bc = baoCaoRepository.save(bc);
        return BaoCaoResponse.from(bc);
    }

    @Transactional
    public void deleteBaoCao(String id) {
        BaoCao bc = baoCaoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy báo cáo với mã: " + id));
        
        HoSoThanhTra hoSo = bc.getHoSoThanhTra();
        baoCaoRepository.delete(bc);
        
        // Optionally delete HoSoThanhTra and LichThanhTra if they are uniquely tied to this BaoCao
        // Since we create them together in createBaoCao, it makes sense to delete them too
        if (hoSo != null) {
            LichThanhTra lich = hoSo.getLichThanhTra();
            hoSoThanhTraRepository.delete(hoSo);
            if (lich != null) {
                lichThanhTraRepository.delete(lich);
            }
        }
    }
}
