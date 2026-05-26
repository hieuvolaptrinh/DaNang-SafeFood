import { api } from "./client";

// ─────────────────────────────────────────────────────────────────
// Tiêu Chí Đánh Giá (Evaluation Criteria)
// Base: /api/v1/tieu-chi
// ─────────────────────────────────────────────────────────────────

export interface TieuChiDanhGiaResponse {
  maTieuChi: string;
  tenTieuChi: string;
  nhom?: string;
  thuTu?: number;
}

export interface CreateTieuChiRequest {
  maTieuChi: string;
  tenTieuChi: string;
  nhom?: string;
  thuTu?: number;
}

const TIEU_CHI_BASE = "/v1/tieu-chi";

export const tieuChiDanhGiaApi = {
  getList(): Promise<TieuChiDanhGiaResponse[]> {
    return api.get(TIEU_CHI_BASE);
  },

  getById(id: string): Promise<TieuChiDanhGiaResponse> {
    return api.get(`${TIEU_CHI_BASE}/${id}`);
  },

  create(body: CreateTieuChiRequest): Promise<TieuChiDanhGiaResponse> {
    return api.post(TIEU_CHI_BASE, body);
  },

  update(id: string, body: Partial<CreateTieuChiRequest>): Promise<TieuChiDanhGiaResponse> {
    return api.put(`${TIEU_CHI_BASE}/${id}`, body);
  },
};
