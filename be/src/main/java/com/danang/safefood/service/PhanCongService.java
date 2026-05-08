package com.danang.safefood.service;

import com.danang.safefood.dto.request.PhanCongKiemTraRequest;
import com.danang.safefood.entity.LichThanhTraNguoiDung;
import com.danang.safefood.repository.LichThanhTraNguoiDungRepository;
import com.danang.safefood.repository.LichThanhTraRepository;
import com.danang.safefood.repository.NguoiDungRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PhanCongService {

    private final LichThanhTraNguoiDungRepository assignmentRepo;
    private final LichThanhTraRepository lichThanhTraRepo;
    private final NguoiDungRepository nguoiDungRepo;

    @Transactional
    public void phanCong(PhanCongKiemTraRequest req) {
        if (!lichThanhTraRepo.existsById(req.maThanhTra())) {
            throw new RuntimeException("Không tìm thấy lịch thanh tra: " + req.maThanhTra());
        }
        if (!nguoiDungRepo.existsById(req.maNguoiThanhTra())) {
            throw new RuntimeException("Không tìm thấy người dùng: " + req.maNguoiThanhTra());
        }
        if (assignmentRepo.existsByMaThanhTraAndMaNguoiThanhTra(req.maThanhTra(), req.maNguoiThanhTra())) {
            throw new RuntimeException("Người dùng đã được phân công cho lịch thanh tra này");
        }

        LichThanhTraNguoiDung assignment = LichThanhTraNguoiDung.builder()
                .maThanhTra(req.maThanhTra())
                .maNguoiThanhTra(req.maNguoiThanhTra())
                .thoiGianTT(req.thoiGianTT())
                .build();

        assignmentRepo.save(assignment);
    }
}
