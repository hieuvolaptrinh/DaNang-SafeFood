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
  maChuSoHuu?: string;
  tenChuSoHuu?: string;
  anhBia?: string;
  soViPham?: number;
  loaiHinhKinhDoanh?: string[];
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

export interface GiayPhepItem {
  maHoSo: string;
  maLoaiGiayTo?: string | null;
  tenLoaiGiayTo?: string | null;
  trangThai: string;
  ngayNop?: string | null;
  ngayCap?: string | null;
  ngayHetHan?: string | null;
  maCoSo: string;
  tenCoSo: string;
}

interface CoSoKinhDoanhUserDetailResponse {
  coSo: CoSoKinhDoanhItem;
  anhBia?: string | null;
  soViPham?: number | null;
  loaiHinhKinhDoanh?: string[] | null;
  chungNhan?: GiayChungNhanItem[] | null;
  giayPhep?: GiayPhepItem[] | null;
}

const CSKD_BASE = "/v1/cosokinhdoanh";
const CSKD_USER_BASE = "/user/co-so-kinh-doanh";

export const coSoKinhDoanhApi = {
  /**
   * Backward-compatible alias.
   * Some screens expect `coSoKinhDoanhApi.search(keyword, page, size)` returning a page shape.
   *
   * Use the user search endpoint to avoid role-name mismatch between modules
   * (`/api/v1/cosokinhdoanh` currently checks CAN_BO_THANH_TRA vs JWT role CB_THANH_TRA).
   */
  async search(
    keyword: string = "",
    page: number = 0,
    size: number = 20,
  ): Promise<CoSoKinhDoanhPageResponse> {
    const qs = new URLSearchParams();
    if (keyword.trim()) qs.append("keyword", keyword.trim());
    qs.append("page", String(page));
    qs.append("size", String(size));

    // Note: response content items follow `CoSoKinhDoanhSearchResponse` from BE.
    const res = await api.get<CoSoKinhDoanhPageResponse>(`/user/co-so-kinh-doanh/search?${qs.toString()}`);

    // Ensure optional fields exist on item type for consumers like thanh-tra-kiem-dinh.
    return res;
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

    // Use user search endpoint to avoid role-name mismatch between modules
    // (`/api/v1/cosokinhdoanh` checks CAN_BO_THANH_TRA while JWT role is CB_THANH_TRA).
    return api.get(`/user/co-so-kinh-doanh/search?${qs.toString()}`);
  },

  getById(id: string): Promise<CoSoKinhDoanhItem> {
    // Use user detail endpoint so both thanh-tra and lanh-dao accounts can view
    // without depending on role-name mapping in /api/v1/cosokinhdoanh.
    return api
      .get<CoSoKinhDoanhUserDetailResponse>(`${CSKD_USER_BASE}/${id}`)
      .then((detail) => ({
        ...(detail.coSo as CoSoKinhDoanhItem),
        anhBia: detail.anhBia ?? undefined,
        soViPham: detail.soViPham ?? undefined,
        loaiHinhKinhDoanh: detail.loaiHinhKinhDoanh ?? undefined,
      }));
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
    // Prefer the user detail endpoint (includes certificates) to avoid 403 for CB_THANH_TRA / LD_ATVSTP.
    return api
      .get<CoSoKinhDoanhUserDetailResponse>(`${CSKD_USER_BASE}/${id}`)
      .then((detail) => detail.chungNhan ?? []);
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
