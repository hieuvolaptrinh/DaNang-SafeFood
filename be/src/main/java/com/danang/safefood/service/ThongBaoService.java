package com.danang.safefood.service;

import com.danang.safefood.dto.request.ThongBaoRequest;
import com.danang.safefood.dto.response.ThongBaoResponse;
import com.danang.safefood.entity.ThongBao;
import com.danang.safefood.repository.ThongBaoRepository;
import com.danang.safefood.util.IdGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ThongBaoService {

    private final ThongBaoRepository thongBaoRepo;

    @Transactional
    public ThongBaoResponse create(ThongBaoRequest req) {
        ThongBao entity = ThongBao.builder()
                .maThongBao(IdGenerator.generate("TB"))
                .tieuDe(req.tieuDe())
                .noiDung(req.noiDung())
                .ngayGui(LocalDateTime.now())
                .loaiThongBao(req.loaiThongBao())
                .isCongDong(Boolean.TRUE.equals(req.isCongDong()))
                .build();
        return ThongBaoResponse.from(thongBaoRepo.save(entity));
    }

    @Transactional(readOnly = true)
    public Page<ThongBaoResponse> getAll(String loai, Boolean isCongDong, Pageable pageable) {
        if (loai != null) {
            return thongBaoRepo.findByLoaiThongBaoOrderByNgayGuiDesc(loai, pageable).map(ThongBaoResponse::from);
        }
        if (isCongDong != null) {
            return thongBaoRepo.findByIsCongDongOrderByNgayGuiDesc(isCongDong, pageable).map(ThongBaoResponse::from);
        }
        return thongBaoRepo.findAllByOrderByNgayGuiDesc(pageable).map(ThongBaoResponse::from);
    }
}
