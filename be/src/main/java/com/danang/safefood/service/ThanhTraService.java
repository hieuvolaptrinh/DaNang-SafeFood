package com.danang.safefood.service;

import com.danang.safefood.dto.request.ThanhTraRequest;
import com.danang.safefood.dto.response.NguoiDungResponse;
import com.danang.safefood.dto.response.ThanhTraResponse;
import com.danang.safefood.entity.CoSoKinhDoanh;
import com.danang.safefood.entity.LichThanhTra;
import com.danang.safefood.entity.LichThanhTraNguoiDung;
import com.danang.safefood.entity.NguoiDung;
import com.danang.safefood.repository.CoSoKinhDoanhRepository;
import com.danang.safefood.repository.LichThanhTraRepository;
import com.danang.safefood.repository.LichThanhTraNguoiDungRepository;
import com.danang.safefood.repository.NguoiDungRepository;
import com.danang.safefood.util.IdGenerator;
import com.danang.safefood.util.NhiemVuStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ThanhTraService {

    private final LichThanhTraRepository lichThanhTraRepo;
    private final CoSoKinhDoanhRepository coSoRepo;
    private final NguoiDungRepository nguoiDungRepo;
    private final LichThanhTraNguoiDungRepository lichThanhTraNguoiDungRepo;

    @Transactional
    public ThanhTraResponse taoThanhTra(ThanhTraRequest req) {
        CoSoKinhDoanh coSo = coSoRepo.findById(req.maCoSo())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy cơ sở kinh doanh: " + req.maCoSo()));

        NguoiDung nguoiPhuTrach = null;
        if (req.maNguoiPhuTrach() != null) {
            nguoiPhuTrach = nguoiDungRepo.findById(req.maNguoiPhuTrach())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy người phụ trách: " + req.maNguoiPhuTrach()));
        }

        LichThanhTra entity = LichThanhTra.builder()
                .maThanhTra(IdGenerator.generate("TT"))
                .trangThai("Dang xu ly")
                .noiDung(req.noiDung())
                .coSoKinhDoanh(coSo)
                .nguoiPhuTrach(nguoiPhuTrach)
                .build();

        LichThanhTra saved = lichThanhTraRepo.save(entity);

        // Auto-create assignment so CB_THANH_TRA can see it in /api/v1/nhiem-vu.
        if (nguoiPhuTrach != null) {
            String maNguoiThanhTra = nguoiPhuTrach.getMaNguoiDung();
            if (!lichThanhTraNguoiDungRepo.existsByMaThanhTraAndMaNguoiThanhTra(saved.getMaThanhTra(), maNguoiThanhTra)) {
                lichThanhTraNguoiDungRepo.save(LichThanhTraNguoiDung.builder()
                        .maThanhTra(saved.getMaThanhTra())
                        .maNguoiThanhTra(maNguoiThanhTra)
                        .thoiGianTT(LocalDateTime.now())
                        .trangThai(NhiemVuStatus.CHUA_NHAN)
                        .build());
            }
        }

        return ThanhTraResponse.from(saved);
    }

    @Transactional(readOnly = true)
    public Page<ThanhTraResponse> getAll(String trangThai, Pageable pageable) {
        Page<LichThanhTra> page = (trangThai != null)
                ? lichThanhTraRepo.findByTrangThaiOrderByMaThanhTraDesc(trangThai, pageable)
                : lichThanhTraRepo.findAllByOrderByMaThanhTraDesc(pageable);
        return page.map(ThanhTraResponse::from);
    }

    @Transactional(readOnly = true)
    public List<NguoiDungResponse> getNguoiDungByQuyen(String maQuyenHan) {
        List<NguoiDung> list = nguoiDungRepo.findByQuyenHan(maQuyenHan);
        return list.stream()
                .map(NguoiDungResponse::from)   // hoặc tạo mapper phù hợp
                .toList();
    }
}
