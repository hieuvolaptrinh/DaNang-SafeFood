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
  /**
   * Backward-compatible alias.
   * Some screens expect `coSoKinhDoanhApi.search(keyword, page, size)` returning a page shape.
   *
   * If `keyword` is provided, we use `/dropdown` then wrap to a page-like response.
   * Otherwise we call the normal paged `getList` endpoint.
   */
  async search(
    keyword: string = "",
    page: number = 0,
    size: number = 20,
  ): Promise<CoSoKinhDoanhPageResponse> {
    const trimmed = keyword.trim();

    if (!trimmed) {
      return coSoKinhDoanhApi.getList({ page, size });
    }

    const list = await coSoKinhDoanhApi.getDropdown({ keyword: trimmed });
    const totalElements = list.length;
    const totalPages = size > 0 ? Math.max(1, Math.ceil(totalElements / size)) : 1;
    const start = Math.max(0, page) * (size > 0 ? size : totalElements);
    const end = size > 0 ? start + size : totalElements;
    const content = list.slice(start, end);

    return {
      totalPages,
      totalElements,
      size,
      content,
      number: page,
      first: page <= 0,
      last: page >= totalPages - 1,
      numberOfElements: content.length,
      empty: content.length === 0,
    };
  },

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
