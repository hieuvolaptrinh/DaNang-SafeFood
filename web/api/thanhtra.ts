import { api } from "./client";

// -----------------------------------------------------------------
// Thanh Tra (Inspection)
// Base: /api/v1/thanhtra
// -----------------------------------------------------------------

export interface ThanhTraItem {
  maThanhTra: string;
  trangThai: string;
  noiDung: string;
  maCoSo: string;
  tenCoSo: string;
  maNguoiPhuTrach: string;
  tenNguoiPhuTrach: string;
}

export interface ThanhTraPageResponse {
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  size: number;
  content: ThanhTraItem[];
  number: number;
  numberOfElements: number;
  empty: boolean;
}

export interface CanBoThanhTraItem {
  maNguoiDung: string;
  hoTen: string;
  gioiTinh: string;
  cccd: string;
}

export interface CreateThanhTraRequest {
  maCoSo: string;
  noiDung: string;
  maNguoiPhuTrach: string;
}

const THANHTRA_BASE = "/v1/thanhtra";

export const thanhTraApi = {
  /** GET /api/v1/thanhtra */
  getList(
    params: { trangThai?: string; page?: number; size?: number } = {},
  ): Promise<ThanhTraPageResponse> {
    const qs = new URLSearchParams();
    if (params.trangThai) qs.append("trangThai", params.trangThai);
    qs.append("page", String(params.page ?? 0));
    qs.append("size", String(params.size ?? 20));
    return api.get(THANHTRA_BASE + "?" + qs.toString());
  },

  /** POST /api/v1/thanhtra */
  create(body: CreateThanhTraRequest): Promise<ThanhTraItem> {
    return api.post(THANHTRA_BASE, body);
  },

  /** GET /api/v1/thanhtra/can-bo-thanh-tra */
  getCanBoThanhTra(): Promise<CanBoThanhTraItem[]> {
    return api.get(THANHTRA_BASE + "/can-bo-thanh-tra");
  },
};
