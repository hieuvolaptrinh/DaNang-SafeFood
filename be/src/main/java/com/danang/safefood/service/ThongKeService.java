package com.danang.safefood.service;

import com.danang.safefood.dto.response.DashboardResponse;
import com.danang.safefood.dto.response.ThongKeHoKinhDoanhResponse;
import com.danang.safefood.dto.response.ThongKeViPhamResponse;
import com.danang.safefood.entity.TrangThaiQuyDinh;
import com.danang.safefood.entity.TrangThaiXuPhat;
import com.danang.safefood.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ThongKeService {

    private final CoSoKinhDoanhRepository coSoRepo;
    private final ChungNhanATVSTPRepository chungNhanRepo;
    private final LichThanhTraRepository lichThanhTraRepo;
    private final PhanAnhRepository phanAnhRepo;
    private final XuPhatRepository xuPhatRepo;
    private final QuyDinhRepository quyDinhRepo;
    private final HoSoThanhTraRepository hoSoThanhTraRepo;

    @Transactional(readOnly = true)
    public ThongKeViPhamResponse thongKeViPham(LocalDate from, LocalDate to, String khuVuc) {
        var fromDt = from != null ? from.atStartOfDay() : null;
        var toDt   = to   != null ? to.atTime(23, 59, 59) : null;

        var hoSoList = hoSoThanhTraRepo.findByThoiGianRange(fromDt, toDt);

        long tong = hoSoList.stream()
                .flatMap(h -> h.getLichThanhTra() != null
                        && (khuVuc == null
                            || (h.getLichThanhTra().getCoSoKinhDoanh() != null
                                && khuVuc.equals(h.getLichThanhTra().getCoSoKinhDoanh().getPhuongXa() != null
                                        ? h.getLichThanhTra().getCoSoKinhDoanh().getPhuongXa().getMaPX() : "")))
                        ? java.util.stream.Stream.of(h) : java.util.stream.Stream.empty())
                .count();

        // Simplified aggregation – group by tinhTrangViPham as proxy for mucDo
        Map<String, Long> theoMucDo = hoSoList.stream()
                .filter(h -> h.getTinhTrangViPham() != null)
                .collect(Collectors.groupingBy(h -> h.getTinhTrangViPham(), Collectors.counting()));

        return new ThongKeViPhamResponse(tong, theoMucDo, Map.of(), Map.of());
    }

    @Transactional(readOnly = true)
    public ThongKeHoKinhDoanhResponse thongKeHoKinhDoanh(String maPX) {
        long tong       = coSoRepo.count();
        long hoatDong   = coSoRepo.countByTrangThai("Hoat dong");
        long ngung      = tong - hoatDong;

        Map<String, Long> theoTinhTrang = Map.of(
                "Hoat dong", hoatDong,
                "Ngung hoat dong", ngung
        );

        return new ThongKeHoKinhDoanhResponse(tong, hoatDong, ngung, Map.of(), theoTinhTrang);
    }

    @Transactional(readOnly = true)
    public DashboardResponse getDashboard() {
        long tongCSKD          = coSoRepo.count();
        long hoatDong          = coSoRepo.countByTrangThai("Hoat dong");
        long cnHieuLuc         = chungNhanRepo.countByTrangThai("Cap moi");
        long sapHetHan         = chungNhanRepo
                .findByNgayHetHanBetweenAndTrangThai(LocalDate.now(), LocalDate.now().plusDays(30), "Cap moi")
                .size();
        long thanhTraDangXuLy  = lichThanhTraRepo.countByTrangThai("Dang xu ly");
        long phanAnhChuaXuLy   = phanAnhRepo.countByTrangThaiPhanAnh("Cho xu ly");
        long xuphatChoNop      = xuPhatRepo.countByTrangThai(TrangThaiXuPhat.CHO_NOP);
        long tongQuyDinh       = quyDinhRepo.countByTrangThai(TrangThaiQuyDinh.HIEU_LUC);

        return new DashboardResponse(
                tongCSKD, hoatDong, cnHieuLuc, sapHetHan,
                thanhTraDangXuLy, phanAnhChuaXuLy, xuphatChoNop, tongQuyDinh
        );
    }
}
