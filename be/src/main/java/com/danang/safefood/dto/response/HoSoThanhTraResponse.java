package com.danang.safefood.dto.response;

import com.danang.safefood.entity.HoSoThanhTra;
import com.danang.safefood.service.HoSoThanhTraService;
import java.time.format.DateTimeFormatter;
import java.util.Map;

public record HoSoThanhTraResponse(
        String id,
        String facilityId,
        String business,
        String type,
        String inspector,
        String date,
        String result,
        Double score,
        String businessName,
        String address,
        String phone,
        String owner,
        String businessType,
        String inspectionTime,
        String businessLicense,
        String foodSafetyCertificate,
        String healthCertificate,
        String trainingCertificate,
        Map<String, String> checklist,
        String violationStatus,
        String violationDescription,
        String conclusion,
        String generalComment,
        String actionMeasure,
        String recommendation) {
    public static HoSoThanhTraResponse from(HoSoThanhTra hs) {
        String type = "Kiểm tra ATVSTP";
        String inspector = hs.getLichThanhTra() != null && hs.getLichThanhTra().getNguoiPhuTrach() != null
                ? hs.getLichThanhTra().getNguoiPhuTrach().getHoTen()
                : "";
        String business = hs.getLichThanhTra() != null && hs.getLichThanhTra().getCoSoKinhDoanh() != null
                ? hs.getLichThanhTra().getCoSoKinhDoanh().getTenCoSo()
                : "";
        String date = hs.getThoiGianKiemTra() != null
                ? hs.getThoiGianKiemTra().format(DateTimeFormatter.ofPattern("yyyy-MM-dd"))
                : "";
        String inspectionTime = hs.getThoiGianKiemTra() != null
                ? hs.getThoiGianKiemTra().format(DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm"))
                : "";
        String result = hs.getKetLuan() != null ? hs.getKetLuan() : "";
        
        com.danang.safefood.entity.CoSoKinhDoanh coSo = hs.getLichThanhTra() != null ? hs.getLichThanhTra().getCoSoKinhDoanh() : null;
        String address = (coSo != null && coSo.getPhuongXa() != null) ? coSo.getPhuongXa().getTenPhuongXa() : "";
        String facilityId = coSo != null ? coSo.getMaCoSo() : "";
        String owner = (coSo != null && coSo.getChuSoHuu() != null) ? coSo.getChuSoHuu().getHoTen() : "";
        String phone = (coSo != null && coSo.getChuSoHuu() != null && coSo.getChuSoHuu().getTaiKhoan() != null) ? coSo.getChuSoHuu().getTaiKhoan().getPhone() : "";
        String generalComment = HoSoThanhTraService.stripChecklistMarker(hs.getNhanXetChung());
        Map<String, String> checklist = HoSoThanhTraService.extractChecklist(hs.getNhanXetChung());

        return new HoSoThanhTraResponse(
                hs.getMaHoSo(),
                facilityId,
                business,
                type,
                inspector,
                date,
                result,
                hs.getDiem(),
                business,
                address, phone, owner, "",
                inspectionTime,
                "Hợp lệ", "Hợp lệ", "Hợp lệ", "Hợp lệ",
                                checklist,
                (hs.getTinhTrangViPham() != null && !hs.getTinhTrangViPham().isEmpty()) ? "has" : "none",
                hs.getTinhTrangViPham(),
                result,
                                generalComment,
                hs.getBienPhapXuLy(),
                hs.getKienNghi());
    }
}
