import { api } from "./client";
import type { GiayChungNhanItem } from "./cosokinhdoanh";

// Re-export so consumers can import from one place
export type { GiayChungNhanItem };

// -----------------------------------------------------------------
// Giấy Chứng Nhận (Certificate)
// Base: /api/v1/giaychungnhan
// -----------------------------------------------------------------

export interface GiayChungNhanPageResponse {
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  size: number;
  content: GiayChungNhanItem[];
  number: number;
  numberOfElements: number;
  empty: boolean;
}

export interface CreateGiayChungNhanRequest {
  maCoSo: string;
  tenChungNhan: string;
  ngayBanHanh: string;
  ngayHetHan: string;
  trangThai: string;
}

const GCN_BASE = "/v1/giaychungnhan";

export const giayChungNhanApi = {
  /** GET /api/v1/giaychungnhan */
  getList(
    params: { trangThai?: string; page?: number; size?: number } = {},
  ): Promise<GiayChungNhanPageResponse> {
    const qs = new URLSearchParams();
    if (params.trangThai) qs.append("trangThai", params.trangThai);
    qs.append("page", String(params.page ?? 0));
    qs.append("size", String(params.size ?? 20));
    return api.get(GCN_BASE + "?" + qs.toString());
  },

  /** POST /api/v1/giaychungnhan */
  create(body: CreateGiayChungNhanRequest): Promise<GiayChungNhanItem> {
    return api.post(GCN_BASE, body);
  },

  /** GET /api/v1/giaychungnhan/{maCN} */
  getById(maCN: string): Promise<GiayChungNhanItem> {
    return api.get(GCN_BASE + "/" + maCN);
  },

  /** PATCH /api/v1/giaychungnhan/{maCN}/pheduyet — approve */
  pheDuyet(maCN: string): Promise<GiayChungNhanItem> {
    return api.patch(GCN_BASE + "/" + maCN + "/pheduyet");
  },

  /** PATCH /api/v1/giaychungnhan/{maCN}/tuchoi — reject */
  tuChoi(maCN: string, lyDo: string): Promise<GiayChungNhanItem> {
    return api.patch(GCN_BASE + "/" + maCN + "/tuchoi", { lyDo });
  },
};
