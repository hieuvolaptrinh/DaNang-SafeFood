import { api } from "./client";

// ─────────────────────────────────────────────────────────────────
// Nhiệm Vụ (Inspection Tasks for CB_THANH_TRA)
// Base: /api/v1/nhiem-vu (or /api/v1/thanhtra based on backend)
// ─────────────────────────────────────────────────────────────────

export interface NhiemVuStatsResponse {
  tongSo: number;
  chuaNhan: number;
  daNhan: number;
}

export interface NhiemVuListItemResponse {
  maThanhTra: string;
  tenCoSo: string;
  thoiGianTT?: string;
  trangThai: string;
  ghiChu?: string;
  lyDoTuChoi?: string;
}

export interface NhiemVuDetailResponse {
  maThanhTra: string;
  tenCoSo: string;
  diaChiCoSo?: string;
  thoiGianTT?: string;
  noiDung?: string;
  trangThai: string;
  ghiChu?: string;
  lyDoTuChoi?: string;
}

const NHIEM_VU_BASE = "/v1/nhiem-vu";

export const nhiemVuApi = {
  getStats(): Promise<NhiemVuStatsResponse> {
    return api.get(`${NHIEM_VU_BASE}/thong-ke`);
  },

  search(
    keyword: string = "",
    trangThai: string = "",
    page: number = 0,
    size: number = 20,
  ): Promise<{ content: NhiemVuListItemResponse[]; totalElements: number; totalPages: number; number: number }> {
    const qs = new URLSearchParams();
    if (keyword) qs.append("keyword", keyword);
    if (trangThai) qs.append("trangThai", trangThai);
    qs.append("page", String(page));
    qs.append("size", String(size));
    return api.get(`${NHIEM_VU_BASE}?${qs.toString()}`);
  },

  getById(id: string): Promise<NhiemVuDetailResponse> {
    return api.get(`${NHIEM_VU_BASE}/${id}`);
  },

  accept(id: string): Promise<void> {
    return api.put(`${NHIEM_VU_BASE}/${id}/nhan`);
  },

  reject(id: string, body: { lyDoTuChoi: string }): Promise<void> {
    return api.put(`${NHIEM_VU_BASE}/${id}/tu-choi`, body);
  },

  updateProgress(
    id: string,
    body: { trangThai: string; ghiChu?: string },
  ): Promise<void> {
    return api.put(`${NHIEM_VU_BASE}/${id}/trang-thai`, body);
  },
};
