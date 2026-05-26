import { api } from "./client";

// ─────────────────────────────────────────────────────────────────
// Kết Quả Kiểm Nghiệm
// Base: /api/ket-qua-kiem-nghiem
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

export interface KetQuaKiemNghiemDetailResponse
  extends KetQuaKiemNghiemItemResponse {
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
    return api.get(`/ket-qua-kiem-nghiem?${params.toString()}`);
  },

  getById(maKetQua: string): Promise<KetQuaKiemNghiemDetailResponse> {
    return api.get(`/ket-qua-kiem-nghiem/${maKetQua}`);
  },
};
