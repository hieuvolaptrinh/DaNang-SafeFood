import { api } from "./client";

// ─────────────────────────────────────────────────────────────────
// Phản Ánh Công Dân (Citizen Feedback)
// Base: /api/v1/phananh
// ─────────────────────────────────────────────────────────────────

export type TrangThaiPhanAnh =
  | "CHO_XU_LY"
  | "DANG_XU_LY"
  | "DA_XU_LY"
  | "TU_CHOI";

export interface PhanAnhItem {
  maPhanAnh: string;
  trangThaiPhanAnh: TrangThaiPhanAnh | string;
  tieuDe: string;
  lyDo: string;
  diaDiem: string;
  ghiChu: string;
  ngayGui: string; // ISO date-time
  maNguoiPhanAnh: string;
  tenNguoiPhanAnh: string;
  maCoSo: string;
  tenCoSo: string;
}

export interface PhanAnhPageResponse {
  totalPages: number;
  totalElements: number;
  size: number;
  content: PhanAnhItem[];
  number: number; // current page (0-indexed)
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
}

export interface UpdatePhanAnhRequest {
  trangThaiPhanAnh: TrangThaiPhanAnh | string;
  ghiChu: string;
}

const BASE = "/v1/phananh";

export const phanAnhApi = {
  /**
   * Lấy danh sách phản ánh có phân trang, lọc theo trạng thái và khoảng thời gian.
   */
  search(params: {
    trangThai?: string;
    from?: string; // ISO date-time
    to?: string;   // ISO date-time
    page?: number;
    size?: number;
    sort?: string[];
  }): Promise<PhanAnhPageResponse> {
    const qs = new URLSearchParams();
    if (params.trangThai) qs.append("trangThai", params.trangThai);
    if (params.from)      qs.append("from", params.from);
    if (params.to)        qs.append("to", params.to);
    qs.append("page", String(params.page ?? 0));
    qs.append("size", String(params.size ?? 20));
    (params.sort ?? []).forEach((s) => qs.append("sort", s));
    return api.get<PhanAnhPageResponse>(`${BASE}?${qs.toString()}`);
  },

  /**
   * Lấy chi tiết một phản ánh theo mã.
   */
  getById(id: string): Promise<PhanAnhItem> {
    return api.get<PhanAnhItem>(`${BASE}/${id}`);
  },

  /**
   * Cập nhật trạng thái + ghi chú xử lý của phản ánh.
   */
  update(id: string, body: UpdatePhanAnhRequest): Promise<PhanAnhItem> {
    return api.put<PhanAnhItem>(`${BASE}/${id}`, body);
  },
};
