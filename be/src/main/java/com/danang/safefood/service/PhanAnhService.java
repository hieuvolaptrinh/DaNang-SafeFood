package com.danang.safefood.service;

import com.danang.safefood.dto.request.PhanAnhCreateRequest;
import com.danang.safefood.dto.request.PhanAnhUpdateRequest;
import com.danang.safefood.dto.response.LoaiPhanAnhResponse;
import com.danang.safefood.dto.response.PhanAnhResponse;
import com.danang.safefood.dto.response.PhanAnhUserResponse;
import com.danang.safefood.entity.FileDinhKem;
import com.danang.safefood.entity.PhanAnh;
import com.danang.safefood.repository.CoSoKinhDoanhRepository;
import com.danang.safefood.repository.FileDinhKemRepository;
import com.danang.safefood.repository.LoaiPhanAnhRepository;
import com.danang.safefood.repository.NguoiDungRepository;
import com.danang.safefood.repository.PhanAnhRepository;
import com.danang.safefood.util.IdGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PhanAnhService {

    private final PhanAnhRepository phanAnhRepository;
    private final NguoiDungRepository nguoiDungRepository;
    private final CoSoKinhDoanhRepository coSoKinhDoanhRepository;
    private final LoaiPhanAnhRepository loaiPhanAnhRepository;
    private final FileDinhKemRepository fileDinhKemRepository;

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

        if (req.trangThaiPhanAnh() != null)
            entity.setTrangThaiPhanAnh(req.trangThaiPhanAnh());
        if (req.ghiChu() != null)
            entity.setGhiChu(req.ghiChu());

        return PhanAnhResponse.from(phanAnhRepository.save(entity));
    }

    @Transactional(readOnly = true)
    public List<LoaiPhanAnhResponse> getLoaiPhanAnh() {
        return loaiPhanAnhRepository.findAll().stream()
                .map(LoaiPhanAnhResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<PhanAnhUserResponse> getByNguoiDung(String maNguoiDung) {
        return phanAnhRepository.findByNguoiPhanAnh_MaNguoiDungOrderByNgayGuiDesc(maNguoiDung)
                .stream()
                .map(entity -> PhanAnhUserResponse.from(entity, getFileUrls(entity.getMaPhanAnh())))
                .toList();
    }

    @Transactional(readOnly = true)
    public PhanAnhUserResponse getUserDetail(String maNguoiDung, String maPhanAnh) {
        PhanAnh entity = phanAnhRepository
                .findByMaPhanAnhAndNguoiPhanAnh_MaNguoiDung(maPhanAnh, maNguoiDung)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phản ánh: " + maPhanAnh));

        return PhanAnhUserResponse.from(entity, getFileUrls(entity.getMaPhanAnh()));
    }

    @Transactional
    public PhanAnhUserResponse createForUser(Long taiKhoanId, PhanAnhCreateRequest req) {
        var nguoiDung = nguoiDungRepository.findByTaiKhoan_Id(taiKhoanId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        var loaiPhanAnh = loaiPhanAnhRepository.findById(req.maLoaiPhanAnh())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy loại phản ánh"));

        var coSo = req.maCoSo() == null || req.maCoSo().isBlank()
                ? null
                : coSoKinhDoanhRepository.findById(req.maCoSo())
                        .orElseThrow(() -> new RuntimeException("Không tìm thấy cơ sở kinh doanh"));

        PhanAnh entity = PhanAnh.builder()
                .maPhanAnh(IdGenerator.generate("PA"))
                .trangThaiPhanAnh("Chưa xử lý")
                .tieuDe(req.tieuDe())
                .lyDo(req.noiDung())
                .diaDiem(req.diaDiem())
                .ngayGui(LocalDateTime.now())
                .nguoiPhanAnh(nguoiDung)
                .coSoKinhDoanh(coSo)
                .loaiPhanAnh(loaiPhanAnh)
                .build();

        PhanAnh saved = phanAnhRepository.save(entity);
        List<String> fileUrls = saveFileDinhKem(saved, req.fileUrls());
        return PhanAnhUserResponse.from(saved, fileUrls);
    }

    @Transactional(readOnly = true)
    public String getNguoiDungId(Long taiKhoanId) {
        return nguoiDungRepository.findByTaiKhoan_Id(taiKhoanId)
                .map(nguoi -> nguoi.getMaNguoiDung())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));
    }

    private List<String> getFileUrls(String maPhanAnh) {
        return fileDinhKemRepository.findByPhanAnh_MaPhanAnh(maPhanAnh)
                .stream()
                .map(FileDinhKem::getUrlFile)
                .toList();
    }

    private List<String> saveFileDinhKem(PhanAnh phanAnh, List<String> fileUrls) {
        if (fileUrls == null || fileUrls.isEmpty()) {
            return Collections.emptyList();
        }

        List<FileDinhKem> files = fileUrls.stream()
                .map(url -> FileDinhKem.builder()
                        .maFile(IdGenerator.generate("FD"))
                        .loaiFile("image")
                        .thoiGianGui(LocalDateTime.now())
                        .urlFile(url)
                        .phanAnh(phanAnh)
                        .build())
                .toList();

        fileDinhKemRepository.saveAll(files);
        return fileUrls;
    }
}
