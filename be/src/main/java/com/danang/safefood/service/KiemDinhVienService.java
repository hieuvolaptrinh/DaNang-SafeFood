package com.danang.safefood.service;

import com.danang.safefood.dto.request.CapNhatKetQuaChiTieuRequest;
import com.danang.safefood.dto.request.CapNhatTrangThaiMauRequest;
import com.danang.safefood.dto.request.ViPhamRequest;
import com.danang.safefood.dto.response.MauChiTieuResponse;
import com.danang.safefood.dto.response.MauKiemNghiemResponse;
import com.danang.safefood.dto.response.ViPhamResponse;
import com.danang.safefood.entity.*;
import com.danang.safefood.repository.*;
import com.danang.safefood.util.IdGenerator;
import com.danang.safefood.util.TrangThaiViPham;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class KiemDinhVienService {

    private final MauKiemNghiemRepository mauKiemNghiemRepo;
    private final MauChiTieuRepository mauChiTieuRepo;
    private final ChiTieuKiemNghiemRepository chiTieuRepo;
    private final HoSoThanhTraRepository hoSoThanhTraRepo;
    private final LoaiViPhamRepository loaiViPhamRepo;
    private final ViPhamRepository viPhamRepo;

    // =========================================================
    // 1. Cập nhật trạng thái mẫu kiểm định
    // =========================================================

    @Transactional(readOnly = true)
    public Page<MauKiemNghiemResponse> getDanhSachMau(String trangThai, Pageable pageable) {
        Page<MauKiemNghiem> page = (trangThai != null && !trangThai.isBlank())
                ? mauKiemNghiemRepo.findByTrangThaiOrderByNgayYeuCauDesc(trangThai, pageable)
                : mauKiemNghiemRepo.findAllByOrderByNgayYeuCauDesc(pageable);
        return page.map(MauKiemNghiemResponse::from);
    }

    @Transactional(readOnly = true)
    public MauKiemNghiemResponse getMauById(String maMau) {
        MauKiemNghiem mau = mauKiemNghiemRepo.findById(maMau)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy mẫu kiểm định: " + maMau));
        return MauKiemNghiemResponse.from(mau);
    }

    @Transactional
    public MauKiemNghiemResponse capNhatTrangThaiMau(String maMau, CapNhatTrangThaiMauRequest req) {
        MauKiemNghiem mau = mauKiemNghiemRepo.findById(maMau)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy mẫu kiểm định: " + maMau));

        // Kiểm tra chuyển trạng thái hợp lệ
        validateChuyenTrangThai(mau.getTrangThai(), req.trangThai());

        mau.setTrangThai(req.trangThai());

        // Nếu chuyển sang "Đang kiểm nghiệm" hoặc "Đang xét nghiệm", cập nhật ngày kiểm
        // nghiệm
        if ("Đang kiểm nghiệm".equals(req.trangThai()) || "Đang xét nghiệm".equals(req.trangThai())) {
            if (mau.getNgayKiemNghiem() == null) {
                mau.setNgayKiemNghiem(java.time.LocalDate.now());
            }
        }

        return MauKiemNghiemResponse.from(mauKiemNghiemRepo.save(mau));
    }

    // =========================================================
    // 2. Cập nhật kết quả chỉ tiêu mẫu
    // =========================================================

    @Transactional(readOnly = true)
    public List<MauChiTieuResponse> getChiTieuCuaMau(String maMau) {
        // Xác nhận mẫu tồn tại
        mauKiemNghiemRepo.findById(maMau)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy mẫu kiểm định: " + maMau));

        return mauChiTieuRepo.findByMaMau(maMau)
                .stream()
                .map(MauChiTieuResponse::from)
                .collect(Collectors.toList());
    }

    @Transactional
    public List<MauChiTieuResponse> capNhatKetQuaChiTieu(String maMau, CapNhatKetQuaChiTieuRequest req) {
        MauKiemNghiem mau = mauKiemNghiemRepo.findById(maMau)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy mẫu kiểm định: " + maMau));

        // Chỉ cho phép cập nhật khi mẫu đang được kiểm nghiệm
        if ("Hủy".equals(mau.getTrangThai())) {
            throw new RuntimeException("Không thể cập nhật kết quả cho mẫu đã hủy");
        }

        for (CapNhatKetQuaChiTieuRequest.ChiTieuKetQua item : req.chiTieus()) {
            // Xác nhận chỉ tiêu tồn tại
            chiTieuRepo.findById(item.maChiTieu())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy chỉ tiêu: " + item.maChiTieu()));

            MauChiTieu.MauChiTieuId id = new MauChiTieu.MauChiTieuId(maMau, item.maChiTieu());

            if (mauChiTieuRepo.existsById(id)) {
                // Cập nhật bản ghi đã có
                mauChiTieuRepo.updateKetQua(maMau, item.maChiTieu(), item.ketQua());
            } else {
                // Tạo mới nếu chưa có
                MauChiTieu mauChiTieu = MauChiTieu.builder()
                        .maMau(maMau)
                        .maChiTieu(item.maChiTieu())
                        .ketQua(item.ketQua())
                        .build();
                mauChiTieuRepo.save(mauChiTieu);
            }
        }

        return mauChiTieuRepo.findByMaMau(maMau)
                .stream()
                .map(MauChiTieuResponse::from)
                .collect(Collectors.toList());
    }

    // =========================================================
    // 3. Tạo đơn Vi phạm
    // =========================================================

    @Transactional
    public ViPhamResponse taoViPham(ViPhamRequest req) {
        HoSoThanhTra hoSo = hoSoThanhTraRepo.findById(req.maHoSo())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hồ sơ thanh tra: " + req.maHoSo()));

        LoaiViPham loaiViPham = loaiViPhamRepo.findById(req.maLoaiViPham())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy loại vi phạm: " + req.maLoaiViPham()));

        String mucDo = (req.mucDo() != null && !req.mucDo().isBlank()) ? req.mucDo() : "Trung bình";

        CoSoKinhDoanh coSoKinhDoanh = hoSo.getLichThanhTra() != null
                ? hoSo.getLichThanhTra().getCoSoKinhDoanh()
                : null;

        ViPham viPham = ViPham.builder()
                .maViPham(IdGenerator.generate("VP"))
                .moTaThem(req.moTaThem())
                .khacPhuc(req.khacPhuc())
                .trangThaiPheDuyet(TrangThaiViPham.CHO_DUYET)
                .mucDo(mucDo)
                .hoSoThanhTra(hoSo)
                .loaiViPham(loaiViPham)
                .coSoKinhDoanh(coSoKinhDoanh)
                .build();

        return ViPhamResponse.from(viPhamRepo.save(viPham));
    }

    @Transactional(readOnly = true)
    public Page<ViPhamResponse> getDanhSachViPham(String trangThaiPheDuyet, Pageable pageable) {
        TrangThaiViPham trangThai = null;
        if (trangThaiPheDuyet != null && !trangThaiPheDuyet.isBlank()) {
            trangThai = TrangThaiViPham.fromValue(trangThaiPheDuyet);
        }
        Page<ViPham> page = (trangThai != null)
                ? viPhamRepo.findByTrangThaiPheDuyetOrderByMaViPhamDesc(trangThai, pageable)
                : viPhamRepo.findAllByOrderByMaViPhamDesc(pageable);
        return page.map(ViPhamResponse::from);
    }

    @Transactional(readOnly = true)
    public List<ViPhamResponse> getViPhamTheoHoSo(String maHoSo, Pageable pageable) {
        hoSoThanhTraRepo.findById(maHoSo)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hồ sơ thanh tra: " + maHoSo));
        return viPhamRepo.findByHoSoThanhTra_MaHoSoOrderByMaViPhamDesc(maHoSo, pageable)
                .stream()
                .map(ViPhamResponse::from)
                .collect(Collectors.toList());
    }

    // =========================================================
    // Private helpers
    // =========================================================

    /**
     * Kiểm tra chuyển trạng thái hợp lệ theo luồng nghiệp vụ.
     * Chờ xử lý → Chờ xét nghiệm / Đang kiểm nghiệm / Hủy
     * Chờ xét nghiệm → Đang xét nghiệm / Hủy
     * Đang kiểm nghiệm | Đang xét nghiệm → Có kết quả / Hoàn thành / Hủy
     * Có kết quả → Hoàn thành
     */
    private void validateChuyenTrangThai(String hienTai, String moi) {
        boolean hopLe = switch (hienTai) {
            case "Chờ xử lý" -> List.of("Chờ xét nghiệm", "Đang kiểm nghiệm", "Hủy").contains(moi);
            case "Chờ xét nghiệm" -> List.of("Đang xét nghiệm", "Hủy").contains(moi);
            case "Đang kiểm nghiệm", "Đang xét nghiệm" -> List.of("Có kết quả", "Hoàn thành", "Hủy").contains(moi);
            case "Có kết quả" -> "Hoàn thành".equals(moi);
            default -> false;
        };

        if (!hopLe) {
            throw new RuntimeException(
                    String.format("Không thể chuyển trạng thái từ '%s' sang '%s'", hienTai, moi));
        }
    }
}
