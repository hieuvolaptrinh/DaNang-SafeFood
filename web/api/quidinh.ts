import { api } from "./client";

// ─────────────────────────────────────────────────────────────────
// Quy Định Pháp Luật (Regulations)
// Base: /api/v1/regulations
// ─────────────────────────────────────────────────────────────────

export type LoaiQuyDinh = "QUY_DINH" | "HUONG_DAN" | "THONG_TU" | "NGHI_DINH";
export type TrangThaiQuyDinh = "NHAP" | "HIEU_LUC" | "HET_HIEU_LUC";

export interface QuyDinhItem {
  maQuyDinh: string;
  tieuDe: string;
  noiDung: string;
  loai: LoaiQuyDinh | string;
  trangThai: TrangThaiQuyDinh | string;
  ngayBanHanh: string; // date (YYYY-MM-DD)
  createdBy: string;
  createdAt: string;   // ISO date-time
  updatedAt: string;   // ISO date-time
}

export interface QuyDinhPageResponse {
  totalPages: number;
  totalElements: number;
  size: number;
  content: QuyDinhItem[];
  number: number;
  numberOfElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface CreateQuyDinhRequest {
  tieuDe: string;
  noiDung: string;
  loai: LoaiQuyDinh | string;
  trangThai: TrangThaiQuyDinh | string;
  ngayBanHanh: string; // YYYY-MM-DD
}

const BASE = "/v1/regulations";

export const quyDinhApi = {
  /**
   * GET /api/v1/regulations — lấy danh sách, lọc theo trangThai
   */
  search(params: {
    trangThai?: TrangThaiQuyDinh | string;
    page?: number;
    size?: number;
    sort?: string[];
  } = {}): Promise<QuyDinhPageResponse> {
    const qs = new URLSearchParams();
    if (params.trangThai) qs.append("trangThai", params.trangThai);
    qs.append("page", String(params.page ?? 0));
    qs.append("size", String(params.size ?? 20));
    (params.sort ?? []).forEach((s) => qs.append("sort", s));
    return api.get<QuyDinhPageResponse>(`${BASE}?${qs.toString()}`);
  },

  /**
   * POST /api/v1/regulations — tạo quy định mới
   */
  create(body: CreateQuyDinhRequest): Promise<QuyDinhItem> {
    return api.post<QuyDinhItem>(BASE, body);
  },

  /**
   * PUT /api/v1/regulations/{id} — chỉnh sửa quy định
   */
  update(id: string, body: CreateQuyDinhRequest): Promise<QuyDinhItem> {
    return api.put<QuyDinhItem>(`${BASE}/${id}`, body);
  },
};
