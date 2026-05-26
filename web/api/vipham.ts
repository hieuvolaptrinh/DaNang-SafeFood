import { api } from "./client";

// ─────────────────────────────────────────────────────────────────
// Vi Phạm (Violations)
// Base: /api/vi-pham
// ─────────────────────────────────────────────────────────────────

export type TrangThaiPheDuyet = "Đã Duyệt" | "Chờ Duyệt" | "Từ Chối";

export interface ViPhamItem {
  maViPham: string;
  moTaThem?: string;
  khacPhuc?: string;
  trangThaiPheDuyet: TrangThaiPheDuyet | string;
  mucDo: string;
  maHoSo: string;
  tenLoaiViPham: string;
  maCoSo: string;
  tenCoSo: string;
  tongTienPhat: number;
  yeuCauKhacPhuc?: string;
  lyDo?: string;
}

export interface ViPhamPageResponse {
  totalPages: number;
  totalElements: number;
  size: number;
  content: ViPhamItem[];
  number: number;
  numberOfElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

const VI_PHAM_BASE = "/vi-pham";

export const viPhamApi = {
  /** GET /api/vi-pham */
  getList(params: {
    trangThaiPheDuyet?: string;
    page?: number;
    size?: number;
  } = {}): Promise<ViPhamPageResponse> {
    const qs = new URLSearchParams();
    if (params.trangThaiPheDuyet) qs.append("trangThaiPheDuyet", params.trangThaiPheDuyet);
    qs.append("page", String(params.page ?? 0));
    qs.append("size", String(params.size ?? 20));
    return api.get(`${VI_PHAM_BASE}?${qs.toString()}`);
  },

  /** GET /api/vi-pham/{maViPham} */
  getById(maViPham: string): Promise<ViPhamItem> {
    return api.get(`${VI_PHAM_BASE}/${maViPham}`);
  },

  /** PUT /api/v1/vi-pham/{maViPham}/phe-duyet */
  pheDuyet(maViPham: string, trangThai: string): Promise<ViPhamItem> {
    return api.put(`/v1/vi-pham/${maViPham}/phe-duyet`, { trangThai });
  },
};
