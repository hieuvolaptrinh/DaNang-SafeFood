import { api } from "./client";

// ─────────────────────────────────────────────────────────────────
// Báo Cáo Thanh Tra (Inspection Reports)
// Base: /api/v1/bao-cao
// ─────────────────────────────────────────────────────────────────

export interface BaoCaoResponse {
  id: string;
  tenCoSo?: string;
  loaiThanhTra?: string;
  thanhTraVien?: string;
  ngay?: string;
  ketQua?: string;
  diem?: number;
  nhanXet?: string;
  noiDung?: string;
  maCoSo?: string;
}

export interface BaoCaoStatsResponse {
  total: number;
  completed: number;
  processing: number;
  failed: number;
}

export interface CreateBaoCaoRequest {
  facilityId: string;
  inspectionDate: string;
  inspectionType: string;
  content: string;
  comment?: string;
  result: string;
  score?: number;
  fileName?: string;
  hasInspectionRecord?: boolean;
}

const BAO_CAO_BASE = "/v1/bao-cao";

export const baoCaoApi = {
  getStats(): Promise<BaoCaoStatsResponse> {
    return api.get(`${BAO_CAO_BASE}/thong-ke`);
  },

  search(
    keyword: string = "",
    resultFilter: string = "",
    page: number = 0,
    size: number = 20,
  ): Promise<{ content: BaoCaoResponse[]; totalElements: number; totalPages: number; number: number }> {
    const qs = new URLSearchParams();
    if (keyword) qs.append("keyword", keyword);
    if (resultFilter) qs.append("resultFilter", resultFilter);
    qs.append("page", String(page));
    qs.append("size", String(size));
    return api.get(`${BAO_CAO_BASE}?${qs.toString()}`);
  },

  getById(id: string): Promise<BaoCaoResponse> {
    return api.get(`${BAO_CAO_BASE}/${id}`);
  },

  create(body: CreateBaoCaoRequest): Promise<BaoCaoResponse> {
    return api.post(BAO_CAO_BASE, body);
  },

  update(id: string, body: Partial<CreateBaoCaoRequest>): Promise<BaoCaoResponse> {
    return api.put(`${BAO_CAO_BASE}/${id}`, body);
  },
};
