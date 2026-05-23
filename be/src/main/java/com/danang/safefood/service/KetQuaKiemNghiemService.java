package com.danang.safefood.service;

import com.danang.safefood.dto.response.*;
import com.danang.safefood.entity.CoSoKinhDoanh;
import com.danang.safefood.entity.MauChiTieu;
import com.danang.safefood.entity.MauKiemNghiem;
import com.danang.safefood.repository.DamNhanKiemNghiemRepository;
import com.danang.safefood.repository.MauChiTieuRepository;
import com.danang.safefood.repository.MauKiemNghiemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.Normalizer;
import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class KetQuaKiemNghiemService {

    private static final String RESULT_PASS = "Đạt";
    private static final String RESULT_FAIL = "Không Đạt";
    private static final String RESULT_PENDING = "Đang kiểm nghiệm";

    private final MauKiemNghiemRepository mauKiemNghiemRepository;
    private final MauChiTieuRepository mauChiTieuRepository;
    private final DamNhanKiemNghiemRepository damNhanKiemNghiemRepository;

    @Transactional(readOnly = true)
    public KetQuaKiemNghiemStatsResponse getStats() {
        List<KetQuaKiemNghiemItemResponse> items = loadItems(null);
        long tongMau = items.size();
        long datChuan = items.stream().filter(item -> RESULT_PASS.equals(item.ketQua())).count();
        long khongDat = items.stream().filter(item -> RESULT_FAIL.equals(item.ketQua())).count();
        long choKetQua = items.stream().filter(item -> RESULT_PENDING.equals(item.ketQua())).count();
        return KetQuaKiemNghiemStatsResponse.from(tongMau, datChuan, khongDat, choKetQua);
    }

    @Transactional(readOnly = true)
    public Page<KetQuaKiemNghiemItemResponse> search(String keyword, String resultFilter, Pageable pageable) {
        String normalizedFilter = normalizeResultFilter(resultFilter);
        List<KetQuaKiemNghiemItemResponse> filtered = loadItems(keyword).stream()
                .filter(item -> normalizedFilter == null || normalizedFilter.equals(item.ketQua()))
                .toList();
        return toPage(filtered, pageable);
    }

    @Transactional(readOnly = true)
    public KetQuaKiemNghiemDetailResponse getById(String maKetQua) {
        String maMau = parseKetQuaId(maKetQua);
        if (!damNhanKiemNghiemRepository.existsByIdMaMau(maMau)) {
            throw new RuntimeException("Khong tim thay ket qua kiem nghiem: " + maKetQua);
        }

        MauKiemNghiem mau = mauKiemNghiemRepository.findById(maMau)
                .orElseThrow(() -> new RuntimeException("Khong tim thay ket qua kiem nghiem: " + maKetQua));

        List<KetQuaKiemNghiemChiTieuResponse> chiTietChiTieu = getChiTieuResponses(maMau);
        String ketQua = resolveOverallResult(chiTietChiTieu);

        return new KetQuaKiemNghiemDetailResponse(
                buildKetQuaId(mau.getMaMau()),
                mau.getMaMau(),
                resolveTenCoSo(mau.getCoSoKinhDoanh()),
                mau.getTenMau(),
                mau.getLoaiMau(),
                mau.getNgayKiemNghiem(),
                mau.getPhongLab(),
                ketQua,
                resolveKetQuaMoTa(mau, ketQua),
                resolveLyDoKhongDat(mau, chiTietChiTieu, ketQua),
                buildChiTieuSummary(chiTietChiTieu, mau.getChiTieuKiemDinh()),
                computeScore(ketQua, chiTietChiTieu),
                mau.getFileCoDauMoc(),
                chiTietChiTieu
        );
    }

    private List<KetQuaKiemNghiemItemResponse> loadItems(String keyword) {
        return mauKiemNghiemRepository.searchKetQua(keyword, null, Pageable.unpaged())
                .getContent()
                .stream()
                .map(this::toItemResponse)
                .toList();
    }

    private KetQuaKiemNghiemItemResponse toItemResponse(MauKiemNghiem mau) {
        List<KetQuaKiemNghiemChiTieuResponse> chiTietChiTieu = getChiTieuResponses(mau.getMaMau());
        String ketQua = resolveOverallResult(chiTietChiTieu);
        return new KetQuaKiemNghiemItemResponse(
                buildKetQuaId(mau.getMaMau()),
                mau.getMaMau(),
                resolveTenCoSo(mau.getCoSoKinhDoanh()),
                mau.getTenMau(),
                mau.getLoaiMau(),
                mau.getNgayKiemNghiem(),
                mau.getPhongLab(),
                ketQua,
                buildChiTieuSummary(chiTietChiTieu, mau.getChiTieuKiemDinh()),
                computeScore(ketQua, chiTietChiTieu),
                mau.getFileCoDauMoc()
        );
    }

    private List<KetQuaKiemNghiemChiTieuResponse> getChiTieuResponses(String maMau) {
        return mauChiTieuRepository.findByMaMau(maMau)
                .stream()
                .map(this::toChiTieuResponse)
                .toList();
    }

    private KetQuaKiemNghiemChiTieuResponse toChiTieuResponse(MauChiTieu entity) {
        return new KetQuaKiemNghiemChiTieuResponse(
                entity.getMaChiTieu(),
                entity.getChiTieuKiemNghiem() != null ? entity.getChiTieuKiemNghiem().getTenChiTieu() : null,
                resolveGiaTriDo(entity),
                entity.getGioiHanChoPhep(),
                resolveChiTieuConclusion(entity.getKetQua())
        );
    }

    private Page<KetQuaKiemNghiemItemResponse> toPage(List<KetQuaKiemNghiemItemResponse> items, Pageable pageable) {
        if (pageable == null || pageable.isUnpaged()) {
            return new PageImpl<>(items);
        }

        int start = (int) pageable.getOffset();
        if (start >= items.size()) {
            return new PageImpl<>(List.of(), pageable, items.size());
        }

        int end = Math.min(start + pageable.getPageSize(), items.size());
        return new PageImpl<>(items.subList(start, end), pageable, items.size());
    }

    private String buildKetQuaId(String maMau) {
        return "KQ-" + maMau;
    }

    private String parseKetQuaId(String maKetQua) {
        if (maKetQua == null || maKetQua.isBlank()) {
            throw new RuntimeException("Ma ket qua khong duoc de trong");
        }

        String[] parts = maKetQua.split("-", 2);
        if (parts.length != 2 || !"KQ".equalsIgnoreCase(parts[0]) || parts[1].isBlank()) {
            throw new RuntimeException("Ma ket qua khong hop le. Dinh dang dung: KQ-{maMau}");
        }

        return parts[1];
    }

    private String normalizeResultFilter(String resultFilter) {
        if (resultFilter == null || resultFilter.isBlank()) {
            return null;
        }

        return switch (resultFilter.trim().toLowerCase(Locale.ROOT)) {
            case RESULT_PASS, RESULT_FAIL, RESULT_PENDING -> resultFilter.trim().toLowerCase(Locale.ROOT);
            default -> throw new RuntimeException("Bo loc ket qua khong hop le: " + resultFilter);
        };
    }

    private String  resolveOverallResult(List<KetQuaKiemNghiemChiTieuResponse> chiTietChiTieu) {
        if (chiTietChiTieu.isEmpty()) {
            return RESULT_PENDING;
        }

        boolean hasPending = false;
        for (KetQuaKiemNghiemChiTieuResponse item : chiTietChiTieu) {
            if (RESULT_FAIL.equals(item.ketLuan())) {
                return RESULT_FAIL;
            }
            if (!RESULT_PASS.equals(item.ketLuan())) {
                hasPending = true;
            }
        }

        return hasPending ? RESULT_PENDING : RESULT_PASS;
    }

    private String resolveChiTieuConclusion(String ketQua) {
        if (isBlank(ketQua)) {
            return RESULT_PENDING;
        }

        String normalized = normalizeText(ketQua);
        if (normalized.contains("khong đat") || normalized.contains("fail")) {
            return RESULT_FAIL;
        }
        if (normalized.contains("đat") || normalized.contains("pass")) {
            return RESULT_PASS;
        }
        return RESULT_PENDING;
    }

    private Integer computeScore(String overallResult, List<KetQuaKiemNghiemChiTieuResponse> chiTietChiTieu) {
        if (RESULT_PENDING.equals(overallResult) || chiTietChiTieu.isEmpty()) {
            return null;
        }

        long passCount = chiTietChiTieu.stream()
                .filter(item -> RESULT_PASS.equals(item.ketLuan()))
                .count();

        return (int) Math.round((passCount * 100.0) / chiTietChiTieu.size());
    }

    private String buildChiTieuSummary(List<KetQuaKiemNghiemChiTieuResponse> chiTietChiTieu, String fallback) {
        String joined = chiTietChiTieu.stream()
                .map(KetQuaKiemNghiemChiTieuResponse::tenChiTieu)
                .filter(name -> name != null && !name.isBlank())
                .distinct()
                .reduce((left, right) -> left + ", " + right)
                .orElse(null);
        return joined != null ? joined : fallback;
    }

    private String resolveKetQuaMoTa(MauKiemNghiem mau, String overallResult) {
        if (!isBlank(mau.getKetQuaKiemNghiem())) {
            return mau.getKetQuaKiemNghiem();
        }

        return switch (overallResult) {
            case RESULT_PASS -> "Đạt";
            case RESULT_FAIL -> "Không đạt";
            default -> "Chờ kết quả";
        };
    }

    private String resolveLyDoKhongDat(MauKiemNghiem mau,
                                       List<KetQuaKiemNghiemChiTieuResponse> chiTietChiTieu,
                                       String overallResult) {
        if (!isBlank(mau.getLyDoKhongDat())) {
            return mau.getLyDoKhongDat();
        }

        if (!RESULT_FAIL.equals(overallResult)) {
            return null;
        }

        String failedCriteria = chiTietChiTieu.stream()
                .filter(item -> RESULT_FAIL.equals(item.ketLuan()))
                .map(KetQuaKiemNghiemChiTieuResponse::tenChiTieu)
                .filter(name -> name != null && !name.isBlank())
                .distinct()
                .reduce((left, right) -> left + ", " + right)
                .orElse(null);

        return failedCriteria == null ? "Co chi tieu khong dat" : "Khong dat o chi tieu: " + failedCriteria;
    }

    private String resolveGiaTriDo(MauChiTieu entity) {
        if (!isBlank(entity.getGiaTriDo())) {
            return entity.getGiaTriDo();
        }

        if (isBlank(entity.getKetQua())) {
            return null;
        }

        String raw = entity.getKetQua();
        if (raw.contains(" - ")) {
            return raw.substring(0, raw.indexOf(" - ")).trim();
        }
        if (raw.contains(" – ")) {
            return raw.substring(0, raw.indexOf(" – ")).trim();
        }
        return null;
    }

    private String resolveTenCoSo(CoSoKinhDoanh coSoKinhDoanh) {
        return coSoKinhDoanh != null ? coSoKinhDoanh.getTenCoSo() : null;
    }

    private String normalizeText(String value) {
        return Normalizer.normalize(value, Normalizer.Form.NFD)
                .replaceAll("\\p{M}+", "")
                .toLowerCase(Locale.ROOT)
                .trim();
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }



}
