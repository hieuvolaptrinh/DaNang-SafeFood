package com.danang.safefood.service;

import com.danang.safefood.config.security.jwt.JwtPrincipal;
import com.danang.safefood.dto.request.CreateYeuCauKiemNghiemRequest;
import com.danang.safefood.dto.request.UpdateKetQuaKiemNghiemRequest;
import com.danang.safefood.dto.response.NguoiDungResponse;
import com.danang.safefood.dto.response.YeuCauKiemNghiemResponse;
import com.danang.safefood.dto.response.YeuCauKiemNghiemMauOptionResponse;
import com.danang.safefood.dto.response.YeuCauKiemNghiemStatsResponse;
import com.danang.safefood.entity.CoSoKinhDoanh;
import com.danang.safefood.entity.DamNhanKiemNghiem;
import com.danang.safefood.entity.DamNhanKiemNghiemId;
import com.danang.safefood.entity.MauChiTieu;
import com.danang.safefood.entity.MauKiemNghiem;
import com.danang.safefood.entity.NguoiDung;
import com.danang.safefood.repository.CoSoKinhDoanhRepository;
import com.danang.safefood.repository.ChiTieuKiemNghiemRepository;
import com.danang.safefood.repository.DamNhanKiemNghiemRepository;
import com.danang.safefood.repository.MauChiTieuRepository;
import com.danang.safefood.repository.MauKiemNghiemRepository;
import com.danang.safefood.repository.NguoiDungRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.Normalizer;
import java.time.LocalDate;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class YeuCauKiemNghiemService {

    private static final String UI_PENDING = "pending";
    private static final String UI_PROCESSING = "processing";
    private static final String UI_COMPLETED = "completed";

    private final DamNhanKiemNghiemRepository damNhanRepository;
    private final MauKiemNghiemRepository mauRepository;
    private final MauChiTieuRepository mauChiTieuRepository;
    private final ChiTieuKiemNghiemRepository chiTieuRepository;
    private final CoSoKinhDoanhRepository coSoRepository;
    private final NguoiDungRepository nguoiDungRepository;

    @Transactional
    public YeuCauKiemNghiemResponse createYeuCau(CreateYeuCauKiemNghiemRequest req, JwtPrincipal jwtPrincipal) {
        if (req.maMauLienQuan() == null || req.maMauLienQuan().isBlank()) {
            throw new RuntimeException("maMauLienQuan la bat buoc");
        }
        if (req.maNguoiKiemNghiem() == null || req.maNguoiKiemNghiem().isBlank()) {
            throw new RuntimeException("maNguoiKiemNghiem la bat buoc de tao ma yeu cau");
        }

        CoSoKinhDoanh coSo = coSoRepository.findById(req.maCoSo())
                .orElseThrow(() -> new RuntimeException("Khong tim thay co so kinh doanh: " + req.maCoSo()));
        MauKiemNghiem mau = mauRepository.findById(req.maMauLienQuan())
                .orElseThrow(() -> new RuntimeException("Khong tim thay mau kiem nghiem: " + req.maMauLienQuan()));
        NguoiDung nguoiKiemNghiem = nguoiDungRepository.findById(req.maNguoiKiemNghiem())
                .orElseThrow(() -> new RuntimeException("Khong tim thay nguoi kiem nghiem: " + req.maNguoiKiemNghiem()));

        if (damNhanRepository.existsByIdMaNguoiKiemNghiemAndIdMaMau(req.maNguoiKiemNghiem(), req.maMauLienQuan())) {
            throw new RuntimeException("Yeu cau kiem nghiem cho mau va kiem nghiem vien nay da ton tai");
        }

        mau.setCoSoKinhDoanh(coSo);
        mau.setLoaiMau(req.loaiMau());
        mau.setNgayYeuCau(req.ngayYeuCau());
        mau.setHanHoanThanh(req.hanHoanThanh());
        mau.setPhongLab(req.phongLab());
        mau.setNoiDung(req.noidungYeuCau());
        mau.setChiTieuKiemDinh(req.chiTieuKiemDinh());
        mau.setTrangThai(toStoredStatus(UI_PENDING));
        mau.setNgayTao(LocalDate.now());
        mau.setMaNguoiTao(resolveCurrentNguoiDungId(jwtPrincipal));
        mauRepository.save(mau);

        // Bridge thanh-tra -> kiem-nghiem:
        // FE page /kiem-nghiem/mau/{maMau} reads from table mau_chi_tieu.
        // When thanh tra creates a request, we initialize the criteria rows (blank results)
        // based on req.chiTieuKiemDinh so kiem dinh vien can start filling in results.
        ensureMauChiTieuInitialized(mau);

        DamNhanKiemNghiem damNhan = DamNhanKiemNghiem.builder()
                .id(new DamNhanKiemNghiemId(req.maNguoiKiemNghiem(), req.maMauLienQuan()))
                .nguoiKiemNghiem(nguoiKiemNghiem)
                .mauKiemNghiem(mau)
                .build();
        damNhanRepository.save(damNhan);

        return toResponse(damNhan);
    }

    private void ensureMauChiTieuInitialized(MauKiemNghiem mau) {
        if (mau == null || mau.getMaMau() == null || mau.getMaMau().isBlank()) {
            return;
        }
        String raw = mau.getChiTieuKiemDinh();
        if (raw == null || raw.isBlank()) {
            return;
        }

        if (!mauChiTieuRepository.findByMaMau(mau.getMaMau()).isEmpty()) {
            return; // already initialized
        }

        Set<String> maChiTieus = resolveMaChiTieuFromRequested(raw);
        if (maChiTieus.isEmpty()) {
            return;
        }

        for (String maChiTieu : maChiTieus) {
            if (maChiTieu == null || maChiTieu.isBlank()) continue;
            if (!chiTieuRepository.existsById(maChiTieu)) continue;
            MauChiTieu entity = MauChiTieu.builder()
                    .maMau(mau.getMaMau())
                    .maChiTieu(maChiTieu)
                    .build();
            mauChiTieuRepository.save(entity);
        }
    }

    /**
     * UI sends broad categories from CreateInspectionRequestForm:
     * - "Vi sinh" -> CT001..CT004 (microbiology-related)
     * - "Kim loại nặng" -> CT005
     * Also try best-effort matching for free-text "Khác" against danh muc chi tieu.
     */
    private Set<String> resolveMaChiTieuFromRequested(String raw) {
        Set<String> result = new LinkedHashSet<>();
        for (String token : raw.split(",")) {
            String t = token == null ? "" : token.trim();
            if (t.isBlank()) continue;

            String norm = normalizeVi(t);
            if ("vi sinh".equals(norm)) {
                result.add("CT001");
                result.add("CT002");
                result.add("CT003");
                result.add("CT004");
                continue;
            }
            if ("kim loai nang".equals(norm)) {
                result.add("CT005");
                continue;
            }

            // Best-effort: match token to chi_tieu_kiem_nghiem.tenChiTieu (ignore accents/case/spaces).
            String normToken = norm;
            chiTieuRepository.findAll().forEach(item -> {
                String ten = item.getTenChiTieu();
                if (ten == null) return;
                String normTen = normalizeVi(ten);
                if (normTen.equals(normToken) || normTen.contains(normToken) || normToken.contains(normTen)) {
                    result.add(item.getMaChiTieu());
                }
            });
        }
        return result;
    }

    private static String normalizeVi(String value) {
        if (value == null) return "";
        String normalized = Normalizer.normalize(value, Normalizer.Form.NFD)
                .replaceAll("\\p{M}+", "");
        return normalized
                .toLowerCase(Locale.ROOT)
                .replace('đ', 'd')
                .replaceAll("\\s+", " ")
                .trim();
    }

    @Transactional(readOnly = true)
    public Page<YeuCauKiemNghiemResponse> searchYeuCau(String keyword, String status, Pageable pageable) {
        List<String> rawStatuses = expandStatusFilter(status);
        return damNhanRepository.search(keyword, rawStatuses, rawStatuses.isEmpty(), pageable)
                .map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public YeuCauKiemNghiemResponse getYeuCauById(String maYeuCau) {
        DamNhanKiemNghiem damNhan = damNhanRepository.findById(parsePublicId(maYeuCau))
                .orElseThrow(() -> new RuntimeException("Khong tim thay yeu cau kiem nghiem: " + maYeuCau));
        return toResponse(damNhan);
    }

    @Transactional
    public YeuCauKiemNghiemResponse updateKetQua(String maYeuCau, UpdateKetQuaKiemNghiemRequest req) {
        DamNhanKiemNghiem damNhan = damNhanRepository.findById(parsePublicId(maYeuCau))
                .orElseThrow(() -> new RuntimeException("Khong tim thay yeu cau kiem nghiem: " + maYeuCau));

        MauKiemNghiem mau = damNhan.getMauKiemNghiem();
        mau.setKetQuaKiemNghiem(req.ketQuaKiemNghiem());
        mau.setLyDoKhongDat(blankToNull(req.lyDoKhongDat()));
        mau.setFileCoDauMoc(blankToNull(req.fileCoDauMoc()));
        mau.setTrangThai(toStoredStatus(req.trangThai()));

        String uiStatus = toUiStatus(mau.getTrangThai());
        if ((UI_PROCESSING.equals(uiStatus) || UI_COMPLETED.equals(uiStatus)) && mau.getNgayKiemNghiem() == null) {
            mau.setNgayKiemNghiem(LocalDate.now());
        }

        mauRepository.save(mau);
        return toResponse(damNhan);
    }

    @Transactional(readOnly = true)
    public YeuCauKiemNghiemStatsResponse getStats() {
        long total = damNhanRepository.count();
        long pending = damNhanRepository.countByMauKiemNghiem_TrangThaiIn(expandStatusFilter(UI_PENDING));
        long processing = damNhanRepository.countByMauKiemNghiem_TrangThaiIn(expandStatusFilter(UI_PROCESSING));
        long completed = damNhanRepository.countByMauKiemNghiem_TrangThaiIn(expandStatusFilter(UI_COMPLETED));
        return YeuCauKiemNghiemStatsResponse.from(total, pending, processing, completed);
    }

    @Transactional(readOnly = true)
    public List<YeuCauKiemNghiemMauOptionResponse> getMauOptions() {
        return mauRepository.findAll().stream()
                .filter(mau -> mau.getCoSoKinhDoanh() != null)
                .map(mau -> new YeuCauKiemNghiemMauOptionResponse(
                        mau.getMaMau(),
                        mau.getCoSoKinhDoanh() != null ? mau.getCoSoKinhDoanh().getMaCoSo() : null,
                        mau.getTenMau(),
                        mau.getLoaiMau(),
                        mau.getCoSoKinhDoanh() != null ? mau.getCoSoKinhDoanh().getTenCoSo() : null,
                        mau.getNgayThu()
                ))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<NguoiDungResponse> getKiemNghiemVienOptions() {
        return nguoiDungRepository.findByQuyenHan("CB_KIEM_DINH").stream()
                .map(NguoiDungResponse::from)
                .toList();
    }

    private YeuCauKiemNghiemResponse toResponse(DamNhanKiemNghiem damNhan) {
        MauKiemNghiem mau = damNhan.getMauKiemNghiem();
        CoSoKinhDoanh coSo = mau.getCoSoKinhDoanh();
        return new YeuCauKiemNghiemResponse(
                toPublicId(damNhan.getId()),
                coSo != null ? coSo.getTenCoSo() : null,
                mau.getLoaiMau(),
                mau.getNgayYeuCau(),
                mau.getHanHoanThanh(),
                toUiStatus(mau.getTrangThai()),
                mau.getPhongLab(),
                mau.getKetQuaKiemNghiem(),
                mau.getLyDoKhongDat(),
                mau.getNoiDung(),
                mau.getChiTieuKiemDinh(),
                mau.getMaMau(),
                mau.getNgayTao() != null ? mau.getNgayTao() : mau.getNgayYeuCau(),
                mau.getMaNguoiTao()
        );
    }

    private String toPublicId(DamNhanKiemNghiemId id) {
        return "YC-" + id.getMaMau() + "-" + id.getMaNguoiKiemNghiem();
    }

    private DamNhanKiemNghiemId parsePublicId(String maYeuCau) {
        if (maYeuCau == null || maYeuCau.isBlank()) {
            throw new RuntimeException("Ma yeu cau khong duoc de trong");
        }

        String[] parts = maYeuCau.split("-", 3);
        if (parts.length != 3 || !"YC".equalsIgnoreCase(parts[0])) {
            throw new RuntimeException("Ma yeu cau khong hop le. Dinh dang dung: YC-{maMau}-{maNguoiKiemNghiem}");
        }

        return new DamNhanKiemNghiemId(parts[2], parts[1]);
    }

    private List<String> expandStatusFilter(String status) {
        if (status == null || status.isBlank()) {
            return List.of();
        }

        return switch (status.trim().toLowerCase(Locale.ROOT)) {
            case UI_PENDING -> List.of("Chờ xử lý", "Chờ xét nghiệm");
            case UI_PROCESSING -> List.of("Đang kiểm nghiệm", "Đang xét nghiệm");
            case UI_COMPLETED -> List.of("Có kết quả", "Hoàn thành");
            default -> List.of(status.trim());
        };
    }

    private String toUiStatus(String rawStatus) {
        if (rawStatus == null || rawStatus.isBlank()) {
            return UI_PENDING;
        }

        return switch (rawStatus.trim().toLowerCase(Locale.ROOT)) {
            case "pending", "chờ xử lý", "chờ xét nghiệm" -> UI_PENDING;
            case "processing", "đang kiểm nghiệm", "đang xét nghiệm" -> UI_PROCESSING;
            case "completed", "có kết quả", "hoàn thành" -> UI_COMPLETED;
            default -> UI_PENDING;
        };
    }

    private String toStoredStatus(String status) {
        if (status == null || status.isBlank()) {
            throw new RuntimeException("Trang thai khong duoc de trong");
        }

        return switch (status.trim().toLowerCase(Locale.ROOT)) {
            case UI_PENDING, "chờ xử lý", "chờ xét nghiệm" -> "Chờ xử lý";
            case UI_PROCESSING, "đang kiểm nghiệm", "đang xét nghiệm" -> "Đang xét nghiệm";
            case UI_COMPLETED, "có kết quả", "hoàn thành" -> "Hoàn thành";
            default -> throw new RuntimeException("Trang thai khong hop le: " + status);
        };
    }

    private String resolveCurrentNguoiDungId(JwtPrincipal jwtPrincipal) {
        if (jwtPrincipal == null || jwtPrincipal.userId() == null) {
            return null;
        }

        return nguoiDungRepository.findByTaiKhoan_Id(jwtPrincipal.userId())
                .map(NguoiDung::getMaNguoiDung)
                .orElse(null);
    }

    private String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}
