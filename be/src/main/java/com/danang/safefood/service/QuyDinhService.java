package com.danang.safefood.service;

import com.danang.safefood.dto.request.QuyDinhRequest;
import com.danang.safefood.dto.response.QuyDinhResponse;
import com.danang.safefood.entity.QuyDinh;
import com.danang.safefood.entity.TrangThaiQuyDinh;
import com.danang.safefood.repository.QuyDinhRepository;
import com.danang.safefood.repository.TaiKhoanRepository;
import com.danang.safefood.util.IdGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class QuyDinhService {

    private final QuyDinhRepository quyDinhRepository;
    private final TaiKhoanRepository taiKhoanRepository;

    @Transactional
    public QuyDinhResponse create(QuyDinhRequest req, String username) {
        var nguoiBanHanh = taiKhoanRepository.findByUsername(username).orElse(null);

        QuyDinh entity = QuyDinh.builder()
                .maQuyDinh(IdGenerator.generate("QD"))
                .tieuDe(req.tieuDe())
                .noiDung(req.noiDung())
                .loai(req.loai())
                .trangThai(req.trangThai() != null ? req.trangThai() : TrangThaiQuyDinh.NHAP)
                .ngayBanHanh(req.ngayBanHanh())
                .nguoiBanHanh(nguoiBanHanh)
                .createdBy(username)
                .build();

        return QuyDinhResponse.from(quyDinhRepository.save(entity));
    }

    @Transactional
    public QuyDinhResponse update(String id, QuyDinhRequest req) {
        QuyDinh entity = quyDinhRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy quy định: " + id));

        if (req.tieuDe() != null)       entity.setTieuDe(req.tieuDe());
        if (req.noiDung() != null)      entity.setNoiDung(req.noiDung());
        if (req.loai() != null)         entity.setLoai(req.loai());
        if (req.trangThai() != null)    entity.setTrangThai(req.trangThai());
        if (req.ngayBanHanh() != null)  entity.setNgayBanHanh(req.ngayBanHanh());

        return QuyDinhResponse.from(quyDinhRepository.save(entity));
    }

    @Transactional(readOnly = true)
    public Page<QuyDinhResponse> getAll(TrangThaiQuyDinh trangThai, Pageable pageable) {
        Page<QuyDinh> page = (trangThai != null)
                ? quyDinhRepository.findByTrangThaiOrderByCreatedAtDesc(trangThai, pageable)
                : quyDinhRepository.findAllByOrderByCreatedAtDesc(pageable);
        return page.map(QuyDinhResponse::from);
    }
}
