package com.danang.safefood.service;

import com.danang.safefood.dto.request.HoSoDangKiRequest;
import com.danang.safefood.dto.response.HoSoDangKiResponse;
import com.danang.safefood.dto.response.MyBusinessResponse;
import com.danang.safefood.entity.CoSoKinhDoanh;
import com.danang.safefood.entity.HoSoDangKiKinhDoanh;
import com.danang.safefood.entity.LoaiGiayTo;
import com.danang.safefood.repository.CoSoKinhDoanhRepository;
import com.danang.safefood.repository.HoSoDangKiKinhDoanhRepository;
import com.danang.safefood.repository.LoaiGiayToRepository;
import com.danang.safefood.util.IdGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MyBusinessService {

    private final CoSoKinhDoanhRepository coSoRepo;
    private final HoSoDangKiKinhDoanhRepository hoSoRepo;
    private final LoaiGiayToRepository loaiGiayToRepo;

    @Transactional(readOnly = true)
    public List<MyBusinessResponse> getMyBusinesses(Long taiKhoanId) {
        return coSoRepo.findByChuSoHuu_TaiKhoan_Id(taiKhoanId)
                .stream()
                .map(MyBusinessResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<HoSoDangKiResponse> getMyHoSoList(Long taiKhoanId) {
        return hoSoRepo.findByCoSoKinhDoanh_ChuSoHuu_TaiKhoan_IdOrderByNgayNopDesc(taiKhoanId)
                .stream()
                .map(HoSoDangKiResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<HoSoDangKiResponse> getHoSoByCoSo(String maCoSo) {
        return hoSoRepo.findByCoSoKinhDoanh_MaCoSoOrderByNgayNopDesc(maCoSo)
                .stream()
                .map(HoSoDangKiResponse::from)
                .toList();
    }

    /**
     * Tạo mới hồ sơ.
     * Nếu cơ sở đã có hồ sơ với cùng loại giấy tờ thì sẽ cập nhật thay vì tạo mới.
     */
    @Transactional
    public HoSoDangKiResponse createHoSo(HoSoDangKiRequest req, Long taiKhoanId) {
        CoSoKinhDoanh coSo = findOwnedCoSo(req.maCoSo(), taiKhoanId);
        LoaiGiayTo loai = req.maLoaiGiayTo() != null
                ? loaiGiayToRepo.findById(req.maLoaiGiayTo())
                        .orElseThrow(() -> new RuntimeException("Không tìm thấy loại giấy tờ: " + req.maLoaiGiayTo()))
                : null;

        // Kiểm tra trùng loại
        if (loai != null) {
            var existing = hoSoRepo.findByCoSoKinhDoanh_MaCoSoOrderByNgayNopDesc(coSo.getMaCoSo())
                    .stream()
                    .filter(h -> h.getLoaiGiayTo() != null
                            && h.getLoaiGiayTo().getMaLoaiGiayTo().equals(loai.getMaLoaiGiayTo()))
                    .findFirst();
            if (existing.isPresent()) {
                // Đã có → update thay vì tạo mới
                return updateHoSoEntity(existing.get(), req, loai);
            }
        }

        HoSoDangKiKinhDoanh hs = HoSoDangKiKinhDoanh.builder()
                .maHoSo(IdGenerator.generate("HS"))
                .ngayNop(req.ngayNop() != null ? req.ngayNop() : LocalDate.now())
                .ngayCap(req.ngayCap())
                .ngayHetHan(req.ngayHetHan())
                .trangThai(req.trangThai() != null ? req.trangThai() : "Cho duyet")
                .urlFile(req.urlFile())
                .coSoKinhDoanh(coSo)
                .loaiGiayTo(loai)
                .build();

        return HoSoDangKiResponse.from(hoSoRepo.save(hs));
    }

    @Transactional
    public HoSoDangKiResponse updateHoSo(String maHoSo, HoSoDangKiRequest req, Long taiKhoanId) {
        HoSoDangKiKinhDoanh hs = hoSoRepo.findById(maHoSo)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hồ sơ: " + maHoSo));

        ensureOwner(hs.getCoSoKinhDoanh(), taiKhoanId);

        if (req.maCoSo() != null && !req.maCoSo().equals(hs.getCoSoKinhDoanh().getMaCoSo())) {
            CoSoKinhDoanh newCoSo = findOwnedCoSo(req.maCoSo(), taiKhoanId);
            hs.setCoSoKinhDoanh(newCoSo);
        }

        LoaiGiayTo loai = req.maLoaiGiayTo() != null
                ? loaiGiayToRepo.findById(req.maLoaiGiayTo()).orElse(hs.getLoaiGiayTo())
                : hs.getLoaiGiayTo();

        return updateHoSoEntity(hs, req, loai);
    }

    private HoSoDangKiResponse updateHoSoEntity(HoSoDangKiKinhDoanh hs, HoSoDangKiRequest req, LoaiGiayTo loai) {
        if (loai != null) hs.setLoaiGiayTo(loai);
        if (req.ngayNop() != null) hs.setNgayNop(req.ngayNop());
        if (req.ngayCap() != null) hs.setNgayCap(req.ngayCap());
        if (req.ngayHetHan() != null) hs.setNgayHetHan(req.ngayHetHan());
        if (req.trangThai() != null) hs.setTrangThai(req.trangThai());
        if (req.urlFile() != null) hs.setUrlFile(req.urlFile());
        return HoSoDangKiResponse.from(hoSoRepo.save(hs));
    }

    @Transactional
    public void deleteHoSo(String maHoSo, Long taiKhoanId) {
        HoSoDangKiKinhDoanh hs = hoSoRepo.findById(maHoSo)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hồ sơ: " + maHoSo));
        ensureOwner(hs.getCoSoKinhDoanh(), taiKhoanId);
        hoSoRepo.delete(hs);
    }

    private CoSoKinhDoanh findOwnedCoSo(String maCoSo, Long taiKhoanId) {
        CoSoKinhDoanh coSo = coSoRepo.findById(maCoSo)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy cơ sở: " + maCoSo));
        ensureOwner(coSo, taiKhoanId);
        return coSo;
    }

    private void ensureOwner(CoSoKinhDoanh coSo, Long taiKhoanId) {
        if (coSo == null || coSo.getChuSoHuu() == null
                || coSo.getChuSoHuu().getTaiKhoan() == null
                || !taiKhoanId.equals(coSo.getChuSoHuu().getTaiKhoan().getId())) {
            throw new RuntimeException("Bạn không có quyền với cơ sở này");
        }
    }
}
