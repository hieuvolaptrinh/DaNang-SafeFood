const apiURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

import { getAccessToken } from "@/utils/storage";

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface FetchOptions extends RequestInit {
  requireAuth?: boolean;
}

async function fetchApi<T>(
  endpoint: string,
  options: FetchOptions = {},
): Promise<T> {
  const { requireAuth = true, ...fetchOptions } = options;

  const url = `${apiURL}${endpoint}`;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(fetchOptions.headers || {}),
  };

  if (requireAuth) {
    const token = getAccessToken();
    if (token) {
      (headers as Record<string, string>).Authorization = `Bearer ${token}`;
    }
  }

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers,
      credentials: "include", // Include cookies for refresh token
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data.error || "Request failed");
    }

    // Return data directly from response.data if exists, otherwise return data
    return data.data !== undefined ? data.data : data;
  } catch (error: any) {
    if (error.name === "TypeError" && error.message === "Failed to fetch") {
      throw new Error(
        "Không thể kết nối đến server. Vui lòng kiểm tra kết nối.",
      );
    }
    throw error;
  }
}

/**
 * API client with common methods
 */
export const api = {
  get<T>(endpoint: string, options?: FetchOptions): Promise<T> {
    return fetchApi<T>(endpoint, { ...options, method: "GET" });
  },

  post<T>(endpoint: string, body?: any, options?: FetchOptions): Promise<T> {
    return fetchApi<T>(endpoint, {
      ...options,
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  put<T>(endpoint: string, body?: any, options?: FetchOptions): Promise<T> {
    return fetchApi<T>(endpoint, {
      ...options,
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  patch<T>(endpoint: string, body?: any, options?: FetchOptions): Promise<T> {
    return fetchApi<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  delete<T>(endpoint: string, options?: FetchOptions): Promise<T> {
    return fetchApi<T>(endpoint, { ...options, method: "DELETE" });
  },
};

/**
 * YeuCauKiemNghiem API endpoints
 */
export interface YeuCauKiemNghiemResponse {
  maYeuCau: string;
  tenCoSo: string;
  loaiMau: string;
  ngayYeuCau: string;
  hanHoanThanh: string;
  trangThai: "pending" | "processing" | "completed";
  phongLab: string;
  ketQuaKiemNghiem?: string;
  lyDoKhongDat?: string;
  noidungYeuCau: string;
  chiTieuKiemDinh: string;
  maMauLienQuan?: string;
  ngayTao: string;
  maNguoiTao: string;
}

export interface CreateYeuCauKiemNghiemRequest {
  maCoSo: string;
  loaiMau: string;
  ngayYeuCau: string;
  hanHoanThanh: string;
  phongLab: string;
  noidungYeuCau: string;
  chiTieuKiemDinh: string;
  maMauLienQuan?: string;
}

export interface UpdateKetQuaKiemNghiemRequest {
  ketQuaKiemNghiem: string;
  trangThai: "pending" | "processing" | "completed";
  lyDoKhongDat?: string;
  fileCoDauMoc?: string;
}

export interface YeuCauKiemNghiemStatsResponse {
  tongYeuCau: number;
  choDuyet: number;
  dangXuLy: number;
  hoanThanh: number;
}

export const yeuCauKiemNghiemApi = {
  getStats(): Promise<YeuCauKiemNghiemStatsResponse> {
    return api.get("/yeu-cau-kiem-nghiem/stats");
  },

  searchYeuCau(
    keyword?: string,
    status?: string,
    page: number = 0,
    size: number = 10
  ): Promise<{ content: YeuCauKiemNghiemResponse[]; totalElements: number; totalPages: number; currentPage: number }> {
    const params = new URLSearchParams();
    if (keyword) params.append("keyword", keyword);
    if (status) params.append("status", status);
    params.append("page", page.toString());
    params.append("size", size.toString());
    return api.get(`/yeu-cau-kiem-nghiem?${params.toString()}`);
  },

  getById(maYeuCau: string): Promise<YeuCauKiemNghiemResponse> {
    return api.get(`/yeu-cau-kiem-nghiem/${maYeuCau}`);
  },

  create(req: CreateYeuCauKiemNghiemRequest): Promise<YeuCauKiemNghiemResponse> {
    return api.post("/yeu-cau-kiem-nghiem", req);
  },

  updateKetQua(
    maYeuCau: string,
    req: UpdateKetQuaKiemNghiemRequest
  ): Promise<YeuCauKiemNghiemResponse> {
    return api.put(`/yeu-cau-kiem-nghiem/${maYeuCau}/ket-qua`, req);
  },
};

/**
 * KetQuaKiemNghiem API endpoints
 */
export interface KetQuaKiemNghiemStatsResponse {
  tongMau: number;
  datChuan: number;
  khongDat: number;
  choKetQua: number;
}

export interface KetQuaKiemNghiemChiTieuResponse {
  maChiTieu: string;
  tenChiTieu: string;
  giaTriDo?: string | null;
  gioiHanChoPhep?: string | null;
  ketLuan: "pass" | "fail" | "pending";
}

export interface KetQuaKiemNghiemItemResponse {
  maKetQua: string;
  maMau: string;
  tenCoSo: string;
  tenMau: string;
  loaiMau: string;
  ngayKiemNghiem?: string | null;
  phongLab?: string | null;
  ketQua: "pass" | "fail" | "pending";
  chiTieu?: string | null;
  diem?: number | null;
  fileKetQua?: string | null;
}

export interface KetQuaKiemNghiemDetailResponse extends KetQuaKiemNghiemItemResponse {
  ketQuaKiemNghiem?: string | null;
  lyDoKhongDat?: string | null;
  chiTietChiTieu: KetQuaKiemNghiemChiTieuResponse[];
}

export const ketQuaKiemNghiemApi = {
  getStats(): Promise<KetQuaKiemNghiemStatsResponse> {
    return api.get("/ket-qua-kiem-nghiem/stats");
  },

  search(
    keyword?: string,
    result?: "pass" | "fail" | "pending" | "",
    page: number = 0,
    size: number = 10
  ): Promise<{ content: KetQuaKiemNghiemItemResponse[]; totalElements: number; totalPages: number; number: number }> {
    const params = new URLSearchParams();
    if (keyword) params.append("keyword", keyword);
    if (result) params.append("result", result);
    params.append("page", page.toString());
    params.append("size", size.toString());
    return api.get(`/ket-qua-kiem-nghiem?${params.toString()}`);
  },

  getById(maKetQua: string): Promise<KetQuaKiemNghiemDetailResponse> {
    return api.get(`/ket-qua-kiem-nghiem/${maKetQua}`);
  },
};

export default api;

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

const THONGKE_BASE = '/v1/thongke';

export const thongKeApi = {
  /** Tổng quan dashboard */
  getDashboard(): Promise<DashboardSummary> {
    return api.get(`${THONGKE_BASE}/dashboard`);
  },

  /** Giấy phép sắp hết hạn */
  getGiayPhepSapHetHan(soNgay: number = 30): Promise<GiayPhepSapHetHan[]> {
    return api.get(`${THONGKE_BASE}/giay-phep-sap-het-han?soNgay=${soNgay}`);
  },

  /** Thống kê theo quận/huyện */
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
    if (from) params.append('from', from);
    if (to)   params.append('to', to);
    const qs = params.toString();
    return api.get(`${THONGKE_BASE}/vi-pham-theo-thang${qs ? '?' + qs : ''}`);
  },
};
