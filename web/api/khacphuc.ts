import { api } from "./client";

// ─────────────────────────────────────────────────────────────────
// Khắc Phục Vi Phạm (Remediation Tracking)
// Base: /api/v1/khacphuc
// ─────────────────────────────────────────────────────────────────

export type TinhTrangKhacPhuc =
  | "CHUA_KHAC_PHUC"
  | "DANG_KHAC_PHUC"
  | "DA_KHAC_PHUC";

export interface KhacPhucItem {
  maHinhThucKhacPhuc: string;
  soTienKhacPhuc: number;
  tinhTrangKhacPhuc: TinhTrangKhacPhuc | string;
  noiDungKhacPhuc: string | null;
  maViPham: string;
}

export interface KhacPhucPageResponse {
  totalPages: number;
  totalElements: number;
  size: number;
  content: KhacPhucItem[];
  number: number; // current page (0-indexed)
  numberOfElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

const BASE = "/v1/khacphuc";

export const khacPhucApi = {
  /**
   * Lấy danh sách khắc phục có phân trang.
   * Có thể lọc theo tinhTrang và/hoặc maViPham.
   */
  search(params: {
    tinhTrang?: TinhTrangKhacPhuc | string;
    maViPham?: string;
    page?: number;
    size?: number;
  } = {}): Promise<KhacPhucPageResponse> {
    const qs = new URLSearchParams();
    if (params.tinhTrang) qs.append("tinhTrang", params.tinhTrang);
    if (params.maViPham)  qs.append("maViPham",  params.maViPham);
    qs.append("page", String(params.page ?? 0));
    qs.append("size", String(params.size ?? 20));
    return api.get<KhacPhucPageResponse>(`${BASE}?${qs.toString()}`);
  },

  /**
   * Lấy chi tiết một hình thức khắc phục theo mã.
   */
  getById(id: string): Promise<KhacPhucItem> {
    return api.get<KhacPhucItem>(`${BASE}/${id}`);
  },
};
