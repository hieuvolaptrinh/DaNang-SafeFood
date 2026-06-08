import { api } from "./client";

// ─────────────────────────────────────────────────────────────────
// Thống kê Dashboard (LD_ATVSTP)
// Base: /api/v1/thongke
// ─────────────────────────────────────────────────────────────────

/** GET /api/v1/thongke/dashboard */
export interface DashboardSummary {
  tongCoSoKinhDoanh: number;
  coSoHoatDong: number;
  chungNhanHieuLuc: number;
  chungNhanHetHan: number;
  thanhTraDangXuLy: number;
  phanAnhChuaXuLy: number;
  tongQuyDinhHieuLuc: number;
}

/** GET /api/v1/thongke/giay-phep-sap-het-han */
export interface GiayPhepSapHetHan {
  maGiayPhep: string;
  tenCoSo: string;
  soGiayPhep: string;
  tenQuanHuyen: string;
  ngayHetHan: string; // ISO date "2026-05-24"
  tinhTrang: string;
  soNgayConLai: number;
}

/** GET /api/v1/thongke/quan-huyen */
export interface ThongKeQuanHuyen {
  maQuanHuyen: string;
  tenQuanHuyen: string;
  tongCoSo: number;
  datChuan: number;
  viPham: number;
  tyLeDat: number;
  mucDo: string;
}

/** GET /api/v1/thongke/vi-pham-gan-day */
export interface ViPhamGanDay {
  maViPham: string;
  tenCoSo: string;
  loaiViPham: string;
  mucDo: string;
  trangThai: string;
  thoiGianKiemTra: string; // ISO datetime
  maHoSo: string;
}

/** GET /api/v1/thongke/vi-pham-theo-thang */
export interface ViPhamTheoThang {
  danhSach: { thangNam: string; soVu: number }[];
  tongSoVu: number;
  binhQuanMoiThang: number;
  thangCaoNhat: string;
  soVuCaoNhat: number;
}

const THONGKE_BASE = "/v1/thongke";

export const thongKeApi = {
  /** Tổng quan dashboard */
  getDashboard(): Promise<DashboardSummary> {
    return api.get(`${THONGKE_BASE}/dashboard`);
  },

  /** Giấy phép sắp hết hạn */
  getGiayPhepSapHetHan(soNgay: number = 30): Promise<GiayPhepSapHetHan[]> {
    return api.get(`${THONGKE_BASE}/giay-phep-sap-het-han?soNgay=${soNgay}`);
  },

  /** Thống kê theo Phường/Xã */
  getThongKeQuanHuyen(): Promise<ThongKeQuanHuyen[]> {
    return api.get(`${THONGKE_BASE}/quan-huyen`);
  },

  /** Vi phạm gần đây */
  getViPhamGanDay(limit: number = 10): Promise<ViPhamGanDay[]> {
    return api.get(`${THONGKE_BASE}/vi-pham-gan-day?limit=${limit}`);
  },

  /** Vi phạm theo tháng */
  getViPhamTheoThang(from?: string, to?: string): Promise<ViPhamTheoThang> {
    const params = new URLSearchParams();
    if (from) params.append("from", from);
    if (to) params.append("to", to);
    const qs = params.toString();
    return api.get(
      `${THONGKE_BASE}/vi-pham-theo-thang${qs ? "?" + qs : ""}`,
    );
  },
};
