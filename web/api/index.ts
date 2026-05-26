/**
 * API barrel — import từ đây thay vì import riêng từng file.
 *
 * Ví dụ:
 *   import { thongKeApi, coSoKinhDoanhApi } from "@/api";
 *   import type { DashboardSummary } from "@/api";
 */

// Core HTTP client
export { api, type ApiResponse, type FetchOptions } from "./client";

// Domain APIs
export {
  thongKeApi,
  type DashboardSummary,
  type GiayPhepSapHetHan,
  type ThongKeQuanHuyen,
  type ViPhamGanDay,
  type ViPhamTheoThang,
} from "./thongke";

export {
  coSoKinhDoanhApi,
  type CoSoKinhDoanhItem,
  type CoSoKinhDoanhPageResponse,
  type GiayChungNhanItem,
} from "./cosokinhdoanh";

export {
  giayChungNhanApi,
  type GiayChungNhanPageResponse,
  type CreateGiayChungNhanRequest,
} from "./giaychungnhan";

export {
  thanhTraApi,
  type ThanhTraItem,
  type ThanhTraPageResponse,
  type CanBoThanhTraItem,
  type CreateThanhTraRequest,
} from "./thanhtra";

export {
  yeuCauKiemNghiemApi,
  type YeuCauKiemNghiemResponse,
  type CreateYeuCauKiemNghiemRequest,
  type UpdateKetQuaKiemNghiemRequest,
  type YeuCauKiemNghiemStatsResponse,
} from "./yeucaukiemnghiem";

export {
  ketQuaKiemNghiemApi,
  type KetQuaKiemNghiemStatsResponse,
  type KetQuaKiemNghiemChiTieuResponse,
  type KetQuaKiemNghiemItemResponse,
  type KetQuaKiemNghiemDetailResponse,
} from "./ketquakiemnghiem";
