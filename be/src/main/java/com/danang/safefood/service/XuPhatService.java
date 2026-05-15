package com.danang.safefood.service;

import com.danang.safefood.dto.request.XuPhatRequest;
import com.danang.safefood.dto.response.XuPhatResponse;
import com.danang.safefood.entity.CoSoKinhDoanh;
import com.danang.safefood.entity.TaiKhoan;
import com.danang.safefood.util.TrangThaiXuPhat;
import com.danang.safefood.entity.XuPhat;
import com.danang.safefood.repository.CoSoKinhDoanhRepository;
import com.danang.safefood.repository.TaiKhoanRepository;
import com.danang.safefood.repository.XuPhatRepository;
import com.danang.safefood.util.IdGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class XuPhatService {

    private final XuPhatRepository xuPhatRepo;
    private final CoSoKinhDoanhRepository coSoRepo;
    private final TaiKhoanRepository taiKhoanRepo;

    @Transactional
    public XuPhatResponse banHanh(XuPhatRequest req, String username) {
        CoSoKinhDoanh coSo = coSoRepo.findById(req.maCoSo())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy cơ sở kinh doanh: " + req.maCoSo()));

        TaiKhoan nguoiKy = taiKhoanRepo.findByUsername(username).orElse(null);

        XuPhat entity = XuPhat.builder()
                .maXuPhat(IdGenerator.generate("XP"))
                .soQuyetDinh(req.soQuyetDinh())
                .mucPhat(req.mucPhat())
                .lyDoXuPhat(req.lyDoXuPhat())
                .ngayXuPhat(req.ngayXuPhat())
                .coSoKinhDoanh(coSo)
                .nguoiRaQuyetDinh(nguoiKy)
                .createdBy(username)
                .build();

        return XuPhatResponse.from(xuPhatRepo.save(entity));
    }

    @Transactional(readOnly = true)
    public Page<XuPhatResponse> getAll(TrangThaiXuPhat trangThai, Pageable pageable) {
        Page<XuPhat> page = (trangThai != null)
                ? xuPhatRepo.findByTrangThaiOrderByCreatedAtDesc(trangThai, pageable)
                : xuPhatRepo.findAllByOrderByCreatedAtDesc(pageable);
        return page.map(XuPhatResponse::from);
    }
}
