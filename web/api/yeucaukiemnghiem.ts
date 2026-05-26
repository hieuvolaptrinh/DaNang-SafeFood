import { api } from "./client";

// ─────────────────────────────────────────────────────────────────
// Yêu Cầu Kiểm Nghiệm
// Base: /api/yeu-cau-kiem-nghiem
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

export const yeuCauKiemNghiemApi = {
  getStats(): Promise<YeuCauKiemNghiemStatsResponse> {
    return api.get("/yeu-cau-kiem-nghiem/stats");
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
    return api.get(`/yeu-cau-kiem-nghiem?${params.toString()}`);
  },

  getById(maYeuCau: string): Promise<YeuCauKiemNghiemResponse> {
    return api.get(`/yeu-cau-kiem-nghiem/${maYeuCau}`);
  },

  create(
    req: CreateYeuCauKiemNghiemRequest,
  ): Promise<YeuCauKiemNghiemResponse> {
    return api.post("/yeu-cau-kiem-nghiem", req);
  },

  updateKetQua(
    maYeuCau: string,
    req: UpdateKetQuaKiemNghiemRequest,
  ): Promise<YeuCauKiemNghiemResponse> {
    return api.put(`/yeu-cau-kiem-nghiem/${maYeuCau}/ket-qua`, req);
  },
};
