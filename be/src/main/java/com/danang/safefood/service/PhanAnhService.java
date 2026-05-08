package com.danang.safefood.service;

import com.danang.safefood.dto.request.PhanAnhUpdateRequest;
import com.danang.safefood.dto.response.PhanAnhResponse;
import com.danang.safefood.entity.PhanAnh;
import com.danang.safefood.repository.PhanAnhRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class PhanAnhService {

    private final PhanAnhRepository phanAnhRepository;

    @Transactional(readOnly = true)
    public Page<PhanAnhResponse> getAll(String trangThai, LocalDateTime from, LocalDateTime to, Pageable pageable) {
        return phanAnhRepository.findWithFilter(trangThai, from, to, pageable)
                .map(PhanAnhResponse::from);
    }

    @Transactional(readOnly = true)
    public PhanAnhResponse getById(String id) {
        PhanAnh entity = phanAnhRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phản ánh: " + id));
        return PhanAnhResponse.from(entity);
    }

    @Transactional
    public PhanAnhResponse update(String id, PhanAnhUpdateRequest req) {
        PhanAnh entity = phanAnhRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phản ánh: " + id));

        if (req.trangThaiPhanAnh() != null) entity.setTrangThaiPhanAnh(req.trangThaiPhanAnh());
        if (req.ghiChu() != null)           entity.setGhiChu(req.ghiChu());

        return PhanAnhResponse.from(phanAnhRepository.save(entity));
    }
}
