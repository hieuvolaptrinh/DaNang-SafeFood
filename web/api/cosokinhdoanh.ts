import { api } from "./client";

// ─────────────────────────────────────────────────────────────────
// Cơ sở kinh doanh
// Base: /api/v1/cosokinhdoanh
// ─────────────────────────────────────────────────────────────────

export interface CoSoKinhDoanhItem {
  maCoSo: string;
  tenCoSo: string;
  soGiayPhep: string;
  ngayHetHanGiayPhep: string;
  trangThai: string;
  maPX: string;
  tenPhuongXa: string;
  maChuSoHuu: string;
  tenChuSoHuu: string;
}

export interface CoSoKinhDoanhPageResponse {
  totalPages: number;
  totalElements: number;
  size: number;
  content: CoSoKinhDoanhItem[];
  number: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
}

export interface GiayChungNhanItem {
  maCN: string;
  tenChungNhan: string;
  ngayBanHanh: string;
  ngayHetHan: string;
  trangThai: string;
  maCoSo: string;
  tenCoSo: string;
}

const CSKD_BASE = "/v1/cosokinhdoanh";

export const coSoKinhDoanhApi = {
  getList(
    params: {
      trangThai?: string;
      maPX?: string;
      page?: number;
      size?: number;
    } = {},
  ): Promise<CoSoKinhDoanhPageResponse> {
    const qs = new URLSearchParams();
    if (params.trangThai) qs.append("trangThai", params.trangThai);
    if (params.maPX) qs.append("maPX", params.maPX);
    qs.append("page", String(params.page ?? 0));
    qs.append("size", String(params.size ?? 20));
    return api.get(CSKD_BASE + "?" + qs.toString());
  },

  getById(id: string): Promise<CoSoKinhDoanhItem> {
    return api.get(CSKD_BASE + "/" + id);
  },

  updateDangKy(
    id: string,
    body: {
      tenCoSo: string;
      soGiayPhep: string;
      ngayHetHanGiayPhep: string;
      trangThai: string;
      maPX: string;
    },
  ): Promise<CoSoKinhDoanhItem> {
    return api.put(CSKD_BASE + "/" + id + "/dangky", body);
  },

  getGiayChungNhan(id: string): Promise<GiayChungNhanItem[]> {
    return api.get(CSKD_BASE + "/" + id + "/giaychungnhan");
  },

  kiemTra(
    id: string,
    body: { noiDung: string; maNguoiPhuTrach: string },
  ): Promise<unknown> {
    return api.post(CSKD_BASE + "/" + id + "/kiemtra", body);
  },

  getDropdown(
    params: { keyword?: string; trangThai?: string } = {},
  ): Promise<CoSoKinhDoanhItem[]> {
    const qs = new URLSearchParams();
    if (params.keyword) qs.append("keyword", params.keyword);
    if (params.trangThai) qs.append("trangThai", params.trangThai);
    return api.get(CSKD_BASE + "/dropdown?" + qs.toString());
  },
};
