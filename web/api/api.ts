import { APP_CONFIG } from "@/constants/config";

const apiURL = process.env.NEXT_PUBLIC_API_URL || APP_CONFIG.API.BASE_URL;

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
