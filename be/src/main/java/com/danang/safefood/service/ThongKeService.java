package com.danang.safefood.service;

import com.danang.safefood.dto.response.*;
import com.danang.safefood.entity.CoSoKinhDoanh;
import com.danang.safefood.entity.HoSoDangKiKinhDoanh;
import com.danang.safefood.entity.PhuongXa;
import com.danang.safefood.entity.ViPham;
import com.danang.safefood.util.TrangThaiQuyDinh;
import com.danang.safefood.util.TrangThaiXuPhat;
import com.danang.safefood.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ThongKeService {

    private final CoSoKinhDoanhRepository coSoRepo;
    private final ChungNhanATVSTPRepository chungNhanRepo;
    private final LichThanhTraRepository lichThanhTraRepo;
    private final PhanAnhRepository phanAnhRepo;
    private final ViPhamRepository viPhamRepo;
    private final QuyDinhRepository quyDinhRepo;
    private final HoSoThanhTraRepository hoSoThanhTraRepo;
    private final GiayPhepRepository giayPhepRepo;

    public List<ViPhamGanDayResponse> getViPhamGanDay(int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        return viPhamRepo.findRecentViPham(pageable)
                .stream()
                .map(ViPhamGanDayResponse::of)
                .toList();
    }

//    @Transactional(readOnly = true)
//    public ThongKeHoKinhDoanhResponse thongKeHoKinhDoanh(String maPX) {
//        long tong       = coSoRepo.count();
//        long hoatDong   = coSoRepo.countByTrangThai("Hoat dong");
//        long ngung      = tong - hoatDong;
//
//        Map<String, Long> theoTinhTrang = Map.of(
//                "Hoat dong", hoatDong,
//                "Ngung hoat dong", ngung
//        );
//
//        return new ThongKeHoKinhDoanhResponse(tong, hoatDong, ngung, Map.of(), theoTinhTrang);
//    }

    @Transactional(readOnly = true)
    public DashboardResponse getDashboard() {
        long tongCSKD          = coSoRepo.count();
        long hoatDong          = coSoRepo.countByTrangThai("Hoat dong");
        long cnHieuLuc         = chungNhanRepo.countByTrangThai("Còn hiệu lực");
        long sapHetHan         = chungNhanRepo.countByTrangThai("Hết hạn");
        long thanhTraDangXuLy  = lichThanhTraRepo.countByTrangThai("Chưa nhận");
        long phanAnhChuaXuLy   = phanAnhRepo.countByTrangThaiPhanAnh("Chưa xử lý");
        long tongQuyDinh       = quyDinhRepo.countByTrangThai(TrangThaiQuyDinh.HIEU_LUC);

        return new DashboardResponse(
                tongCSKD, hoatDong, cnHieuLuc, sapHetHan,
                thanhTraDangXuLy, phanAnhChuaXuLy, tongQuyDinh
        );
    }


    @Transactional(readOnly = true)
    public List<ThongKeTheoQuanHuyenResponse> thongKeTheoQuanHuyen() {

        List<CoSoKinhDoanh> all = coSoRepo.findAllWithPhuongXa();

        Map<String, List<CoSoKinhDoanh>> groupByQuan = all.stream()
                .filter(cs -> cs.getPhuongXa() != null)
                .collect(Collectors.groupingBy(cs ->
                        getMaQuanFromPhuongXa(cs.getPhuongXa())
                ));

        return groupByQuan.entrySet().stream()
                .map(entry -> {
                    String maQuan = entry.getKey();
                    List<CoSoKinhDoanh> ds = entry.getValue();

                    long tong = ds.size();
                    long datChuan = ds.stream().filter(this::datChuan).count();
                    long viPham = ds.stream().filter(cs -> !cs.getViPhamList().isEmpty()).count();

                    return new ThongKeTheoQuanHuyenResponse(
                            maQuan,
                            getTenQuanHuyen(maQuan),
                            tong,
                            datChuan,
                            viPham
                    );
                })
                .sorted((a, b) -> Long.compare(b.tongCoSo(), a.tongCoSo()))
                .toList();
    }

    private boolean datChuan(CoSoKinhDoanh cs) {
        // Logic đạt chuẩn theo yêu cầu kinh doanh của bạn
        return "Hoat dong".equals(cs.getTrangThai())
                && cs.getNgayHetHanGiayPhep() != null
                && cs.getNgayHetHanGiayPhep().isAfter(LocalDate.now());
    }

    // Helper 1: Xác định Quận từ Phường
    private String getMaQuanFromPhuongXa(PhuongXa px) {
        if (px == null || px.getTenPhuongXa() == null) return "KHAC";

        String ten = px.getTenPhuongXa().toLowerCase().trim();

        if (ten.contains("hải châu")) return "HAI_CHAU";
        if (ten.contains("thanh khê")) return "THANH_KHE";
        if (ten.contains("sơn trà")) return "SON_TRA";
        if (ten.contains("ngũ hành")) return "NGU_HANH_SON";
        if (ten.contains("liên chiểu")) return "LIEN_CHIEU";
        if (ten.contains("cẩm lệ")) return "CAM_LE";
        if (ten.contains("hòa vang")) return "HOA_VANG";

        return "KHAC";
    }

    // Helper 2: Lấy tên Quận để hiển thị
    private String getTenQuanHuyen(String maQuan) {
        return switch (maQuan) {
            case "HAI_CHAU" -> "Hải Châu";
            case "THANH_KHE" -> "Thanh Khê";
            case "SON_TRA" -> "Sơn Trà";
            case "NGU_HANH_SON" -> "Ngũ Hành Sơn";
            case "LIEN_CHIEU" -> "Liên Chiểu";
            case "CAM_LE" -> "Cẩm Lệ";
            case "HOA_VANG" -> "Hòa Vang";
            default -> "Khác";
        };
    }

    @Transactional(readOnly = true)
    public ThongKeViPhamTheoThangResponse thongKeViPhamTheoThang(LocalDate from, LocalDate to) {

        List<ViPham> list;

        if (from != null && to != null) {
            LocalDateTime fromStart = from.atStartOfDay();
            LocalDateTime toEnd = to.plusDays(1).atStartOfDay();
            list = viPhamRepo.findViPhamByThoiGianKiemTraBetween(fromStart, toEnd);
        } else {
            list = viPhamRepo.findAllViPham();   // hoặc findAll()
        }

        Map<YearMonth, Long> groupByMonth = list.stream()
                .filter(vp -> vp.getHoSoThanhTra() != null
                        && vp.getHoSoThanhTra().getThoiGianKiemTra() != null)
                .collect(Collectors.groupingBy(vp ->
                                YearMonth.from(vp.getHoSoThanhTra().getThoiGianKiemTra()),
                        Collectors.counting()
                ));

        List<ThongKeViPhamTheoThangResponse.ThangViPham> danhSach = groupByMonth.entrySet().stream()
                .sorted(Map.Entry.comparingByKey())
                .map(entry -> new ThongKeViPhamTheoThangResponse.ThangViPham(
                        "T" + entry.getKey().getMonthValue() + "/" + entry.getKey().getYear(),
                        entry.getValue()
                ))
                .toList();

        long tongSoVu = danhSach.stream().mapToLong(ThongKeViPhamTheoThangResponse.ThangViPham::soVu).sum();

        double binhQuan = danhSach.isEmpty() ? 0.0
                : Math.round((tongSoVu * 10.0) / danhSach.size()) / 10.0;

        // Tìm tháng có số vụ cao nhất
        var maxEntry = danhSach.stream()
                .max(Comparator.comparingLong(ThongKeViPhamTheoThangResponse.ThangViPham::soVu))
                .orElse(null);

        String thangCaoNhat = maxEntry != null ? maxEntry.thangNam() : "";
        long soVuCaoNhat = maxEntry != null ? maxEntry.soVu() : 0;

        return new ThongKeViPhamTheoThangResponse(
                danhSach, tongSoVu, binhQuan, thangCaoNhat, soVuCaoNhat
        );
    }

    @Transactional(readOnly = true)
    public List<GiayPhepSapHetHanResponse> getGiayPhepSapHetHan(int soNgay) {

        LocalDate ngayCanhBao = LocalDate.now().plusDays(soNgay);
        LocalDate ngayBatDau  = LocalDate.now().minusDays(180); // quá hạn tối đa 180 ngày

        List<HoSoDangKiKinhDoanh> list = giayPhepRepo.findGiayPhepSapHetHan(ngayCanhBao, ngayBatDau);

        return list.stream()
                .map(GiayPhepSapHetHanResponse::of)
                .sorted((a, b) -> Integer.compare(a.soNgayConLai(), b.soNgayConLai())) // sắp xếp theo ngày hết hạn gần nhất
                .toList();
    }
}
