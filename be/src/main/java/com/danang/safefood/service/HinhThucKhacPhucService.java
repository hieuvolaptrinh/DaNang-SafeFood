package com.danang.safefood.service;

import com.danang.safefood.dto.response.HinhThucKhacPhucResponse;
import com.danang.safefood.entity.HinhThucKhacPhuc;
import com.danang.safefood.repository.HinhThucKhacPhucRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class HinhThucKhacPhucService {

    private final HinhThucKhacPhucRepository khacPhucRepo;

    @Transactional(readOnly = true)
    public Page<HinhThucKhacPhucResponse> getAll(
            String tinhTrang, String maViPham, Pageable pageable) {
        return khacPhucRepo.findWithFilter(tinhTrang, maViPham, pageable)
                .map(HinhThucKhacPhucResponse::from);
    }

    @Transactional(readOnly = true)
    public HinhThucKhacPhucResponse getById(String id) {
        HinhThucKhacPhuc entity = khacPhucRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy khắc phục: " + id));
        return HinhThucKhacPhucResponse.from(entity);
    }
}
