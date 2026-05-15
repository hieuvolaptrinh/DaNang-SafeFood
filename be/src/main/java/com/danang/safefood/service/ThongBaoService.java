package com.danang.safefood.service;

import com.danang.safefood.dto.request.ThongBaoRequest;
import com.danang.safefood.dto.response.ThongBaoResponse;
import com.danang.safefood.entity.ThongBao;
import com.danang.safefood.entity.ThongBaoNguoiDung;
import com.danang.safefood.repository.ThongBaoNguoiDungRepository;
import com.danang.safefood.repository.ThongBaoRepository;
import com.danang.safefood.util.IdGenerator;
import com.danang.safefood.util.LoaiThongBaoEnum;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ThongBaoService {

    private final ThongBaoRepository thongBaoRepository;
    private final ThongBaoNguoiDungRepository thongBaoNguoiDungRepository;

    /**
     * Lấy tất cả thông báo cộng đồng (isCongDong = true).
     * Ai đăng nhập đều xem được.
     */
    public List<ThongBaoResponse> getCommunityNotifications() {
        return thongBaoRepository.findByIsCongDongTrueOrderByNgayGuiDesc()
                .stream()
                .map(ThongBaoResponse::from)
                .collect(Collectors.toList());
    }

    /**
     * Lấy thông báo cá nhân của một người dùng
     * (qua bảng thong_bao_nguoi_dung, chỉ lấy thông báo KHÔNG phải cộng đồng).
     */
    public List<ThongBaoResponse> getPersonalNotifications(String maNguoiDung) {
        return thongBaoNguoiDungRepository.findByMaNguoiDungWithThongBao(maNguoiDung)
                .stream()
                .map(ThongBaoNguoiDung::getThongBao)
                .filter(Objects::nonNull)
                .map(ThongBaoResponse::from)
                .collect(Collectors.toList());
    }

    @Transactional
    public ThongBaoResponse create(ThongBaoRequest req) {
        LoaiThongBaoEnum loai = req.loaiThongBao() != null
                ? LoaiThongBaoEnum.fromLabel(req.loaiThongBao())
                : null;

        ThongBao entity = ThongBao.builder()
                .maThongBao(IdGenerator.generate("TB"))
                .tieuDe(req.tieuDe())
                .noiDung(req.noiDung())
                .ngayGui(LocalDateTime.now())
                .loaiThongBao(loai)
                .isCongDong(Boolean.TRUE.equals(req.isCongDong()))
                .build();
        return ThongBaoResponse.from(thongBaoRepository.save(entity));
    }

    @Transactional(readOnly = true)
    public Page<ThongBaoResponse> getAll(String loai, Boolean isCongDong, Pageable pageable) {
        if (loai != null) {
            LoaiThongBaoEnum loaiEnum = LoaiThongBaoEnum.fromLabel(loai);
            return thongBaoRepository.findByLoaiThongBaoOrderByNgayGuiDesc(loaiEnum, pageable).map(ThongBaoResponse::from);
        }
        if (isCongDong != null) {
            return thongBaoRepository.findByIsCongDongOrderByNgayGuiDesc(isCongDong, pageable).map(ThongBaoResponse::from);
        }
        return thongBaoRepository.findAllByOrderByNgayGuiDesc(pageable).map(ThongBaoResponse::from);
    }
}

