import { api } from "./client";

// -----------------------------------------------------------------
// Ho So Thanh Tra (Inspection dossiers)
// Base: /api/v1/ho-so-thanh-tra
// -----------------------------------------------------------------

export interface HoSoThanhTraResponse {
  id: string;
  facilityId: string;
  business: string;
  type: string;
  inspector: string;
  date: string;
  result: string;
  score: number;
  businessName: string;
  address: string;
  phone: string;
  owner: string;
  businessType: string;
  inspectionTime: string;
  businessLicense: string;
  foodSafetyCertificate: string;
  healthCertificate: string;
  trainingCertificate: string;
  checklist: Record<string, string>;
  violationStatus: string;
  violationDescription: string;
  conclusion: string;
  generalComment: string;
  actionMeasure: string;
  recommendation: string;
}

export interface HoSoThanhTraStatsResponse {
  total: number;
  completed: number;
  scheduled: number;
  failed: number;
}

export interface HoSoThanhTraRequest {
  facilityId: string;
  inspectionTime: string;
  businessLicense: string;
  foodSafetyCertificate: string;
  healthCertificate: string;
  trainingCertificate: string;
  checklist: Record<string, string>;
  violationStatus: string;
  violationDescription: string;
  conclusion: string;
  generalComment: string;
  actionMeasure: string;
  recommendation: string;
}

const HOSO_THANHTRA_BASE = "/v1/ho-so-thanh-tra";

export const hoSoThanhTraApi = {
  getStats(): Promise<HoSoThanhTraStatsResponse> {
    return api.get(`${HOSO_THANHTRA_BASE}/thong-ke`);
  },

  search(
    keyword: string = "",
    resultFilter: string = "",
    inspectorFilter: string = "",
    page: number = 0,
    size: number = 20,
  ): Promise<{ content: HoSoThanhTraResponse[]; totalElements: number; totalPages: number; number: number }> {
    const qs = new URLSearchParams();
    if (keyword) qs.append("keyword", keyword);
    if (resultFilter) qs.append("resultFilter", resultFilter);
    if (inspectorFilter) qs.append("inspectorFilter", inspectorFilter);
    qs.append("page", String(page));
    qs.append("size", String(size));
    return api.get(`${HOSO_THANHTRA_BASE}?${qs.toString()}`);
  },

  getById(id: string): Promise<HoSoThanhTraResponse> {
    return api.get(`${HOSO_THANHTRA_BASE}/${id}`);
  },

  create(req: HoSoThanhTraRequest): Promise<HoSoThanhTraResponse> {
    return api.post(`${HOSO_THANHTRA_BASE}`, req);
  },

  update(id: string, req: HoSoThanhTraRequest): Promise<HoSoThanhTraResponse> {
    return api.put(`${HOSO_THANHTRA_BASE}/${id}`, req);
  },
};

