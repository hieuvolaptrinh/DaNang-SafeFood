package com.danang.safefood.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NhiemVuDashboardResponse {
    /** So nhiem vu co lich trong 7 ngay toi (tinh tu hien tai). */
    private long lichTuanToi;

    /** Tong so nhiem vu trong thang hien tai (dua theo thoiGianTT). */
    private long thanhTraThangNay;

    /** So nhiem vu da hoan thanh trong thang hien tai (dua theo thoiGianTT). */
    private long daHoanThanhThangNay;

    /** So nhiem vu con dang len lich (thoiGianTT >= hien tai) trong thang hien tai va chua hoan thanh. */
    private long dangLenLichThangNay;

    /** So nhiem vu qua han (thoiGianTT < hien tai) trong thang hien tai va chua hoan thanh. */
    private long quaHanThangNay;

    /** So vi pham phat hien lien quan den nhiem vu cua can bo trong thang hien tai. */
    private long viPhamPhatHienThangNay;

    /** Danh sach nhiem vu hien thi tren dashboard (gioi han). */
    private List<Item> nhiemVuGanNhat;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Item {
        private String maThanhTra;
        private String tenCoSo;
        private String loaiThanhTra; // "Dinh ky" | "Dot xuat" (UI se hien thi tieng Viet)
        private LocalDateTime thoiGianTT;
        private String trangThai;
        private String lyDoTuChoi;
    }
}

