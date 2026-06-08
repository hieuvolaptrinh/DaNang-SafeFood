package com.danang.safefood.service;

import com.danang.safefood.dto.request.KhieuNaiKiemTraRequest;
import com.danang.safefood.dto.request.KhieuNaiXuLyRequest;
import com.danang.safefood.dto.response.KhieuNaiDetailResponse;
import com.danang.safefood.dto.response.KhieuNaiStatusMapper;
import com.danang.safefood.dto.response.KhieuNaiSummaryResponse;
import com.danang.safefood.entity.KhieuNai;
import com.danang.safefood.repository.FileDinhKemRepository;
import com.danang.safefood.repository.KhieuNaiRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class KhieuNaiService {

    private final KhieuNaiRepository khieuNaiRepository;
    private final FileDinhKemRepository fileDinhKemRepository;

    @Transactional(readOnly = true)
    public Page<KhieuNaiSummaryResponse> getAll(String keyword, String status, Pageable pageable) {
        String kw = keyword != null && !keyword.trim().isEmpty() ? keyword.trim() : null;
        String normalizedStatus = status != null && !status.trim().isEmpty()
                ? KhieuNaiStatusMapper.toLabel(status)
                : null;

        return khieuNaiRepository.search(kw, normalizedStatus, pageable)
                .map(KhieuNaiSummaryResponse::from);
    }

    @Transactional(readOnly = true)
    public KhieuNaiDetailResponse getById(String id) {
        KhieuNai entity = getEntity(id);
        return KhieuNaiDetailResponse.from(
                entity,
                fileDinhKemRepository.findByKhieuNai_MaKhieuNaiOrderByThoiGianGuiAsc(id)
        );
    }

    @Transactional
    public KhieuNaiDetailResponse capNhatKiemTra(String id, KhieuNaiKiemTraRequest request) {
        KhieuNai entity = getEntity(id);
        entity.setTomTatKiemTra(request.tomTatKiemTra().trim());
        KhieuNai saved = khieuNaiRepository.save(entity);
        return KhieuNaiDetailResponse.from(
                saved,
                fileDinhKemRepository.findByKhieuNai_MaKhieuNaiOrderByThoiGianGuiAsc(id)
        );
    }

    @Transactional
    public KhieuNaiDetailResponse capNhatXuLy(String id, KhieuNaiXuLyRequest request) {
        KhieuNai entity = getEntity(id);
        entity.setKetQuaXuLy(request.ketQuaXuLy().trim());
        entity.setTrangThai(KhieuNaiStatusMapper.toLabel(request.trangThai()));
        KhieuNai saved = khieuNaiRepository.save(entity);
        return KhieuNaiDetailResponse.from(
                saved,
                fileDinhKemRepository.findByKhieuNai_MaKhieuNaiOrderByThoiGianGuiAsc(id)
        );
    }

    private KhieuNai getEntity(String id) {
        return khieuNaiRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy khiếu nại: " + id));
    }
}
