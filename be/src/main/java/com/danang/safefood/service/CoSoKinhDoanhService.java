package com.danang.safefood.service;

import com.danang.safefood.dto.request.CoSoKinhDoanhDangKyRequest;
import com.danang.safefood.dto.request.KiemTraCSKDRequest;
import com.danang.safefood.dto.response.CoSoKinhDoanhDetailResponse;
import com.danang.safefood.dto.response.CoSoKinhDoanhResponse;
import com.danang.safefood.dto.response.CoSoKinhDoanhSearchResponse;
import com.danang.safefood.dto.response.GiayChungNhanResponse;
import com.danang.safefood.dto.response.GiayPhepResponse;
import com.danang.safefood.entity.CoSoKinhDoanh;
import com.danang.safefood.entity.LichThanhTra;
import com.danang.safefood.entity.NguoiDung;
import com.danang.safefood.entity.PhuongXa;
import com.danang.safefood.repository.ChungNhanATVSTPRepository;
import com.danang.safefood.repository.CoSoKinhDoanhRepository;
import com.danang.safefood.repository.CoSoLoaiHinhRepository;
import com.danang.safefood.repository.GiayPhepRepository;
import com.danang.safefood.repository.LichThanhTraRepository;
import com.danang.safefood.repository.NguoiDungRepository;
import com.danang.safefood.repository.ViPhamRepository;
import com.danang.safefood.util.IdGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CoSoKinhDoanhService {

    private final CoSoKinhDoanhRepository coSoRepo;
    private final ChungNhanATVSTPRepository chungNhanRepo;
    private final GiayPhepRepository giayPhepRepo;
    private final LichThanhTraRepository lichThanhTraRepo;
    private final NguoiDungRepository nguoiDungRepository;
    private final ViPhamRepository viPhamRepo;
    private final CoSoLoaiHinhRepository coSoLoaiHinhRepo;

    @Transactional(readOnly = true)
    public Page<CoSoKinhDoanhResponse> getAll(String trangThai, String maPX, Pageable pageable) {
        return coSoRepo.findWithFilter(trangThai, maPX, pageable).map(CoSoKinhDoanhResponse::from);
    }

    @Transactional(readOnly = true)
    public Page<CoSoKinhDoanhSearchResponse> search(String keyword, String trangThai, String maPX, Pageable pageable) {
        Page<CoSoKinhDoanh> page = coSoRepo.searchWithFilters(keyword, trangThai, maPX, pageable);
        
        return page.map(coSo -> {
            Integer soViPham = viPhamRepo.countByCoSoKinhDoanh_MaCoSo(coSo.getMaCoSo());
            List<String> loaiHinh = coSoLoaiHinhRepo.findLoaiHinhByMaCoSo(coSo.getMaCoSo());
            return CoSoKinhDoanhSearchResponse.from(coSo, soViPham, loaiHinh);
        });
    }

    @Transactional(readOnly = true)
    public CoSoKinhDoanhResponse getById(String id) {
        CoSoKinhDoanh entity = coSoRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy cơ sở kinh doanh: " + id));
        return CoSoKinhDoanhResponse.from(entity);
    }

    @Transactional(readOnly = true)
    public CoSoKinhDoanhDetailResponse getDetailById(String id) {
        CoSoKinhDoanh entity = coSoRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy cơ sở kinh doanh: " + id));
        
        CoSoKinhDoanhResponse coSoResponse = CoSoKinhDoanhResponse.from(entity);
        Integer soViPham = viPhamRepo.countByCoSoKinhDoanh_MaCoSo(id);
        List<String> loaiHinh = coSoLoaiHinhRepo.findLoaiHinhByMaCoSo(id);
        List<GiayChungNhanResponse> chungNhan = chungNhanRepo.findByCoSoKinhDoanh_MaCoSo(id)
                .stream().map(GiayChungNhanResponse::from).toList();
        List<GiayPhepResponse> giayPhep = giayPhepRepo
                .findByCoSoKinhDoanh_MaCoSoOrderByNgayNopDesc(id)
                .stream().map(GiayPhepResponse::from).toList();
        
        return new CoSoKinhDoanhDetailResponse(coSoResponse, entity.getAnhBia(), soViPham, loaiHinh, chungNhan, giayPhep);
    }

    @Transactional(readOnly = true)
    public List<GiayChungNhanResponse> getChungNhan(String id) {
        return chungNhanRepo.findByCoSoKinhDoanh_MaCoSo(id)
                .stream().map(GiayChungNhanResponse::from).toList();
    }

    @Transactional
    public CoSoKinhDoanhResponse updateDangKy(String id, CoSoKinhDoanhDangKyRequest req) {
        CoSoKinhDoanh entity = coSoRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy cơ sở kinh doanh: " + id));

        if (req.tenCoSo() != null)              entity.setTenCoSo(req.tenCoSo());
        if (req.soGiayPhep() != null)           entity.setSoGiayPhep(req.soGiayPhep());
        if (req.ngayHetHanGiayPhep() != null)   entity.setNgayHetHanGiayPhep(req.ngayHetHanGiayPhep());
        if (req.trangThai() != null)            entity.setTrangThai(req.trangThai());
        if (req.maPX() != null) {
            PhuongXa px = new PhuongXa();
            px.setMaPX(req.maPX());
            entity.setPhuongXa(px);
        }

        return CoSoKinhDoanhResponse.from(coSoRepo.save(entity));
    }

    @Transactional
    public void taoLichKiemTra(String maCoSo, KiemTraCSKDRequest req) {
        CoSoKinhDoanh coSo = coSoRepo.findById(maCoSo)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy cơ sở kinh doanh: " + maCoSo));

        NguoiDung nguoiPhuTrach = nguoiDungRepository.findById(req.maNguoiPhuTrach())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người phụ trách: " + req.maNguoiPhuTrach()));

        LichThanhTra lich = LichThanhTra.builder()
                .maThanhTra(IdGenerator.generate("LT"))
                .trangThai("Dang xu ly")
                .noiDung(req.noiDung())
                .coSoKinhDoanh(coSo)
                .nguoiPhuTrach(nguoiPhuTrach)
                .build();

        lichThanhTraRepo.save(lich);
    }
}
