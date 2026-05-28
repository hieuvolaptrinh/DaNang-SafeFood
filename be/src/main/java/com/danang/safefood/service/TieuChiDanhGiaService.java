package com.danang.safefood.service;

import com.danang.safefood.dto.response.TieuChiDanhGiaResponse;
import com.danang.safefood.entity.TieuChiDanhGia;
import com.danang.safefood.repository.TieuChiDanhGiaRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import com.danang.safefood.dto.request.CreateTieuChiDanhGiaRequest;
import org.springframework.transaction.annotation.Propagation;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TieuChiDanhGiaService {

    private final TieuChiDanhGiaRepository tieuChiDanhGiaRepository;

    public Page<TieuChiDanhGiaResponse> getAll(String keyword, String nhom, Pageable pageable) {
        List<TieuChiDanhGiaResponse> filtered = tieuChiDanhGiaRepository.findAll(Sort.by(Sort.Direction.ASC, "thuTu", "maTieuChi"))
                .stream()
                .map(TieuChiDanhGiaResponse::from)
                .filter(item -> matchesKeyword(item, keyword))
                .filter(item -> matchesNhom(item, nhom))
                .sorted(Comparator
                    .comparing(TieuChiDanhGiaResponse::thuTu, Comparator.nullsLast(Comparator.naturalOrder()))
                    .thenComparing(TieuChiDanhGiaResponse::maTieuChi, Comparator.nullsLast(String.CASE_INSENSITIVE_ORDER)))
                .toList();

        int fromIndex = Math.min((int) pageable.getOffset(), filtered.size());
        int toIndex = Math.min(fromIndex + pageable.getPageSize(), filtered.size());

        return new PageImpl<>(filtered.subList(fromIndex, toIndex), PageRequest.of(pageable.getPageNumber(), pageable.getPageSize()), filtered.size());
    }

    @Transactional(readOnly = false, propagation = Propagation.REQUIRED)
    public TieuChiDanhGiaResponse create(CreateTieuChiDanhGiaRequest req) {
        // simple validation: maTieuChi must be provided and not already exist
        if (req.maTieuChi() == null || req.maTieuChi().isBlank()) {
            throw new IllegalArgumentException("Mã tiêu chí không được để trống");
        }

        if (tieuChiDanhGiaRepository.existsById(req.maTieuChi())) {
            throw new IllegalArgumentException("Tiêu chí đã tồn tại: " + req.maTieuChi());
        }

        TieuChiDanhGia entity = TieuChiDanhGia.builder()
                .maTieuChi(req.maTieuChi())
                .tenTieuChi(req.tenTieuChi())
                .nhom(req.nhom())
                .thuTu(req.thuTu())
                .build();

        TieuChiDanhGia saved = tieuChiDanhGiaRepository.save(entity);
        return TieuChiDanhGiaResponse.from(saved);
    }

    public TieuChiDanhGiaResponse getById(String maTieuChi) {
        TieuChiDanhGia entity = tieuChiDanhGiaRepository.findById(maTieuChi)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy tiêu chí: " + maTieuChi));
        return TieuChiDanhGiaResponse.from(entity);
    }

    public List<String> getNhomOptions() {
        return tieuChiDanhGiaRepository.findDistinctNhom();
    }

    private boolean matchesKeyword(TieuChiDanhGiaResponse item, String keyword) {
        if (keyword == null || keyword.isBlank()) {
            return true;
        }

        String normalized = keyword.toLowerCase(Locale.ROOT);
        return containsIgnoreCase(item.maTieuChi(), normalized)
                || containsIgnoreCase(item.tenTieuChi(), normalized)
                || containsIgnoreCase(item.nhom(), normalized);
    }

    private boolean matchesNhom(TieuChiDanhGiaResponse item, String nhom) {
        return nhom == null || nhom.isBlank() || nhom.equalsIgnoreCase(item.nhom());
    }

    private boolean containsIgnoreCase(String value, String normalizedKeyword) {
        return value != null && value.toLowerCase(Locale.ROOT).contains(normalizedKeyword);
    }
}
