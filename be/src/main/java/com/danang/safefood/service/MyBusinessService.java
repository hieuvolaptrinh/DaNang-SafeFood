package com.danang.safefood.service;

import com.danang.safefood.dto.request.HoSoDangKiRequest;
import com.danang.safefood.dto.response.HoSoDangKiResponse;
import com.danang.safefood.dto.response.MyBusinessResponse;
import com.danang.safefood.entity.CoSoKinhDoanh;
import com.danang.safefood.entity.HoSoDangKiKinhDoanh;
import com.danang.safefood.repository.CoSoKinhDoanhRepository;
import com.danang.safefood.repository.HoSoDangKiKinhDoanhRepository;
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

    /** Lấy danh sách cơ sở của CSKD (chủ sở hữu = tài khoản đăng nhập). */
    @Transactional(readOnly = true)
    public List<MyBusinessResponse> getMyBusinesses(Long taiKhoanId) {
        return coSoRepo.findByChuSoHuu_TaiKhoan_Id(taiKhoanId)
                .stream()
                .map(MyBusinessResponse::from)
                .toList();
    }

    /** Lấy danh sách hồ sơ đăng kí kinh doanh của CSKD (tất cả cơ sở). */
    @Transactional(readOnly = true)
    public List<HoSoDangKiResponse> getMyHoSoList(Long taiKhoanId) {
        return hoSoRepo.findByCoSoKinhDoanh_ChuSoHuu_TaiKhoan_IdOrderByNgayNopDesc(taiKhoanId)
                .stream()
                .map(HoSoDangKiResponse::from)
                .toList();
    }

    /** Lấy hồ sơ theo cơ sở. */
    @Transactional(readOnly = true)
    public List<HoSoDangKiResponse> getHoSoByCoSo(String maCoSo) {
        return hoSoRepo.findByCoSoKinhDoanh_MaCoSoOrderByNgayNopDesc(maCoSo)
                .stream()
                .map(HoSoDangKiResponse::from)
                .toList();
    }

    /** Tạo mới hồ sơ đăng kí. */
    @Transactional
    public HoSoDangKiResponse createHoSo(HoSoDangKiRequest req, Long taiKhoanId) {
        CoSoKinhDoanh coSo = findOwnedCoSo(req.maCoSo(), taiKhoanId);

        HoSoDangKiKinhDoanh hs = HoSoDangKiKinhDoanh.builder()
                .maHoSo(IdGenerator.generate("HS"))
                .ngayNop(req.ngayNop() != null ? req.ngayNop() : LocalDate.now())
                .trangThai(req.trangThai() != null ? req.trangThai() : "Chua duyet")
                .coSoKinhDoanh(coSo)
                .build();

        return HoSoDangKiResponse.from(hoSoRepo.save(hs));
    }

    /** Cập nhật hồ sơ. */
    @Transactional
    public HoSoDangKiResponse updateHoSo(String maHoSo, HoSoDangKiRequest req, Long taiKhoanId) {
        HoSoDangKiKinhDoanh hs = hoSoRepo.findById(maHoSo)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hồ sơ: " + maHoSo));

        // Đảm bảo CSKD chỉ sửa được hồ sơ thuộc cơ sở của mình
        ensureOwner(hs.getCoSoKinhDoanh(), taiKhoanId);

        if (req.maCoSo() != null && !req.maCoSo().equals(hs.getCoSoKinhDoanh().getMaCoSo())) {
            CoSoKinhDoanh newCoSo = findOwnedCoSo(req.maCoSo(), taiKhoanId);
            hs.setCoSoKinhDoanh(newCoSo);
        }
        if (req.ngayNop() != null) hs.setNgayNop(req.ngayNop());
        if (req.trangThai() != null) hs.setTrangThai(req.trangThai());

        return HoSoDangKiResponse.from(hoSoRepo.save(hs));
    }

    /** Xoá hồ sơ. */
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
