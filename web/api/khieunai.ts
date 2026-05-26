import { api } from "./client";

// ─────────────────────────────────────────────────────────────────
// Khiếu Nại (Complaints)
// Base: /api/v1/khieu-nai
// ─────────────────────────────────────────────────────────────────

export interface KhieuNaiSummaryResponse {
  id: string;
  title: string;
  submitter: string;
  submitterPhone?: string;
  submittedAt: string;
  status: "pending" | "processing" | "resolved" | "closed";
}

export interface KhieuNaiEvidenceItem {
  id: string;
  label: string;
  kind: string;
  note?: string;
  url?: string;
}

export interface KhieuNaiDetailResponse {
  id: string;
  title: string;
  content: string;
  submittedAt: string;
  status: "pending" | "processing" | "resolved" | "closed";
  submitterInfo: {
    fullName: string;
    phone?: string;
    email?: string;
    address?: string;
  };
  evidence: KhieuNaiEvidenceItem[];
  handlingResult?: string;
  inspectionSummary?: string;
  inspectionCompleted: boolean;
}

const KHIEU_NAI_BASE = "/v1/khieu-nai";

export const khieuNaiApi = {
  search(
    keyword: string = "",
    trangThai: string = "",
    page: number = 0,
    size: number = 20,
  ): Promise<{ content: KhieuNaiSummaryResponse[]; totalElements: number; totalPages: number; number: number }> {
    const qs = new URLSearchParams();
    if (keyword) qs.append("keyword", keyword);
    if (trangThai) qs.append("trangThai", trangThai);
    qs.append("page", String(page));
    qs.append("size", String(size));
    return api.get(`${KHIEU_NAI_BASE}?${qs.toString()}`);
  },

  getById(id: string): Promise<KhieuNaiDetailResponse> {
    return api.get(`${KHIEU_NAI_BASE}/${id}`);
  },

  updateInspection(
    id: string,
    body: { tomTatKiemTra: string },
  ): Promise<KhieuNaiDetailResponse> {
    return api.patch(`${KHIEU_NAI_BASE}/${id}/kiem-tra`, body);
  },

  updateHandling(
    id: string,
    body: { ketQuaXuLy: string; trangThai: string },
  ): Promise<KhieuNaiDetailResponse> {
    return api.patch(`${KHIEU_NAI_BASE}/${id}/xu-ly`, body);
  },
};
