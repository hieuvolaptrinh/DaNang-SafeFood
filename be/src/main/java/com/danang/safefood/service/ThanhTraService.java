package com.danang.safefood.service;

import com.danang.safefood.dto.request.ThanhTraRequest;
import com.danang.safefood.dto.response.NguoiDungResponse;
import com.danang.safefood.dto.response.ThanhTraResponse;
import com.danang.safefood.entity.CoSoKinhDoanh;
import com.danang.safefood.entity.LichThanhTra;
import com.danang.safefood.entity.NguoiDung;
import com.danang.safefood.repository.CoSoKinhDoanhRepository;
import com.danang.safefood.repository.LichThanhTraRepository;
import com.danang.safefood.repository.NguoiDungRepository;
import com.danang.safefood.util.IdGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ThanhTraService {

    private final LichThanhTraRepository lichThanhTraRepo;
    private final CoSoKinhDoanhRepository coSoRepo;
    private final NguoiDungRepository nguoiDungRepo;

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

        return ThanhTraResponse.from(lichThanhTraRepo.save(entity));
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
