import { api } from "./client";

// ─────────────────────────────────────────────────────────────────
// Yêu Cầu Kiểm Nghiệm
// Base: /api/v1/yeu-cau-kiem-nghiem
// ─────────────────────────────────────────────────────────────────

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

export interface YeuCauKiemNghiemMauOptionResponse {
  maMau: string;
  maCoSo: string;
  tenMau: string;
  loaiMau: string;
  tenCoSo: string;
  ngayThu: string; // ISO date
}

export interface NguoiDungOptionResponse {
  maNguoiDung: string;
  hoTen: string;
  gioiTinh?: string;
  cccd?: string;
}

const YEU_CAU_BASE = "/v1/yeu-cau-kiem-nghiem";

export const yeuCauKiemNghiemApi = {
  getStats(): Promise<YeuCauKiemNghiemStatsResponse> {
    return api.get(`${YEU_CAU_BASE}/stats`);
  },

  /** Danh sách mẫu để tạo yêu cầu */
  getMauOptions(): Promise<YeuCauKiemNghiemMauOptionResponse[]> {
    return api.get(`${YEU_CAU_BASE}/mau-options`);
  },

  /** Danh sách kiểm nghiệm viên để chọn khi tạo yêu cầu */
  getKiemNghiemVienOptions(): Promise<NguoiDungOptionResponse[]> {
    return api.get(`${YEU_CAU_BASE}/kiem-nghiem-vien-options`);
  },

  searchYeuCau(
    keyword?: string,
    status?: string,
    page: number = 0,
    size: number = 10,
  ): Promise<{
    content: YeuCauKiemNghiemResponse[];
    totalElements: number;
    totalPages: number;
    currentPage: number;
  }> {
    const params = new URLSearchParams();
    if (keyword) params.append("keyword", keyword);
    if (status) params.append("status", status);
    params.append("page", page.toString());
    params.append("size", size.toString());
    return api.get(`${YEU_CAU_BASE}?${params.toString()}`);
  },

  getById(maYeuCau: string): Promise<YeuCauKiemNghiemResponse> {
    return api.get(`${YEU_CAU_BASE}/${maYeuCau}`);
  },

  create(
    req: CreateYeuCauKiemNghiemRequest,
  ): Promise<YeuCauKiemNghiemResponse> {
    return api.post(`${YEU_CAU_BASE}`, req);
  },

  updateKetQua(
    maYeuCau: string,
    req: UpdateKetQuaKiemNghiemRequest,
  ): Promise<YeuCauKiemNghiemResponse> {
    return api.put(`${YEU_CAU_BASE}/${maYeuCau}/ket-qua`, req);
  },
};
