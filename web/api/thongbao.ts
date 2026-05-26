import { api } from "./client";

// ─────────────────────────────────────────────────────────────────
// Thông Báo (Notifications)
// Base: /api/v1/thongbao
// ─────────────────────────────────────────────────────────────────

export interface ThongBaoItem {
  maThongBao: string;
  tieuDe: string;
  noiDung: string;
  ngayGui: string; // ISO date-time
  loaiThongBao: string;
  isCongDong: boolean;
}

export interface ThongBaoPageResponse {
  totalPages: number;
  totalElements: number;
  size: number;
  content: ThongBaoItem[];
  number: number;
  numberOfElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface CreateThongBaoRequest {
  tieuDe: string;
  noiDung: string;
  loaiThongBao: string;
  isCongDong: boolean;
}

const BASE = "/v1/thongbao";

export const thongBaoApi = {
  /**
   * GET /api/v1/thongbao — lấy danh sách, lọc theo loai và isCongDong
   */
  search(params: {
    loai?: string;
    isCongDong?: boolean;
    page?: number;
    size?: number;
    sort?: string[];
  } = {}): Promise<ThongBaoPageResponse> {
    const qs = new URLSearchParams();
    if (params.loai !== undefined && params.loai !== "") qs.append("loai", params.loai);
    if (params.isCongDong !== undefined) qs.append("isCongDong", String(params.isCongDong));
    qs.append("page", String(params.page ?? 0));
    qs.append("size", String(params.size ?? 20));
    (params.sort ?? []).forEach((s) => qs.append("sort", s));
    return api.get<ThongBaoPageResponse>(`${BASE}?${qs.toString()}`);
  },

  /**
   * POST /api/v1/thongbao — tạo thông báo mới
   */
  create(body: CreateThongBaoRequest): Promise<ThongBaoItem> {
    return api.post<ThongBaoItem>(BASE, body);
  },

  /**
   * PUT /api/v1/thongbao/{id} — chỉnh sửa thông báo
   */
  update(id: string, body: CreateThongBaoRequest): Promise<ThongBaoItem> {
    return api.put<ThongBaoItem>(`${BASE}/${id}`, body);
  },
};
