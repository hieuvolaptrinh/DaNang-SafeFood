import { api } from "./client";

// ─────────────────────────────────────────────────────────────────
// Kết Quả Kiểm Nghiệm
// Base: /api/v1/ket-qua-kiem-nghiem
// ─────────────────────────────────────────────────────────────────

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

export interface KetQuaKiemNghiemDetailResponse {
  maKetQua: string;
  maMau: string;
  tenCoSo: string;
  tenMau: string;
  loaiMau: string;
  ngayKiemNghiem?: string | null;
  phongLab?: string | null;
  ketQua: string;
  ketQuaKiemNghiem?: string | null;
  lyDoKhongDat?: string | null;
  chiTieu?: string | null;
  diem?: number | null;
  fileKetQua?: string | null;
  chiTietChiTieu: KetQuaKiemNghiemChiTieuResponse[];
}

const BASE_URL = "/v1/ket-qua-kiem-nghiem";

export const ketQuaKiemNghiemApi = {
  getStats(): Promise<KetQuaKiemNghiemStatsResponse> {
    return api.get(`${BASE_URL}/stats`);
  },

  search(
    keyword?: string,
    result?: string,
    page: number = 0,
    size: number = 10,
  ): Promise<{
    content: KetQuaKiemNghiemItemResponse[];
    totalElements: number;
    totalPages: number;
    number: number;
  }> {
    const params = new URLSearchParams();
    if (keyword) params.append("keyword", keyword);
    if (result) params.append("result", result);
    params.append("page", page.toString());
    params.append("size", size.toString());
    return api.get(`${BASE_URL}?${params.toString()}`);
  },

  getById(maKetQua: string): Promise<KetQuaKiemNghiemDetailResponse> {
    return api.get(`${BASE_URL}/${maKetQua}`);
  },
};
