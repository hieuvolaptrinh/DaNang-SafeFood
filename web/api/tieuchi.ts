import { api } from "./client";

// ─────────────────────────────────────────────────────────────────
// Tiêu Chí Đánh Giá (Evaluation Criteria)
// Base: /api/v1/thanhtra/tieu-chi
// ─────────────────────────────────────────────────────────────────

export interface TieuChiDanhGiaResponse {
  maTieuChi: string;
  tenTieuChi: string;
  nhom?: string;
  thuTu?: number;
}

export interface CreateTieuChiRequest {
  maTieuChi?: string;
  tenTieuChi: string;
  nhom?: string;
  thuTu?: number;
}

const TIEU_CHI_BASE = "/v1/thanhtra/tieu-chi";

export interface TieuChiDanhGiaPageResponse {
  content: TieuChiDanhGiaResponse[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  numberOfElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export const tieuChiDanhGiaApi = {
  getList(
    params: { keyword?: string; nhom?: string; page?: number; size?: number } = {},
  ): Promise<TieuChiDanhGiaPageResponse> {
    const qs = new URLSearchParams();
    if (params.keyword) qs.append("keyword", params.keyword);
    if (params.nhom) qs.append("nhom", params.nhom);
    qs.append("page", String(params.page ?? 0));
    qs.append("size", String(params.size ?? 20));
    return api.get(`${TIEU_CHI_BASE}?${qs.toString()}`);
  },

  getById(id: string): Promise<TieuChiDanhGiaResponse> {
    return api.get(`${TIEU_CHI_BASE}/${id}`);
  },

  getNhomOptions(): Promise<string[]> {
    return api.get(`${TIEU_CHI_BASE}/nhom-options`);
  },

  create(body: CreateTieuChiRequest): Promise<TieuChiDanhGiaResponse> {
    return api.post(TIEU_CHI_BASE, body);
  },

  update(id: string, body: Partial<CreateTieuChiRequest>): Promise<TieuChiDanhGiaResponse> {
    return api.put(`${TIEU_CHI_BASE}/${id}`, body);
  },
};
