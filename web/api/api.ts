const apiURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

import { getAccessToken } from "@/utils/storage";

export interface ApiResponse<T = unknown> {
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
  } catch (error: unknown) {
    if (error instanceof Error && error.name === "TypeError" && error.message === "Failed to fetch") {
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

  post<T>(endpoint: string, body?: unknown, options?: FetchOptions): Promise<T> {
    return fetchApi<T>(endpoint, {
      ...options,
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  put<T>(endpoint: string, body?: unknown, options?: FetchOptions): Promise<T> {
    return fetchApi<T>(endpoint, {
      ...options,
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  patch<T>(endpoint: string, body?: unknown, options?: FetchOptions): Promise<T> {
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
  maNguoiKiemNghiem?: string;
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

export interface YeuCauKiemNghiemMauOptionResponse {
  maMau: string;
  maCoSo: string;
  tenMau: string;
  loaiMau: string;
  tenCoSo: string;
  ngayThu: string;
}

export interface NguoiDungOptionResponse {
  maNguoiDung: string;
  hoTen: string;
  gioiTinh?: string;
  cccd?: string;
}

export const yeuCauKiemNghiemApi = {
  getStats(): Promise<YeuCauKiemNghiemStatsResponse> {
    return api.get("/v1/yeu-cau-kiem-nghiem/stats");
  },

  getMauOptions(): Promise<YeuCauKiemNghiemMauOptionResponse[]> {
    return api.get("/v1/yeu-cau-kiem-nghiem/mau-options");
  },

  getKiemNghiemVienOptions(): Promise<NguoiDungOptionResponse[]> {
    return api.get("/v1/yeu-cau-kiem-nghiem/kiem-nghiem-vien-options");
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
    return api.get(`/v1/yeu-cau-kiem-nghiem?${params.toString()}`);
  },

  getById(maYeuCau: string): Promise<YeuCauKiemNghiemResponse> {
    return api.get(`/v1/yeu-cau-kiem-nghiem/${maYeuCau}`);
  },

  create(req: CreateYeuCauKiemNghiemRequest): Promise<YeuCauKiemNghiemResponse> {
    return api.post("/v1/yeu-cau-kiem-nghiem", req);
  },

  updateKetQua(
    maYeuCau: string,
    req: UpdateKetQuaKiemNghiemRequest
  ): Promise<YeuCauKiemNghiemResponse> {
    return api.put(`/v1/yeu-cau-kiem-nghiem/${maYeuCau}/ket-qua`, req);
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
  ketLuan: string;
}

export interface KetQuaKiemNghiemItemResponse {
  maKetQua: string;
  maMau: string;
  tenCoSo: string;
  tenMau: string;
  loaiMau: string;
  ngayKiemNghiem?: string | null;
  phongLab?: string | null;
  ketQua: string;
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
    return api.get("/v1/ket-qua-kiem-nghiem/stats");
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
    return api.get(`/v1/ket-qua-kiem-nghiem?${params.toString()}`);
  },

  getById(maKetQua: string): Promise<KetQuaKiemNghiemDetailResponse> {
    return api.get(`/v1/ket-qua-kiem-nghiem/${maKetQua}`);
  },
};

/**
 * NhiemVu API endpoints
 */
export interface NhiemVuStatsResponse {
  tongSo: number;
  chuaNhan: number;
  daNhan: number;
}

export interface NhiemVuListItemResponse {
  maThanhTra: string;
  tenCoSo: string;
  trangThai: string;
  ghiChu: string;
  thoiGianTT: string;
  nguoiPhuTrach: string;
}

export interface NhiemVuDetailResponse {
  maThanhTra: string;
  trangThai: string;
  ghiChu: string;
  noiDung: string;
  thoiGianTT: string;
  maCoSo: string;
  tenCoSo: string;
  diaChiCoSo: string;
  maNguoiPhuTrach: string;
  tenNguoiPhuTrach: string;
}

export interface CapNhatTienDoRequest {
  trangThai: string;
  ghiChu: string;
}

export interface TuChoiNhiemVuRequest {
  lyDoTuChoi: string;
}

export const nhiemVuApi = {
  getStats(): Promise<NhiemVuStatsResponse> {
    return api.get("/v1/nhiem-vu/thong-ke");
  },

  search(
    keyword?: string,
    trangThai?: string,
    page: number = 0,
    size: number = 10
  ): Promise<{ content: NhiemVuListItemResponse[]; totalElements: number; totalPages: number; number: number }> {
    const params = new URLSearchParams();
    if (keyword) params.append("keyword", keyword);
    if (trangThai) params.append("trangThai", trangThai);
    params.append("page", page.toString());
    params.append("size", size.toString());
    return api.get(`/v1/nhiem-vu?${params.toString()}`);
  },

  getById(maThanhTra: string): Promise<NhiemVuDetailResponse> {
    return api.get(`/v1/nhiem-vu/${maThanhTra}`);
  },

  accept(maThanhTra: string): Promise<void> {
    return api.put(`/v1/nhiem-vu/${maThanhTra}/nhan`);
  },

  updateProgress(maThanhTra: string, req: CapNhatTienDoRequest): Promise<void> {
    return api.put(`/v1/nhiem-vu/${maThanhTra}/trang-thai`, req);
  },

  reject(maThanhTra: string, req: TuChoiNhiemVuRequest): Promise<void> {
    return api.put(`/v1/nhiem-vu/${maThanhTra}/tu-choi`, req);
  },
};

/**
 * KhieuNai API endpoints
 */
export interface KhieuNaiSubmitterResponse {
  fullName: string;
  phone: string;
  email: string;
  address: string;
}

export interface KhieuNaiEvidenceResponse {
  id: string;
  label: string;
  kind: "image" | "file";
  note: string;
  url: string;
}

export interface KhieuNaiSummaryResponse {
  id: string;
  title: string;
  submitter: string;
  submitterPhone: string;
  submittedAt: string;
  status: "pending" | "processing" | "resolved";
  statusLabel: string;
  facilityId: string;
  facilityName: string;
}

export interface KhieuNaiDetailResponse {
  id: string;
  title: string;
  content: string;
  status: "pending" | "processing" | "resolved";
  statusLabel: string;
  submittedAt: string;
  facilityId: string;
  facilityName: string;
  submitterInfo: KhieuNaiSubmitterResponse;
  evidence: KhieuNaiEvidenceResponse[];
  inspectionSummary: string;
  inspectionCompleted: boolean;
  handlingResult: string;
}

export interface KhieuNaiKiemTraRequest {
  tomTatKiemTra: string;
}

export interface KhieuNaiXuLyRequest {
  ketQuaXuLy: string;
  trangThai: "pending" | "processing" | "resolved";
}

export const khieuNaiApi = {
  search(
    keyword?: string,
    status?: string,
    page: number = 0,
    size: number = 20
  ): Promise<{ content: KhieuNaiSummaryResponse[]; totalElements: number; totalPages: number; number: number }> {
    const params = new URLSearchParams();
    if (keyword) params.append("keyword", keyword);
    if (status) params.append("status", status);
    params.append("page", page.toString());
    params.append("size", size.toString());
    return api.get(`/v1/khieu-nai?${params.toString()}`);
  },

  getById(id: string): Promise<KhieuNaiDetailResponse> {
    return api.get(`/v1/khieu-nai/${id}`);
  },

  updateInspection(id: string, req: KhieuNaiKiemTraRequest): Promise<KhieuNaiDetailResponse> {
    return api.put(`/v1/khieu-nai/${id}/kiem-tra-thuc-dia`, req);
  },

  updateHandling(id: string, req: KhieuNaiXuLyRequest): Promise<KhieuNaiDetailResponse> {
    return api.put(`/v1/khieu-nai/${id}/xu-ly`, req);
  },
};

/**
 * HoSoThanhTra API endpoints
 */
export interface HoSoThanhTraResponse {
  id: string;
  facilityId: string;
  business: string;
  type: string;
  inspector: string;
  date: string;
  result: string;
  score: number;
  businessName: string;
  address: string;
  phone: string;
  owner: string;
  businessType: string;
  inspectionTime: string;
  businessLicense: string;
  foodSafetyCertificate: string;
  healthCertificate: string;
  trainingCertificate: string;
  checklist: Record<string, string>;
  violationStatus: string;
  violationDescription: string;
  conclusion: string;
  generalComment: string;
  actionMeasure: string;
  recommendation: string;
}

export interface HoSoThanhTraStatsResponse {
  total: number;
  completed: number;
  scheduled: number;
  failed: number;
}

export interface HoSoThanhTraRequest {
  facilityId: string;
  inspectionTime: string;
  businessLicense: string;
  foodSafetyCertificate: string;
  healthCertificate: string;
  trainingCertificate: string;
  checklist: Record<string, string>;
  violationStatus: string;
  violationDescription: string;
  conclusion: string;
  generalComment: string;
  actionMeasure: string;
  recommendation: string;
}

export const hoSoThanhTraApi = {
  getStats(): Promise<HoSoThanhTraStatsResponse> {
    return api.get("/v1/ho-so-thanh-tra/thong-ke");
  },

  search(
    keyword?: string,
    resultFilter?: string,
    inspectorFilter?: string,
    page: number = 0,
    size: number = 20
  ): Promise<{ content: HoSoThanhTraResponse[]; totalElements: number; totalPages: number; number: number }> {
    const params = new URLSearchParams();
    if (keyword) params.append("keyword", keyword);
    if (resultFilter) params.append("resultFilter", resultFilter);
    if (inspectorFilter) params.append("inspectorFilter", inspectorFilter);
    params.append("page", page.toString());
    params.append("size", size.toString());
    return api.get(`/v1/ho-so-thanh-tra?${params.toString()}`);
  },

  getById(id: string): Promise<HoSoThanhTraResponse> {
    return api.get(`/v1/ho-so-thanh-tra/${id}`);
  },

  create(req: HoSoThanhTraRequest): Promise<HoSoThanhTraResponse> {
    return api.post("/v1/ho-so-thanh-tra", req);
  },

  update(id: string, req: HoSoThanhTraRequest): Promise<HoSoThanhTraResponse> {
    return api.put(`/v1/ho-so-thanh-tra/${id}`, req);
  },
};

/**
 * BaoCao API endpoints
 */
export interface BaoCaoResponse {
  id: string;
  facilityId?: string;
  tenCoSo: string;
  loaiThanhTra: string;
  thanhTraVien: string;
  ngay: string;
  ketQua: "pass" | "fail" | "scheduled" | string;
  diem: number;
  quanHuyen: string;
  noiDung: string;
  nhanXet: string;
  tepDinhKem: string;
}

export interface BaoCaoStatsResponse {
  total: number;
  completed: number;
  processing: number;
  failed: number;
}

export interface BaoCaoRequest {
  facilityId: string;
  inspectionDate: string;
  inspectionType: string;
  content: string;
  comment: string;
  result: string;
  score: number;
  fileName?: string;
  hasInspectionRecord?: boolean;
}

export const baoCaoApi = {
  getStats(): Promise<BaoCaoStatsResponse> {
    return api.get("/v1/bao-cao/thong-ke");
  },

  search(
    keyword?: string,
    resultFilter?: string,
    page: number = 0,
    size: number = 20
  ): Promise<{ content: BaoCaoResponse[]; totalElements: number; totalPages: number; number: number }> {
    const params = new URLSearchParams();
    if (keyword) params.append("keyword", keyword);
    if (resultFilter) params.append("resultFilter", resultFilter);
    params.append("page", page.toString());
    params.append("size", size.toString());
    return api.get(`/v1/bao-cao?${params.toString()}`);
  },

  getById(id: string): Promise<BaoCaoResponse> {
    return api.get(`/v1/bao-cao/${id}`);
  },

  create(req: BaoCaoRequest): Promise<BaoCaoResponse> {
    return api.post("/v1/bao-cao", req);
  },

  update(id: string, req: BaoCaoRequest): Promise<BaoCaoResponse> {
    return api.put(`/v1/bao-cao/${id}`, req);
  },
};

/**
 * Shared lookup endpoints
 */
export interface CoSoKinhDoanhSearchResponse {
  maCoSo: string;
  tenCoSo: string;
  soGiayPhep?: string;
  ngayHetHanGiayPhep?: string;
  trangThai?: string;
  maPX?: string;
  tenPhuongXa?: string;
  anhBia?: string;
  soViPham?: number;
  loaiHinhKinhDoanh?: string[];
}

export const coSoKinhDoanhApi = {
  search(
    keyword?: string,
    page: number = 0,
    size: number = 50
  ): Promise<{ content: CoSoKinhDoanhSearchResponse[]; totalElements: number; totalPages: number; number: number }> {
    const params = new URLSearchParams();
    if (keyword) params.append("keyword", keyword);
    params.append("page", page.toString());
    params.append("size", size.toString());
    return api.get(`/user/co-so-kinh-doanh/search?${params.toString()}`);
  },
};

export default api;
