import { api } from "./client";

// ─────────────────────────────────────────────────────────────────
// Mẫu Kiểm Nghiệm (Testing Samples)
// Base: /api/mau-kiem-nghiem
// ─────────────────────────────────────────────────────────────────

export interface MauKiemNghiemItem {
  maMau: string;
  tenMau: string;
  ngayThu: string; // YYYY-MM-DD
  ngayKiemNghiem: string; // YYYY-MM-DD
  trangThai: string;
  loaiMau: string;
  noiDung: string;
  ngayYeuCau: string; // YYYY-MM-DD
  hanHoanThanh: string; // YYYY-MM-DD
}

export interface MauKiemNghiemPageResponse {
  totalPages: number;
  totalElements: number;
  size: number;
  content: MauKiemNghiemItem[];
  number: number;
  numberOfElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface MauKiemNghiemSelectOption {
  maMau: string;
  tenSanPham: string;
  loaiMau: string;
  coSoKinhDoanh: string;
}

const MAU_KIEM_NGHIEM_BASE = "/mau-kiem-nghiem";

export const mauKiemNghiemApi = {
  /**
   * Lấy danh sách mẫu kiểm nghiệm
   */
  getList(params: {
    trangThai?: string;
    page?: number;
    size?: number;
    sort?: string[];
  } = {}): Promise<MauKiemNghiemPageResponse> {
    const qs = new URLSearchParams();
    if (params.trangThai) qs.append("trangThai", params.trangThai);
    qs.append("page", String(params.page ?? 0));
    qs.append("size", String(params.size ?? 20));
    if (params.sort) {
      params.sort.forEach(s => qs.append("sort", s));
    }
    return api.get<MauKiemNghiemPageResponse>(`${MAU_KIEM_NGHIEM_BASE}?${qs.toString()}`);
  },

  /**
   * Lấy chi tiết mẫu kiểm nghiệm theo mã
   */
  getById(maMau: string): Promise<MauKiemNghiemItem> {
    return api.get<MauKiemNghiemItem>(`${MAU_KIEM_NGHIEM_BASE}/${maMau}`);
  },

  /**
   * Cập nhật trạng thái mẫu kiểm nghiệm
   */
  updateTrangThai(
    maMau: string,
    body: { trangThai: string; ghiChu?: string }
  ): Promise<MauKiemNghiemItem> {
    return api.patch<MauKiemNghiemItem>(`${MAU_KIEM_NGHIEM_BASE}/${maMau}/trang-thai`, body);
  },

  /**
   * Lấy danh sách mẫu kiểm nghiệm để select
   */
  getSelectOptions(): Promise<MauKiemNghiemSelectOption[]> {
    return api.get<MauKiemNghiemSelectOption[]>(`${MAU_KIEM_NGHIEM_BASE}/select`);
  },

  /**
   * Lấy danh sách chỉ tiêu của một mẫu kiểm nghiệm
   */
  getChiTieuList(maMau: string): Promise<MauChiTieuItem[]> {
    return api.get<MauChiTieuItem[]>(`${MAU_KIEM_NGHIEM_BASE}/${maMau}/chi-tieu`);
  },

  /**
   * Cập nhật danh sách chỉ tiêu của một mẫu kiểm nghiệm
   */
  updateChiTieuList(maMau: string, body: SaveMauChiTieuRequest): Promise<MauChiTieuItem[]> {
    return api.put<MauChiTieuItem[]>(`${MAU_KIEM_NGHIEM_BASE}/${maMau}/chi-tieu`, body);
  },

  /**
   * Lấy danh mục chỉ tiêu kiểm nghiệm
   */
  getDanhMucChiTieu(): Promise<DanhMucChiTieuItem[]> {
    return api.get<DanhMucChiTieuItem[]>("/danh-muc/chi-tieu");
  }
};

export interface MauChiTieuItem {
  maMau: string;
  maChiTieu: string;
  tenChiTieu: string;
  giaTriDo: string;
  gioiHanChoPhep: string;
  ketQua: string;
}

export interface SaveMauChiTieuRequest {
  chiTieus: {
    maChiTieu: string;
    giaTriDo: string;
    gioiHanChoPhep: string;
    ketQua: string;
  }[];
}

export interface DanhMucChiTieuItem {
  maChiTieu: string;
  tenChiTieu: string;
}
