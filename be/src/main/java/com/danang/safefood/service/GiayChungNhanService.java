package com.danang.safefood.service;

import com.danang.safefood.dto.request.GiayChungNhanRequest;
import com.danang.safefood.dto.response.GiayChungNhanResponse;
import com.danang.safefood.entity.ChungNhanATVSTP;
import com.danang.safefood.entity.CoSoKinhDoanh;
import com.danang.safefood.repository.ChungNhanATVSTPRepository;
import com.danang.safefood.repository.CoSoKinhDoanhRepository;
import com.danang.safefood.util.IdGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class GiayChungNhanService {

    private final ChungNhanATVSTPRepository chungNhanRepo;
    private final CoSoKinhDoanhRepository coSoRepo;

    @Transactional
    public GiayChungNhanResponse pheDuyet(GiayChungNhanRequest req) {
        if (req.ngayBanHanh().isAfter(req.ngayHetHan())) {
            throw new RuntimeException("Ngày ban hành phải trước ngày hết hạn");
        }

        CoSoKinhDoanh coSo = coSoRepo.findById(req.maCoSo())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy cơ sở kinh doanh: " + req.maCoSo()));

        ChungNhanATVSTP entity = ChungNhanATVSTP.builder()
                .maCN(IdGenerator.generate("CN"))
                .tenChungNhan(req.tenChungNhan())
                .ngayBanHanh(req.ngayBanHanh())
                .ngayHetHan(req.ngayHetHan())
                .trangThai(req.trangThai())
                .coSoKinhDoanh(coSo)
                .build();

        return GiayChungNhanResponse.from(chungNhanRepo.save(entity));
    }

    @Transactional(readOnly = true)
    public Page<GiayChungNhanResponse> getAll(String trangThai, Pageable pageable) {
        Page<ChungNhanATVSTP> page = (trangThai != null)
                ? chungNhanRepo.findByTrangThaiOrderByNgayBanHanhDesc(trangThai, pageable)
                : chungNhanRepo.findAllByOrderByNgayBanHanhDesc(pageable);
        return page.map(GiayChungNhanResponse::from);
    }

    @Transactional(readOnly = true)
    public GiayChungNhanResponse getDetail(String maCN) {

        ChungNhanATVSTP entity = chungNhanRepo.findById(maCN)
                .orElseThrow(() ->
                        new RuntimeException("Không tìm thấy giấy chứng nhận: " + maCN));

        return GiayChungNhanResponse.from(entity);
    }
}
