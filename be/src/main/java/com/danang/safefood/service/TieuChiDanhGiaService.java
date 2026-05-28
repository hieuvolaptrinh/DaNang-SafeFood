package com.danang.safefood.service;

import com.danang.safefood.dto.request.CreateTieuChiDanhGiaRequest;
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
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Objects;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TieuChiDanhGiaService {

    private final TieuChiDanhGiaRepository tieuChiDanhGiaRepository;

    public Page<TieuChiDanhGiaResponse> getAll(String keyword, String nhom, Pageable pageable) {
        List<TieuChiDanhGiaResponse> filtered = tieuChiDanhGiaRepository
                .findAll(Sort.by(Sort.Direction.ASC, "thuTu", "maTieuChi"))
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

        return new PageImpl<>(
                filtered.subList(fromIndex, toIndex),
                PageRequest.of(pageable.getPageNumber(), pageable.getPageSize()),
                filtered.size()
        );
    }

    @Transactional(readOnly = false, propagation = Propagation.REQUIRED)
    public TieuChiDanhGiaResponse create(CreateTieuChiDanhGiaRequest req) {
        String maTieuChi = (req.maTieuChi() == null || req.maTieuChi().isBlank())
                ? generateMaTieuChi()
                : req.maTieuChi().trim();

        if (tieuChiDanhGiaRepository.existsById(maTieuChi)) {
            throw new IllegalArgumentException("TiÃªu chÃ­ Ä‘Ã£ tá»“n táº¡i: " + maTieuChi);
        }

        TieuChiDanhGia entity = TieuChiDanhGia.builder()
                .maTieuChi(maTieuChi)
                .tenTieuChi(req.tenTieuChi())
                .nhom(req.nhom())
                .thuTu(req.thuTu())
                .build();

        TieuChiDanhGia saved = tieuChiDanhGiaRepository.save(entity);
        return TieuChiDanhGiaResponse.from(saved);
    }

    private static final Pattern TIEU_CHI_ID_PATTERN = Pattern.compile("(?i)^TC\\D*(\\d+)$");

    private String generateMaTieuChi() {
        int max = tieuChiDanhGiaRepository.findAll().stream()
                .map(TieuChiDanhGia::getMaTieuChi)
                .filter(Objects::nonNull)
                .map(String::trim)
                .map(this::extractTieuChiNumber)
                .filter(Objects::nonNull)
                .mapToInt(Integer::intValue)
                .max()
                .orElse(0);

        int next = max + 1;
        int width = next <= 999 ? 3 : String.valueOf(next).length();
        return "TC" + String.format(Locale.ROOT, "%0" + width + "d", next);
    }

    private Integer extractTieuChiNumber(String id) {
        Matcher m = TIEU_CHI_ID_PATTERN.matcher(id);
        if (!m.matches()) return null;
        try {
            return Integer.parseInt(m.group(1));
        } catch (NumberFormatException ignored) {
            return null;
        }
    }

    public TieuChiDanhGiaResponse getById(String maTieuChi) {
        TieuChiDanhGia entity = tieuChiDanhGiaRepository.findById(maTieuChi)
                .orElseThrow(() -> new EntityNotFoundException("KhÃ´ng tÃ¬m tháº¥y tiÃªu chÃ­: " + maTieuChi));
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

